'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, ClipboardCheck, MoreHorizontal, CheckCircle2 } from 'lucide-react'
import { addInspection, updateInspectionStatus } from '@/app/actions/shop'

interface Inspection {
  id: string; status: string; notes: string | null; created_at: string; completed_at: string | null
  vehicles: { year: number | null; make: string | null; model: string | null } | null
  technicians: { name: string } | null
  work_orders: { number: string } | null
}
interface Vehicle { id: string; year: number | null; make: string | null; model: string | null }
interface Technician { id: string; name: string }
interface WorkOrder { id: string; number: string }

const statusStyles: Record<string, string> = {
  Pending: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  'In Progress': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
}

function NewInspectionForm({ vehicles, technicians, workOrders, onClose }: { vehicles: Vehicle[]; technicians: Technician[]; workOrders: WorkOrder[]; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addInspection, null)
  if (state?.success) setTimeout(onClose, 800)
  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 p-5 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Vehicle</Label>
          <select name="vehicle_id" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Select vehicle…</option>
            {vehicles.map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
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
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Technician</Label>
          <select name="technician_id" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Unassigned</option>
            {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea name="notes" rows={3} className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Creating…' : 'Create Inspection'}</Button>
      </SheetFooter>
    </form>
  )
}

export default function InspectionsClient({ initialInspections, vehicles, technicians, workOrders }: { initialInspections: Inspection[]; vehicles: Vehicle[]; technicians: Technician[]; workOrders: WorkOrder[] }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="Inspections" subtitle="Vehicle Inspections" actions={
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New Inspection</Button>} />
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
            <SheetHeader className="p-5 border-b border-white/8 shrink-0">
              <SheetTitle className="text-white text-base font-semibold">New Inspection</SheetTitle>
            </SheetHeader>
            <NewInspectionForm vehicles={vehicles} technicians={technicians} workOrders={workOrders} onClose={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      } />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="glass-card rounded-xl overflow-hidden border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Vehicle', 'Work Order', 'Tech', 'Status', 'Created', 'Completed', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialInspections.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-white/30 text-sm">No inspections yet. Create one above.</td></tr>
              ) : initialInspections.map(insp => (
                <tr key={insp.id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-4 py-3.5 text-white font-medium">{insp.vehicles ? `${insp.vehicles.year ?? ''} ${insp.vehicles.make ?? ''} ${insp.vehicles.model ?? ''}`.trim() : '—'}</td>
                  <td className="px-4 py-3.5 text-white/50 text-xs font-mono">{insp.work_orders?.number ?? '—'}</td>
                  <td className="px-4 py-3.5 text-white/60 text-sm">{insp.technicians?.name ?? '—'}</td>
                  <td className="px-4 py-3.5"><Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[insp.status] ?? ''}`}>{insp.status}</Badge></td>
                  <td className="px-4 py-3.5 text-white/40 text-xs">{new Date(insp.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3.5 text-white/40 text-xs">{insp.completed_at ? new Date(insp.completed_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>} />
                      <DropdownMenuContent align="end">
                        {insp.status !== 'Completed' && <DropdownMenuItem onClick={() => startTransition(() => updateInspectionStatus(insp.id, 'Completed'))}><CheckCircle2 className="size-3.5" /> Mark Complete</DropdownMenuItem>}
                        {insp.status === 'Pending' && <DropdownMenuItem onClick={() => startTransition(() => updateInspectionStatus(insp.id, 'In Progress'))}>Start</DropdownMenuItem>}
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
