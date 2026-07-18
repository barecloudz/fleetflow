'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendShopCreatedEmail } from '@/lib/emails'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'platform_admin') throw new Error('Not authorized')
  return supabase
}

export async function createShop(prevState: { error?: string; success?: string } | null, formData: FormData) {
  try {
    await requireAdmin()
    const adminClient = createAdminClient()

    const name = formData.get('name') as string
    const ownerEmail = formData.get('owner_email') as string
    const tempPassword = formData.get('temp_password') as string
    const phone = formData.get('phone') as string
    const plan = formData.get('plan') as string
    const status = formData.get('status') as string

    // 1. Create the shop row
    const { data: shop, error: shopError } = await adminClient
      .from('shops')
      .insert({ name, phone: phone || null, plan, subscription_status: status })
      .select('id')
      .single()

    if (shopError) return { error: shopError.message }

    // 2. Create the owner's auth account (email_confirm: true = no email verification needed)
    const { error: userError } = await adminClient.auth.admin.createUser({
      email: ownerEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        shop_id: shop.id,
        first_name: '',
        last_name: '',
        role: 'owner',
      },
    })

    if (userError) {
      // Roll back shop creation if user creation fails
      await adminClient.from('shops').delete().eq('id', shop.id)
      return { error: userError.message }
    }

    // Send credentials email (non-blocking)
    sendShopCreatedEmail({ to: ownerEmail, shopName: name, tempPassword, plan }).catch(console.error)

    revalidatePath('/admin/shops')
    revalidatePath('/admin')
    return { success: `${name} created. Login credentials sent to ${ownerEmail}.` }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateShopStatus(shopId: string, status: string, plan?: string) {
  try {
    const supabase = await requireAdmin()

    const updates: Record<string, unknown> = { subscription_status: status }
    if (plan) updates.plan = plan

    if (status === 'past_due') {
      const grace = new Date()
      grace.setDate(grace.getDate() + 30)
      updates.subscription_grace_until = grace.toISOString()
    } else {
      updates.subscription_grace_until = null
    }

    const { error } = await supabase.from('shops').update(updates).eq('id', shopId)
    if (error) throw new Error(error.message)

    revalidatePath('/admin/shops')
    revalidatePath('/admin/subscriptions')
    revalidatePath('/admin')
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function deleteShop(shopId: string) {
  try {
    const adminClient = createAdminClient()
    await requireAdmin()

    // Delete all auth users belonging to this shop (via profiles)
    const { data: profiles } = await adminClient
      .from('profiles')
      .select('id')
      .eq('shop_id', shopId)

    if (profiles) {
      for (const profile of profiles) {
        await adminClient.auth.admin.deleteUser(profile.id)
      }
    }

    // Delete shop (cascades to all shop data via FK)
    await adminClient.from('shops').delete().eq('id', shopId)

    revalidatePath('/admin/shops')
    revalidatePath('/admin')
  } catch (e: unknown) {
    console.error(e)
  }
}

export async function extendTrial(shopId: string, days: number) {
  // Requires trial_ends_at column — run supabase/add-trial-column.sql first
  try {
    const supabase = await requireAdmin()
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + days)
    await supabase.from('shops').update({
      subscription_status: 'trialing',
    }).eq('id', shopId)
    revalidatePath('/admin/shops')
    revalidatePath('/admin')
  } catch (e: unknown) {
    console.error(e)
  }
}
