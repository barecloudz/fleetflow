'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Search, MoreHorizontal, ClipboardList, CheckCircle, XCircle } from 'lucide-react'
import { addWorkOrder, updateWorkOrderStatus } from '@/app/actions/shop'

interface WorkOrder {
  id: string
  number: string
  description: string | null
  status: string
  priority: string
  total: number
  created_at: string
  customers: { first_name: string; last_name: string } | null
  vehicles: { year: number | null; make: string | null; model: string | null } | null
  technicians: { name: string } | null
}

interface Customer { id: string; first_name: string; last_name: string }
interface Vehicle { id: string; year: number | null; make: string | null; model: string | null; customer_id: string | null }
interface Technician { id: string; name: string }

const statusStyles: Record<string, string> = {
  'In Progress':    'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'Open':           'bg-slate-500/15 text-slate-300 border-slate-500/20',
  'Awaiting Parts': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Completed':      'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Cancelled':      'bg-red-500/15 text-red-400 border-red-500/20',
}

const priorityStyles: Record<string, string> = {
  'Normal': 'bg-slate-500/10 text-slate-400 border-slate-500/15',
  'High':   'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Urgent': 'bg-red-500/15 text-red-400 border-red-500/20',
}

const TAB_STATUSES: Record<string, string> = {
  all: 'all', open: 'Open', 'in-progress': 'In Progress', 'awaiting-parts': 'Awaiting Parts', completed: 'Completed',
}

function NewWOForm({ customers, vehicles, technicians, onClose }: {
  customers: Customer[]; vehicles: Vehicle[]; technicians: Technician[]; onClose: () => void
}) {
  const [state, formAction, pending] = useActionState(addWorkOrder, null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  if (state?.success) setTimeout(onClose, 800)

  const customerVehicles = vehicles.filter(v => v.customer_id === selectedCustomerId)

  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Customer</Label>
          <select name="customer_id" onChange={e => setSelectedCustomerId(e.target.value)} className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Select customer…</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Vehicle</Label>
          <select name="vehicle_id" disabled={!selectedCustomerId} className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10 disabled:opacity-40">
            <option value="">{selectedCustomerId ? 'Select vehicle…' : 'Select a customer first'}</option>
            {customerVehicles.map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Description</Label>
          <textarea name="description" rows={3} placeholder="Describe the work to be performed…" className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 px-3 py-2 resize-none focus:outline-none" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Assigned Tech</Label>
          <select name="technician_id" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Unassigned</option>
            {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Priority</Label>
            <select name="priority" defaultValue="Normal" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
              {['Normal', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Est. Total ($)</Label>
            <Input name="total" type="number" min="0" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9" />
          </div>
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Creating…' : 'Create Work Order'}</Button>
      </SheetFooter>
    </form>
  )
}

export default function WorkOrdersClient({ initialWorkOrders, customers, vehicles, technicians }: {
  initialWorkOrders: WorkOrder[]; customers: Customer[]; vehicles: Vehicle[]; technicians: Technician[]
}) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  const filtered = initialWorkOrders.filter(wo => {
    const statusMatch = activeTab === 'all' || wo.status === TAB_STATUSES[activeTab]
    const customerName = wo.customers ? `${wo.customers.first_name} ${wo.customers.last_name}` : ''
    const searchMatch = !search || customerName.toLowerCase().includes(search.toLowerCase()) || wo.number.toLowerCase().includes(search.toLowerCase())
    return statusMatch && searchMatch
  })

  const countFor = (tab: string) => tab === 'all' ? initialWorkOrders.length : initialWorkOrders.filter(wo => wo.status === TAB_STATUSES[tab]).length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Work Orders"
        subtitle={`${initialWorkOrders.filter(w => w.status === 'Open' || w.status === 'In Progress').length} active orders`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New Work Order</Button>} />
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">New Work Order</SheetTitle>
              </SheetHeader>
              <NewWOForm customers={customers} vehicles={vehicles} technicians={technicians} onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-white/5 border border-white/8 h-9 p-1 gap-0.5">
              {[{ key: 'all', label: 'All' }, { key: 'open', label: 'Open' }, { key: 'in-progress', label: 'In Progress' }, { key: 'awaiting-parts', label: 'Awaiting Parts' }, { key: 'completed', label: 'Completed' }].map(({ key, label }) => (
                <TabsTrigger key={key} value={key} className="text-xs px-3 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 rounded">
                  {label} <span className="ml-1 text-[10px] opacity-60">({countFor(key)})</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {['all', 'open', 'in-progress', 'awaiting-parts', 'completed'].map(tab => <TabsContent key={tab} value={tab} className="mt-0" />)}
          </Tabs>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by customer or WO#…" className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm" />
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border-white/8">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <ClipboardList className="size-10 mb-3 opacity-40" />
              <p className="text-sm">{initialWorkOrders.length === 0 ? 'No work orders yet. Create one above.' : 'No work orders found'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    {['WO #', 'Customer', 'Vehicle', 'Description', 'Tech', 'Status', 'Total', 'Created', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {filtered.map(wo => (
                    <tr key={wo.id} className="hover:bg-white/3 transition-colors group">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-primary/70">{wo.number}</span>
                          {wo.priority !== 'Normal' && <Badge className={`text-[9px] border px-1.5 py-0 rounded-full ${priorityStyles[wo.priority]}`}>{wo.priority}</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-white font-medium whitespace-nowrap">
                        {wo.customers ? `${wo.customers.first_name} ${wo.customers.last_name}` : '—'}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3.5 text-white/60 whitespace-nowrap">
                        {wo.vehicles ? `${wo.vehicles.year ?? ''} ${wo.vehicles.make ?? ''} ${wo.vehicles.model ?? ''}`.trim() : '—'}
                      </td>
                      <td className="hidden md:table-cell px-4 py-3.5 text-white/70 max-w-[180px] truncate">{wo.description ?? '—'}</td>
                      <td className="hidden lg:table-cell px-4 py-3.5 whitespace-nowrap text-white/70 text-sm">
                        {wo.technicians?.name ?? <span className="text-white/30 italic text-xs">Unassigned</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[wo.status] ?? ''}`}>{wo.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium text-white tabular-nums whitespace-nowrap">${wo.total.toLocaleString()}</td>
                      <td className="hidden sm:table-cell px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">{new Date(wo.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>} />
                          <DropdownMenuContent align="end" side="bottom">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => startTransition(() => updateWorkOrderStatus(wo.id, 'Completed'))} disabled={wo.status === 'Completed' || wo.status === 'Cancelled'}>
                              <CheckCircle className="size-3.5" /> Mark Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => startTransition(() => updateWorkOrderStatus(wo.id, 'Cancelled'))} disabled={wo.status === 'Cancelled' || wo.status === 'Completed'}>
                              <XCircle className="size-3.5" /> Cancel
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">Showing <span className="text-white/50 font-medium">{filtered.length}</span> of <span className="text-white/50 font-medium">{initialWorkOrders.length}</span> work orders</p>
            <p className="text-xs text-white/30">Total value: <span className="text-white/60 font-medium">${filtered.reduce((s, w) => s + w.total, 0).toLocaleString()}</span></p>
          </div>
        </div>
      </main>
    </div>
  )
}
