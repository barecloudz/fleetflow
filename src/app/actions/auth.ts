'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sendWelcomeEmail } from '@/lib/emails'

export async function login(prevState: { error: string } | null, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  })

  if (error) return { error: error.message }

  // Redirect based on role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .single()

  if (profile?.role === 'platform_admin') {
    redirect('/admin')
  }

  redirect('/dashboard')
}

export async function signup(prevState: { error: string } | null, formData: FormData) {
  const supabase = await createClient()

  const shopName = formData.get('shop_name') as string
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Create the shop row first (via SECURITY DEFINER function)
  const { data: shopId, error: shopError } = await supabase.rpc('create_shop', {
    shop_name: shopName,
  })

  if (shopError) return { error: shopError.message }

  // 2. Sign up the user — trigger will auto-create their profile with shop_id
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        shop_id: shopId,
        first_name: firstName,
        last_name: lastName,
        role: 'owner',
      },
    },
  })

  if (authError) return { error: authError.message }

  // Send welcome email (non-blocking — don't fail signup if email fails)
  sendWelcomeEmail({ to: email, shopName, firstName }).catch(console.error)

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
