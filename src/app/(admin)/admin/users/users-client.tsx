'use client'

import { useState, useTransition } from 'react'
import { resendCredentials } from '@/app/actions/admin'
import { Users, Search, Mail, RefreshCw } from 'lucide-react'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  shop_name: string
  shop_id: string | null
  created_at: string
  last_sign_in: string | null
}

const roleStyle: Record<string, { bg: string; color: string; label: string }> = {
  owner:          { bg: 'oklch(0.35 0.1 255 / 25%)', color: 'oklch(0.7 0.18 255)',  label: 'Owner' },
  admin:          { bg: 'oklch(0.35 0.1 145 / 25%)', color: 'oklch(0.7 0.18 145)',  label: 'Admin' },
  technician:     { bg: 'oklch(0.35 0.1 60 / 25%)',  color: 'oklch(0.75 0.18 60)',  label: 'Technician' },
  service_advisor:{ bg: 'oklch(0.35 0.1 290 / 25%)', color: 'oklch(0.7 0.18 290)',  label: 'Advisor' },
  platform_admin: { bg: 'oklch(0.35 0.1 25 / 25%)',  color: 'oklch(0.7 0.18 25)',   label: 'Platform Admin' },
}

export default function UsersClient({ users }: { users: User[] }) {
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [, startTransition] = useTransition()

  const filtered = users.filter(u =>
    !search ||
    `${u.first_name} ${u.last_name} ${u.email} ${u.shop_name}`.toLowerCase().includes(search.toLowerCase())
  )

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  function handleResend(shopId: string) {
    startTransition(async () => {
      const result = await resendCredentials(shopId)
      showToast(result.success ?? result.error ?? 'Done')
    })
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div
          className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: toast.startsWith('New') ? 'oklch(0.35 0.12 145)' : 'oklch(0.4 0.18 25)', border: '1px solid oklch(1 0 0 / 15%)' }}
        >
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-white/40 mt-1">{users.length} users across all shops</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className="pl-8 pr-4 py-2 rounded-lg text-sm text-white placeholder:text-white/30 outline-none w-56"
            style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 10%)' }}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 7%)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 7%)' }}>
              {['User', 'Email', 'Role', 'Shop', 'Joined', 'Last Login', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-white/30">
                  {search ? 'No users match your search.' : 'No users yet.'}
                </td>
              </tr>
            ) : filtered.map((u, i) => {
              const rs = roleStyle[u.role] ?? { bg: 'oklch(0.2 0 0 / 30%)', color: 'oklch(0.5 0 0)', label: u.role }
              return (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid oklch(1 0 0 / 5%)' : 'none' }} className="group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{ background: 'oklch(0.50 0.22 255 / 15%)', color: 'oklch(0.7 0.18 255)' }}
                      >
                        {(u.first_name?.[0] ?? u.email[0]).toUpperCase()}
                      </div>
                      <span className="text-sm text-white font-medium">
                        {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}`.trim() : '—'}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/50">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: rs.bg, color: rs.color }}>
                      {rs.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/50 whitespace-nowrap">{u.shop_name}</td>
                  <td className="px-5 py-3.5 text-sm text-white/40 whitespace-nowrap">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white/40 whitespace-nowrap">
                    {u.last_sign_in ? new Date(u.last_sign_in).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-5 py-3.5">
                    {u.shop_id && u.role === 'owner' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleResend(u.shop_id!)}
                          title="Resend credentials"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors hover:text-white text-white/40"
                          style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 8%)' }}
                        >
                          <RefreshCw size={11} />
                          Resend
                        </button>
                        <a
                          href={`mailto:${u.email}`}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors hover:text-white text-white/40"
                          style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 8%)' }}
                        >
                          <Mail size={11} />
                          Email
                        </a>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
