import { createClient } from '@/lib/supabase/server'
import { Store, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, subscription_status, plan, created_at')
    .order('created_at', { ascending: false })

  const total = shops?.length ?? 0
  const active = shops?.filter(s => s.subscription_status === 'active' || s.subscription_status === 'trialing').length ?? 0
  const pastDue = shops?.filter(s => s.subscription_status === 'past_due').length ?? 0
  const suspended = shops?.filter(s => s.subscription_status === 'suspended').length ?? 0

  const stats = [
    { label: 'Total Shops', value: total, icon: Store, color: 'oklch(0.55 0.22 255)' },
    { label: 'Active', value: active, icon: CheckCircle, color: 'oklch(0.55 0.18 145)' },
    { label: 'Past Due', value: pastDue, icon: AlertTriangle, color: 'oklch(0.65 0.18 60)' },
    { label: 'Suspended', value: suspended, icon: XCircle, color: 'oklch(0.55 0.2 25)' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <p className="text-sm text-white/40 mt-1">All shops across FleetFlow</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 7%)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-wider">{label}</p>
              <Icon size={16} style={{ color }} />
            </div>
            <p className="text-3xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent shops table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 7%)' }}
      >
        <div className="px-5 py-4 border-b" style={{ borderColor: 'oklch(1 0 0 / 7%)' }}>
          <h2 className="text-sm font-semibold text-white">All Shops</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 7%)' }}>
              {['Shop Name', 'Plan', 'Status', 'Joined'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs text-white/30 font-medium uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shops && shops.length > 0 ? shops.map((shop, i) => (
              <tr
                key={shop.id}
                style={{ borderBottom: i < shops.length - 1 ? '1px solid oklch(1 0 0 / 5%)' : 'none' }}
              >
                <td className="px-5 py-3.5 text-sm text-white font-medium">{shop.name}</td>
                <td className="px-5 py-3.5 text-sm text-white/50 capitalize">{shop.plan}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={shop.subscription_status} />
                </td>
                <td className="px-5 py-3.5 text-sm text-white/40">
                  {new Date(shop.created_at).toLocaleDateString()}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-white/30">
                  No shops yet. Share your signup link to get your first customer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    active:    { bg: 'oklch(0.35 0.1 145 / 30%)',  text: 'oklch(0.65 0.18 145)', label: 'Active' },
    trialing:  { bg: 'oklch(0.35 0.1 255 / 30%)',  text: 'oklch(0.65 0.18 255)', label: 'Trial' },
    past_due:  { bg: 'oklch(0.45 0.12 60 / 30%)',  text: 'oklch(0.75 0.18 60)',  label: 'Past Due' },
    suspended: { bg: 'oklch(0.35 0.1 25 / 30%)',   text: 'oklch(0.65 0.18 25)',  label: 'Suspended' },
    cancelled: { bg: 'oklch(0.2 0 0 / 30%)',        text: 'oklch(0.5 0 0)',       label: 'Cancelled' },
  }
  const s = styles[status] ?? styles.cancelled
  return (
    <span
      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  )
}
