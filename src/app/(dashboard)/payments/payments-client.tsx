'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { DollarSign, TrendingUp, AlertCircle, Clock, MoreHorizontal, Plus, CreditCard } from 'lucide-react'
import { addInvoice, updateInvoiceStatus } from '@/app/actions/shop'

interface Invoice {
  id: string
  number: string
  amount: number
  due_date: string | null
  status: string
  paid_at: string | null
  created_at: string
  notes: string | null
  customers: { first_name: string; last_name: string } | null
  work_orders: { number: string } | null
}

interface Customer { id: string; first_name: string; last_name: string }
interface WorkOrder { id: string; number: string }

const statusStyle: Record<string, string> = {
  Paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Pending: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Overdue: 'bg-red-500/15 text-red-400 border-red-500/20',
  Void: 'bg-white/8 text-white/40 border-white/10',
}

function NewInvoiceForm({ customers, workOrders, onClose }: { customers: Customer[]; workOrders: WorkOrder[]; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addInvoice, null)
  if (state?.success) setTimeout(onClose, 800)
  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Customer</Label>
          <select name="customer_id" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Select customer…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Work Order</Label>
          <select name="work_order_id" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Select work order…</option>
            {workOrders.map(wo => <option key={wo.id} value={wo.id}>{wo.number}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Amount ($) *</Label>
          <Input name="amount" type="number" step="0.01" required placeholder="0.00" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Due Date</Label>
          <Input name="due_date" type="date" className="bg-white/5 border-white/10 text-white h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea name="notes" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Creating…' : 'Create Invoice'}</Button>
      </SheetFooter>
    </form>
  )
}

export default function PaymentsClient({ initialInvoices, customers, workOrders }: { initialInvoices: Invoice[]; customers: Customer[]; workOrders: WorkOrder[] }) {
  const [activeTab, setActiveTab] = useState('all')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  const filtered = initialInvoices.filter(inv => activeTab === 'all' || inv.status.toLowerCase() === activeTab)

  const totalPaid = initialInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = initialInvoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = initialInvoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)
  const avgInvoice = initialInvoices.length > 0 ? Math.round(initialInvoices.reduce((s, i) => s + i.amount, 0) / initialInvoices.length) : 0

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Payments"
        subtitle="Invoices & Billing"
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New Invoice</Button>} />
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">New Invoice</SheetTitle>
              </SheetHeader>
              <NewInvoiceForm customers={customers} workOrders={workOrders} onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Collected', value: `$${totalPaid.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Outstanding', value: `$${totalPending.toLocaleString()}`, icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Avg Invoice', value: `$${avgInvoice.toLocaleString()}`, icon: Clock, color: 'text-violet-400', bg: 'bg-violet-500/10' },
          ].map(s => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5 flex items-center gap-3">
                <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}><s.icon className={`size-5 ${s.color}`} /></div>
                <div><p className="text-xs text-white/50 font-medium">{s.label}</p><p className="text-xl font-bold text-white">{s.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glass-card border-white/8">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2"><CreditCard className="size-4 text-primary" />Invoices</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white/5 border border-white/8 h-8 p-0.5 gap-0.5">
                {['all', 'pending', 'paid', 'overdue'].map(tab => (
                  <TabsTrigger key={tab} value={tab} className="text-xs px-3 h-6 capitalize data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 rounded">
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
              {['all', 'pending', 'paid', 'overdue'].map(t => <TabsContent key={t} value={t} className="mt-0" />)}
            </Tabs>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  {['Invoice', 'Customer', 'Work Order', 'Amount', 'Due Date', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30 text-sm">
                    {initialInvoices.length === 0 ? 'No invoices yet.' : 'No invoices in this category.'}
                  </td></tr>
                ) : filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/3 transition-colors group">
                    <td className="px-4 py-3.5 font-mono text-xs text-primary/70 whitespace-nowrap">{inv.number}</td>
                    <td className="px-4 py-3.5 text-white font-medium whitespace-nowrap">
                      {inv.customers ? `${inv.customers.first_name} ${inv.customers.last_name}` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-white/50 text-xs whitespace-nowrap">{inv.work_orders?.number ?? '—'}</td>
                    <td className="px-4 py-3.5 font-medium text-white tabular-nums whitespace-nowrap">${inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-3.5">
                      <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyle[inv.status] ?? ''}`}>{inv.status}</Badge>
                    </td>
                    <td className="px-4 py-3.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>} />
                        <DropdownMenuContent align="end">
                          {inv.status !== 'Paid' && <DropdownMenuItem onClick={() => startTransition(() => updateInvoiceStatus(inv.id, 'Paid'))}>Mark Paid</DropdownMenuItem>}
                          {inv.status === 'Pending' && <DropdownMenuItem onClick={() => startTransition(() => updateInvoiceStatus(inv.id, 'Overdue'))}>Mark Overdue</DropdownMenuItem>}
                          <DropdownMenuItem variant="destructive" onClick={() => startTransition(() => updateInvoiceStatus(inv.id, 'Void'))}>Void</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  )
}
