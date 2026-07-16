'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
    const supabase = await requireAdmin()

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const plan = formData.get('plan') as string
    const status = formData.get('status') as string

    const { error } = await supabase.from('shops').insert({
      name,
      email: email || null,
      phone: phone || null,
      plan,
      subscription_status: status,
    })

    if (error) return { error: error.message }

    revalidatePath('/admin/shops')
    revalidatePath('/admin')
    return { success: `${name} has been created.` }
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function updateShopStatus(
  shopId: string,
  status: string,
  plan?: string,
) {
  try {
    const supabase = await requireAdmin()

    const updates: Record<string, unknown> = { subscription_status: status }
    if (plan) updates.plan = plan

    // Set grace period when marking past_due
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
