'use client'

import { useState, useActionState } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Plus, CalendarDays, Clock } from 'lucide-react'
import { addAppointment } from '@/app/actions/shop'

interface Appointment {
  id: string; title: string; description: string | null; status: string; starts_at: string; ends_at: string | null
  // Supabase returns joins as arrays
  customers: { first_name: string; last_name: string }[] | { first_name: string; last_name: string } | null
  technicians: { name: string }[] | { name: string } | null
}
interface Customer { id: string; first_name: string; last_name: string }
interface Vehicle { id: string; year: number | null; make: string | null; model: string | null; customer_id: string | null }
interface Technician { id: string; name: string }

const statusStyles: Record<string, string> = {
  Scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Confirmed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
  'No Show': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
}

function NewAppointmentForm({ customers, vehicles, technicians, onClose }: { customers: Customer[]; vehicles: Vehicle[]; technicians: Technician[]; onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addAppointment, null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  if (state?.success) setTimeout(onClose, 800)

  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Title *</Label>
          <Input name="title" required placeholder="e.g. Oil Change" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
        </div>
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
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Technician</Label>
          <select name="technician_id" className="w-full rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="">Unassigned</option>
            {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Start *</Label>
            <Input name="starts_at" type="datetime-local" required className="bg-white/5 border-white/10 text-white h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">End</Label>
            <Input name="ends_at" type="datetime-local" className="bg-white/5 border-white/10 text-white h-9" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Description</Label>
          <textarea name="description" rows={2} className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-none focus:outline-none" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Saving…' : 'Book Appointment'}</Button>
      </SheetFooter>
    </form>
  )
}

function getCustomerName(appt: Appointment) {
  if (!appt.customers) return ''
  const c = Array.isArray(appt.customers) ? appt.customers[0] : appt.customers
  return c ? `${c.first_name} ${c.last_name}` : ''
}

function getTechName(appt: Appointment) {
  if (!appt.technicians) return ''
  const t = Array.isArray(appt.technicians) ? appt.technicians[0] : appt.technicians
  return t ? t.name : ''
}

export default function CalendarClient({ initialAppointments, customers, vehicles, technicians }: { initialAppointments: Appointment[]; customers: Customer[]; vehicles: Vehicle[]; technicians: Technician[] }) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const upcoming = initialAppointments.filter(a => new Date(a.starts_at) >= new Date() && a.status !== 'Cancelled')
  const past = initialAppointments.filter(a => new Date(a.starts_at) < new Date() || a.status === 'Cancelled')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="Calendar" subtitle="Appointments & Scheduling" actions={
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />Book Appointment</Button>} />
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
            <SheetHeader className="p-5 border-b border-white/8 shrink-0">
              <SheetTitle className="text-white text-base font-semibold">Book Appointment</SheetTitle>
            </SheetHeader>
            <NewAppointmentForm customers={customers} vehicles={vehicles} technicians={technicians} onClose={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      } />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {initialAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <CalendarDays className="size-10 mb-3 opacity-40" />
            <p className="text-sm">No appointments yet. Book one above.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h2>
                <div className="space-y-2">
                  {upcoming.map(appt => (
                    <div key={appt.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <div className="bg-blue-500/10 p-2.5 rounded-xl shrink-0"><CalendarDays className="size-4 text-blue-400" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">{appt.title}</p>
                          <Badge className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${statusStyles[appt.status] ?? ''}`}>{appt.status}</Badge>
                        </div>
                        <p className="text-xs text-white/40 mt-0.5">
                          {getCustomerName(appt)}
                          {getTechName(appt) ? ` · ${getTechName(appt)}` : ''}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-white/60 flex items-center gap-1 justify-end"><Clock className="size-3" />{new Date(appt.starts_at).toLocaleDateString()}</p>
                        <p className="text-xs text-white/40">{new Date(appt.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {past.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3">Past</h2>
                <div className="space-y-2 opacity-60">
                  {past.slice(0, 5).map(appt => (
                    <div key={appt.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <div className="bg-white/5 p-2.5 rounded-xl shrink-0"><CalendarDays className="size-4 text-white/30" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/70">{appt.title}</p>
                        <p className="text-xs text-white/30">{getCustomerName(appt)}</p>
                      </div>
                      <p className="text-xs text-white/30">{new Date(appt.starts_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
