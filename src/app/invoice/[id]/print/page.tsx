import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import PrintTrigger from './print-trigger'

export default async function InvoicePrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const admin = createAdminClient()

  // Get current user's shop_id
  const { data: profile } = await supabase.from('profiles').select('shop_id').single()
  if (!profile?.shop_id) notFound()

  const [{ data: invoice }, { data: shop }] = await Promise.all([
    supabase.from('invoices').select(`
      id, number, amount, due_date, status, paid_at, created_at, notes,
      customers(first_name, last_name, email, phone, address),
      work_orders(number, description)
    `).eq('id', id).single(),
    admin.from('shops').select('name, phone, email, address, city, state, zip, logo_url').eq('id', profile.shop_id).single(),
  ])

  if (!invoice) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customer = (invoice.customers as any) as { first_name: string; last_name: string; email: string | null; phone: string | null; address: string | null } | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workOrder = (invoice.work_orders as any) as { number: string; description: string | null } | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shopData = (shop as any) as { name: string; phone: string | null; email: string | null; address: string | null; city: string | null; state: string | null; zip: string | null; logo_url: string | null } | null

  const invoiceDate = new Date(invoice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null
  const paidDate = invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null

  const shopAddress = [shopData?.city, shopData?.state, shopData?.zip].filter(Boolean).join(', ')

  const statusColor: Record<string, string> = {
    Paid: '#16a34a',
    Pending: '#2563eb',
    Overdue: '#dc2626',
    Void: '#6b7280',
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body { background: white !important; color: #111 !important; }
        @media print {
          .no-print { display: none !important; }
          @page { margin: 0.75in; size: letter; }
        }
      `}</style>

      <PrintTrigger />

      {/* Print button — hidden when printing */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          style={{ background: '#1d4ed8', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Print / Save PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}
        >
          Close
        </button>
      </div>

      {/* Invoice body */}
      <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '40px auto 80px', padding: '0 24px', color: '#111', background: 'white' }}>

        {/* Header: shop info + INVOICE label */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {shopData?.logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={shopData.logo_url} alt="Shop logo" style={{ height: 56, width: 56, objectFit: 'contain', borderRadius: 8 }} />
            )}
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>{shopData?.name ?? 'Your Shop'}</div>
              {shopData?.address && <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{shopData.address}</div>}
              {shopAddress && <div style={{ fontSize: 13, color: '#555' }}>{shopAddress}</div>}
              <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>
                {[shopData?.phone, shopData?.email].filter(Boolean).join(' · ')}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', color: '#111' }}>INVOICE</div>
            <div style={{ fontSize: 15, color: '#555', marginTop: 4 }}>{invoice.number}</div>
            <div style={{ display: 'inline-block', marginTop: 8, padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', background: `${statusColor[invoice.status] ?? '#6b7280'}20`, color: statusColor[invoice.status] ?? '#6b7280', border: `1px solid ${statusColor[invoice.status] ?? '#6b7280'}40` }}>
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#e5e7eb', marginBottom: 32 }} />

        {/* Bill To + Invoice details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, gap: 32 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#9ca3af', marginBottom: 8 }}>Bill To</div>
            {customer ? (
              <>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{customer.first_name} {customer.last_name}</div>
                {customer.address && <div style={{ fontSize: 13, color: '#555', marginTop: 3 }}>{customer.address}</div>}
                {customer.email && <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{customer.email}</div>}
                {customer.phone && <div style={{ fontSize: 13, color: '#555', marginTop: 2 }}>{customer.phone}</div>}
              </>
            ) : (
              <div style={{ fontSize: 14, color: '#9ca3af' }}>No customer on file</div>
            )}
          </div>

          <div style={{ textAlign: 'right', minWidth: 200 }}>
            {([
              ['Invoice Date', invoiceDate],
              dueDate ? ['Due Date', dueDate] : null,
              paidDate ? ['Paid On', paidDate] : null,
              workOrder ? ['Work Order', workOrder.number] : null,
            ] as ([string, string] | null)[]).filter((x): x is [string, string] => x !== null).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 24, marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: '#111' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Services table */}
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 32 }}>
          <div style={{ background: '#f9fafb', padding: '10px 20px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280' }}>Description</span>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#6b7280' }}>Amount</span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '1px solid #e5e7eb' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                {workOrder ? `Work Order ${workOrder.number}` : 'Automotive Services'}
              </div>
              {workOrder?.description && (
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, maxWidth: 420 }}>{workOrder.description}</div>
              )}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111', whiteSpace: 'nowrap' }}>
              ${invoice.amount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 240 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '2px solid #111' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: '#111' }}>${invoice.amount.toFixed(2)}</span>
            </div>
            {invoice.status === 'Paid' && paidDate && (
              <div style={{ fontSize: 12, color: '#16a34a', textAlign: 'right', marginTop: 4 }}>Paid on {paidDate}</div>
            )}
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div style={{ marginTop: 40, padding: '16px 20px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#9ca3af', marginBottom: 6 }}>Notes</div>
            <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{invoice.notes}</div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 60, textAlign: 'center', fontSize: 12, color: '#9ca3af' }}>
          Thank you for your business — {shopData?.name ?? 'Your Shop'}
        </div>
      </div>
    </>
  )
}
