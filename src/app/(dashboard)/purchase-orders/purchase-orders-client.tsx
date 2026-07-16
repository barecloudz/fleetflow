'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, ShoppingCart, MoreHorizontal, Truck, CheckCircle } from 'lucide-react'
import { addPurchaseOrder, updatePurchaseOrderStatus } from '@/app/actions/shop'

interface PO {
  id: string; number: string; supplier: string; status: string; total: number
  ordered_at: string | null; received_at: string | null; created_at: string; notes: string | null
}

const statusStyles: Record<string, string> = {
  Draft: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  Submitted: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Received: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
}

function NewPOForm({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addPurchaseOrder, null)
  if (state?.success) setTimeout(onClose, 800)
  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 p-5 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Supplier *</Label>
          <Input name="supplier" required placeholder="NAPA Wholesale" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Total ($)</Label>
          <Input name="total" type="number" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Order Date</Label>
          <Input name="ordered_at" type="date" className="bg-white/5 border-white/10 text-white h-9" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea name="notes" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-none focus:outline-none" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Creating…' : 'Create PO'}</Button>
      </SheetFooter>
    </form>
  )
}

export default function PurchaseOrdersClient({ initialPOs }: { initialPOs: PO[] }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="Purchase Orders" subtitle="Parts & Supplier Orders" actions={
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New PO</Button>} />
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
            <SheetHeader className="p-5 border-b border-white/8 shrink-0">
              <SheetTitle className="text-white text-base font-semibold">New Purchase Order</SheetTitle>
            </SheetHeader>
            <NewPOForm onClose={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      } />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="glass-card rounded-xl overflow-hidden border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['PO #', 'Supplier', 'Total', 'Status', 'Ordered', 'Received', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialPOs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30 text-sm">No purchase orders yet.</td></tr>
              ) : initialPOs.map(po => (
                <tr key={po.id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-4 py-3.5 font-mono text-xs text-primary/70">{po.number}</td>
                  <td className="px-4 py-3.5 text-white font-medium">{po.supplier}</td>
                  <td className="px-4 py-3.5 text-white tabular-nums font-medium">${po.total.toLocaleString()}</td>
                  <td className="px-4 py-3.5"><Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[po.status] ?? ''}`}>{po.status}</Badge></td>
                  <td className="px-4 py-3.5 text-white/40 text-xs">{po.ordered_at ? new Date(po.ordered_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3.5 text-white/40 text-xs">{po.received_at ? new Date(po.received_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>} />
                      <DropdownMenuContent align="end">
                        {po.status === 'Draft' && <DropdownMenuItem onClick={() => startTransition(() => updatePurchaseOrderStatus(po.id, 'Submitted'))}><Truck className="size-3.5" /> Submit</DropdownMenuItem>}
                        {po.status === 'Submitted' && <DropdownMenuItem onClick={() => startTransition(() => updatePurchaseOrderStatus(po.id, 'Received'))}><CheckCircle className="size-3.5" /> Mark Received</DropdownMenuItem>}
                        {po.status !== 'Received' && <DropdownMenuItem variant="destructive" onClick={() => startTransition(() => updatePurchaseOrderStatus(po.id, 'Cancelled'))}>Cancel</DropdownMenuItem>}
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
