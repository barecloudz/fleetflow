import { createAdminClient } from '@/lib/supabase/admin'
import { resendCredentials } from '@/app/actions/admin'
import UsersClient from './users-client'

export default async function AdminUsersPage() {
  const admin = createAdminClient()

  // Get all auth users + their profiles + shop names
  const [{ data: authData }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ perPage: 1000 }),
    admin.from('profiles').select('id, shop_id, first_name, last_name, role, created_at, shops(name)'),
  ])

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]))

  const users = (authData?.users ?? [])
    .map(u => {
      const profile = profileMap.get(u.id)
      return {
        id: u.id,
        email: u.email ?? '',
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
        role: profile?.role ?? 'unknown',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shop_name: (profile?.shops as any)?.name ?? '—',
        shop_id: profile?.shop_id ?? null,
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at ?? null,
      }
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return <UsersClient users={users} />
}
