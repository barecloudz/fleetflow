'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, CreditCard, LogOut, ShieldCheck } from 'lucide-react'
import { logout } from '@/app/actions/auth'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/shops', label: 'Shops', icon: Store },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
]

export default function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <aside
      className="w-56 flex flex-col shrink-0 border-r"
      style={{ borderColor: 'oklch(1 0 0 / 7%)', background: 'oklch(0.13 0.018 255)' }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'oklch(1 0 0 / 7%)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'oklch(0.50 0.22 255 / 25%)' }}
          >
            <ShieldCheck size={16} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">FleetFlow</p>
            <p className="text-[10px] text-white/35 tracking-widest uppercase mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: active ? 'oklch(0.50 0.22 255 / 15%)' : 'transparent',
                color: active ? 'oklch(0.75 0.18 255)' : 'oklch(1 0 0 / 45%)',
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t" style={{ borderColor: 'oklch(1 0 0 / 7%)' }}>
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-white/60 font-medium truncate">{adminName || 'Admin'}</p>
          <p className="text-[10px] text-white/30">Platform Administrator</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full transition-colors hover:text-white/70"
            style={{ color: 'oklch(1 0 0 / 35%)' }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
