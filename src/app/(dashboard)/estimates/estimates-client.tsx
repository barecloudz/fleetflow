'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, FileText, MoreHorizontal, Send, CheckCircle, XCircle } from 'lucide-react'
import { addEstimate, updateEstimateStatus } from '@/app/actions/shop'

interface Estimate {
  id: string; number: string; status: string; subtotal: number; tax: number; total: number
  expires_at: string | null; created_at: string; notes: string | null
  customers: { first_name: string; last_name: string } | null
  vehicles: { year: number | null; make: string | null; model: string | null } | null
}
interface Customer { id: string; first_name: string; last_name: string }
interface Vehicle { id: string; year: number | null; make: string | null; model: string | null; customer_id: string | null }

const statusStyles: Record<string, string> = {
  Draft: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  Sent: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Approved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Declined: 'bg-red-500/15 text-red-400 border-red-500/20',
  Expired: 'bg-white/8 text-white/40 border-white/10',
}

function NewEstimateForm({ customers, vehicles, onClose }: { customers: Customer[]; vehicles: Vehicle[]; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addEstimate, null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  if (state?.success) setTimeout(onClose, 800)

  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
            <option value="">{selectedCustomerId ? 'Select vehicle…' : 'Select customer first'}</option>
            {vehicles.filter(v => v.customer_id === selectedCustomerId).map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Subtotal ($)</Label>
            <Input name="subtotal" type="number" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Tax ($)</Label>
            <Input name="tax" type="number" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Expires</Label>
          <Input name="expires_at" type="date" className="bg-white/5 border-white/10 text-white h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea name="notes" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Creating…' : 'Create Estimate'}</Button>
      </SheetFooter>
    </form>
  )
}

export default function EstimatesClient({ initialEstimates, customers, vehicles }: { initialEstimates: Estimate[]; customers: Customer[]; vehicles: Vehicle[] }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="Estimates" subtitle="Quotes & Approvals" actions={
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New Estimate</Button>} />
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
            <SheetHeader className="p-5 border-b border-white/8 shrink-0">
              <SheetTitle className="text-white text-base font-semibold">New Estimate</SheetTitle>
            </SheetHeader>
            <NewEstimateForm customers={customers} vehicles={vehicles} onClose={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      } />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="glass-card rounded-xl overflow-hidden border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Estimate', 'Customer', 'Vehicle', 'Total', 'Expires', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialEstimates.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30 text-sm">No estimates yet. Create one above.</td></tr>
              ) : initialEstimates.map(est => (
                <tr key={est.id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-4 py-3.5 font-mono text-xs text-primary/70">{est.number}</td>
                  <td className="px-4 py-3.5 text-white font-medium">{est.customers ? `${est.customers.first_name} ${est.customers.last_name}` : '—'}</td>
                  <td className="px-4 py-3.5 text-white/60 text-xs">{est.vehicles ? `${est.vehicles.year ?? ''} ${est.vehicles.make ?? ''} ${est.vehicles.model ?? ''}`.trim() : '—'}</td>
                  <td className="px-4 py-3.5 text-white font-medium tabular-nums">${est.total.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-white/40 text-xs">{est.expires_at ? new Date(est.expires_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3.5"><Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[est.status] ?? ''}`}>{est.status}</Badge></td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>} />
                      <DropdownMenuContent align="end">
                        {est.status === 'Draft' && <DropdownMenuItem onClick={() => startTransition(() => updateEstimateStatus(est.id, 'Sent'))}><Send className="size-3.5" /> Send</DropdownMenuItem>}
                        {est.status === 'Sent' && <DropdownMenuItem onClick={() => startTransition(() => updateEstimateStatus(est.id, 'Approved'))}><CheckCircle className="size-3.5" /> Approve</DropdownMenuItem>}
                        {est.status === 'Sent' && <DropdownMenuItem variant="destructive" onClick={() => startTransition(() => updateEstimateStatus(est.id, 'Declined'))}><XCircle className="size-3.5" /> Decline</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
