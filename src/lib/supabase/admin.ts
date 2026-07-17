import { createClient } from '@supabase/supabase-js'

// Service-role client — NEVER import this in client components.
// Only used in server actions that require admin privileges (creating users, etc.)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
