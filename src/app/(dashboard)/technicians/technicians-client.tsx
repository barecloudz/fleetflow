'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Users, Clock, Wrench, Coffee, LogIn, LogOut, Plus } from 'lucide-react'
import { addTechnician, updateTechnicianStatus } from '@/app/actions/shop'

interface Technician {
  id: string
  name: string
  role: string | null
  status: string
  hours_today: number
  jobs_completed: number
  efficiency: number
}

const statusStyles: Record<string, string> = {
  'Clocked In': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Clocked Out': 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  'On Break': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
}

const AVATAR_COLORS = [
  'from-blue-500 to-violet-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600', 'from-cyan-500 to-blue-600',
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function AddTechSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [state, formAction, pending] = useActionState(addTechnician, null)
  if (state?.success && open) setTimeout(() => onOpenChange(false), 800)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
        <SheetHeader className="p-5 border-b border-white/8 shrink-0">
          <SheetTitle className="text-white text-base font-semibold">Add Technician</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col h-full">
          <div className="flex-1 p-5 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Full Name *</Label>
              <Input name="name" required placeholder="Jake Torres" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Role</Label>
              <Input name="role" placeholder="e.g. Lead Tech, Lube Tech" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
            </div>
            {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
          </div>
          <SheetFooter className="border-t border-white/8 p-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-white/60">Cancel</Button>
            <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Adding…' : 'Add Technician'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default function TechniciansClient({ initialTechnicians }: { initialTechnicians: Technician[] }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  const clockedInCount = initialTechnicians.filter(t => t.status === 'Clocked In').length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Technicians"
        subtitle="Team & Time Tracking"
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />Add Tech</Button>} />
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">Add Technician</SheetTitle>
              </SheetHeader>
              <AddTechFormContent onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Techs', value: String(initialTechnicians.length), icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Clocked In', value: String(clockedInCount), icon: Clock, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'On Break', value: String(initialTechnicians.filter(t => t.status === 'On Break').length), icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}><s.icon className={`size-5 ${s.color}`} /></div>
              <div><p className="text-xs text-white/40 font-medium">{s.label}</p><p className="text-xl font-bold text-white">{s.value}</p></div>
            </div>
          ))}
        </div>

        {initialTechnicians.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <Users className="size-10 mb-3 opacity-40" />
            <p className="text-sm">No technicians yet. Add your first tech above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {initialTechnicians.map((tech, i) => (
              <div key={tech.id} className="glass-card rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center shrink-0`}>
                    <span className="text-sm font-bold text-white">{getInitials(tech.name)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{tech.name}</p>
                    <p className="text-xs text-white/40">{tech.role ?? 'Technician'}</p>
                  </div>
                  <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[tech.status] ?? ''}`}>{tech.status}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/6 pt-3">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">{tech.hours_today.toFixed(1)}</p>
                    <p className="text-[10px] text-white/35">Hrs Today</p>
                  </div>
                  <div className="text-center border-x border-white/6">
                    <p className="text-sm font-semibold text-white">{tech.jobs_completed}</p>
                    <p className="text-[10px] text-white/35">Jobs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">{tech.efficiency}%</p>
                    <p className="text-[10px] text-white/35">Efficiency</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {tech.status !== 'Clocked In' && (
                    <Button size="sm" variant="ghost" className="flex-1 h-8 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 gap-1.5"
                      onClick={() => startTransition(() => updateTechnicianStatus(tech.id, 'Clocked In'))}>
                      <LogIn className="size-3" /> Clock In
                    </Button>
                  )}
                  {tech.status === 'Clocked In' && (
                    <>
                      <Button size="sm" variant="ghost" className="flex-1 h-8 text-xs text-amber-400 hover:text-amber-300 border border-amber-500/20 gap-1.5"
                        onClick={() => startTransition(() => updateTechnicianStatus(tech.id, 'On Break'))}>
                        <Coffee className="size-3" /> Break
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1 h-8 text-xs text-red-400 hover:text-red-300 border border-red-500/20 gap-1.5"
                        onClick={() => startTransition(() => updateTechnicianStatus(tech.id, 'Clocked Out'))}>
                        <LogOut className="size-3" /> Clock Out
                      </Button>
                    </>
                  )}
                  {tech.status === 'On Break' && (
                    <Button size="sm" variant="ghost" className="flex-1 h-8 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 gap-1.5"
                      onClick={() => startTransition(() => updateTechnicianStatus(tech.id, 'Clocked In'))}>
                      <Wrench className="size-3" /> Resume
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function AddTechFormContent({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addTechnician, null)
  if (state?.success) setTimeout(onClose, 800)
  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 p-5 space-y-5">
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Full Name *</Label>
          <Input name="name" required placeholder="Jake Torres" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Role</Label>
          <Input name="role" placeholder="e.g. Lead Tech, Lube Tech" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Adding…' : 'Add Technician'}</Button>
      </SheetFooter>
    </form>
  )
}
