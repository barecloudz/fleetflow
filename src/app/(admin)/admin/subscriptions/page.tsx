import { createClient } from '@/lib/supabase/server'
import ShopActions from '@/components/admin/shop-actions'

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, plan, subscription_status, subscription_grace_until, created_at')
    .order('subscription_status', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-sm text-white/40 mt-1">Control billing status and plan for every shop</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Active — paying, full access', color: 'oklch(0.65 0.18 145)' },
          { label: 'Trial — free access, no card', color: 'oklch(0.65 0.18 255)' },
          { label: 'Past Due — warned, 30-day grace', color: 'oklch(0.75 0.18 60)' },
          { label: 'Suspended — access blocked', color: 'oklch(0.65 0.18 25)' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
            {label}
          </div>
        ))}
      </div>

      <div
        className="rounded-xl"
        style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 7%)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 7%)' }}>
              {['Shop', 'Plan', 'Status', 'Grace Period Ends', 'Actions'].map(h => (
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
                  {shop.subscription_grace_until
                    ? new Date(shop.subscription_grace_until).toLocaleDateString()
                    : '—'}
                </td>
                <td className="px-5 py-3.5">
                  <ShopActions shopId={shop.id} shopName={shop.name} currentStatus={shop.subscription_status} currentPlan={shop.plan} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-white/30">
                  No shops yet.
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
