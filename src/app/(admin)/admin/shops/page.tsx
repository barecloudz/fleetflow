import { createClient } from '@/lib/supabase/server'
import { createShop, updateShopStatus } from '@/app/actions/admin'
import CreateShopForm from '@/components/admin/create-shop-form'
import ShopActions from '@/components/admin/shop-actions'
import { Store } from 'lucide-react'

export default async function AdminShopsPage() {
  const supabase = await createClient()

  const { data: shops } = await supabase
    .from('shops')
    .select('id, name, email, phone, plan, subscription_status, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Shops</h1>
          <p className="text-sm text-white/40 mt-1">Manage all shops on the platform</p>
        </div>
        <CreateShopForm />
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 7%)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid oklch(1 0 0 / 7%)' }}>
              {['Shop', 'Email', 'Plan', 'Status', 'Joined', 'Actions'].map(h => (
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
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: 'oklch(0.50 0.22 255 / 15%)' }}
                    >
                      <Store size={13} className="text-blue-400" />
                    </div>
                    <span className="text-sm text-white font-medium">{shop.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-white/50">{shop.email ?? '—'}</td>
                <td className="px-5 py-3.5 text-sm text-white/50 capitalize">{shop.plan}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={shop.subscription_status} />
                </td>
                <td className="px-5 py-3.5 text-sm text-white/40">
                  {new Date(shop.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  <ShopActions shopId={shop.id} currentStatus={shop.subscription_status} currentPlan={shop.plan} />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-sm text-white/30">
                  No shops yet. Create one above.
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
