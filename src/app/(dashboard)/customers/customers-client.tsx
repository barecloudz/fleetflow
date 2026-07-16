'use client'

import { useState, useActionState } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet'
import { Plus, Search, Users, UserCheck, DollarSign, Mail, Phone, Car, ArrowRight } from 'lucide-react'
import { addCustomer } from '@/app/actions/shop'

interface Customer {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  status: string
  notes: string | null
  created_at: string
  vehicles: { count: number }[]
}

const AVATAR_COLORS = [
  'from-blue-500 to-violet-600', 'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
  'from-pink-500 to-rose-600', 'from-cyan-500 to-blue-600', 'from-violet-500 to-purple-600',
  'from-fuchsia-500 to-pink-600', 'from-indigo-500 to-blue-600', 'from-green-500 to-emerald-600',
]

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase()
}

function AddCustomerSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [state, formAction, pending] = useActionState(addCustomer, null)
  if (state?.success && open) setTimeout(() => onOpenChange(false), 800)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
        <SheetHeader className="p-5 border-b border-white/8 shrink-0">
          <SheetTitle className="text-white text-base font-semibold">Add Customer</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">First Name *</Label>
                <Input name="first_name" required placeholder="Jane" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Last Name *</Label>
                <Input name="last_name" required placeholder="Smith" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Email</Label>
              <Input name="email" type="email" placeholder="jane@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Phone</Label>
              <Input name="phone" type="tel" placeholder="(555) 000-0000" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Address</Label>
              <Input name="address" placeholder="123 Main St" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
              <textarea name="notes" rows={3} placeholder="Any special instructions…" className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none" />
            </div>
            {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
          </div>
          <SheetFooter className="border-t border-white/8 p-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-white/60">Cancel</Button>
            <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Adding…' : 'Add Customer'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [search, setSearch] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = initialCustomers.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
  })

  const activeCount = initialCustomers.filter(c => c.status === 'Active').length

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Customers"
        subtitle={`${initialCustomers.length} total customers`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />Add Customer</Button>} />
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">Add Customer</SheetTitle>
              </SheetHeader>
              <AddCustomerFormContent onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Customers', value: initialCustomers.length.toString(), color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: UserCheck, label: 'Active', value: activeCount.toString(), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}><s.icon className={`size-5 ${s.color}`} /></div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 font-medium leading-tight">{s.label}</p>
                <p className="text-xl font-bold text-white mt-0.5">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or phone…" className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm" />
          </div>
          <p className="text-xs text-white/30 shrink-0">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <Users className="size-10 mb-3 opacity-40" />
            <p className="text-sm">{initialCustomers.length === 0 ? 'No customers yet. Add your first customer above.' : 'No customers found'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((customer, i) => {
              const isActive = customer.status === 'Active'
              const vehicleCount = customer.vehicles?.[0]?.count ?? 0
              const colorClass = AVATAR_COLORS[i % AVATAR_COLORS.length]
              return (
                <div key={customer.id} className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:border-white/14 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`size-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                      <span className="text-sm font-bold text-white">{getInitials(customer.first_name, customer.last_name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{customer.first_name} {customer.last_name}</p>
                        <Badge className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${isActive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>{customer.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {customer.email && <div className="flex items-center gap-2 text-[11px] text-white/50"><Mail className="size-3 shrink-0 text-white/30" /><span className="truncate">{customer.email}</span></div>}
                    {customer.phone && <div className="flex items-center gap-2 text-[11px] text-white/50"><Phone className="size-3 shrink-0 text-white/30" /><span>{customer.phone}</span></div>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 border-t border-white/6 pt-3.5">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-0.5"><Car className="size-3 text-white/25" /></div>
                      <p className="text-sm font-semibold text-white">{vehicleCount}</p>
                      <p className="text-[10px] text-white/35">Vehicles</p>
                    </div>
                    <div className="text-center border-l border-white/6">
                      <div className="flex items-center justify-center mb-0.5"><DollarSign className="size-3 text-white/25" /></div>
                      <p className="text-[11px] text-white/40">—</p>
                      <p className="text-[10px] text-white/35">Lifetime</p>
                    </div>
                  </div>
                  {customer.notes && <p className="text-[11px] text-white/35 italic leading-relaxed -mt-1 border-t border-white/5 pt-3">{customer.notes}</p>}
                  <Button variant="ghost" size="sm" className="w-full h-8 text-xs text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/15 gap-1.5 mt-auto">
                    View Profile <ArrowRight className="size-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function AddCustomerFormContent({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState(addCustomer, null)
  if (state?.success) setTimeout(onClose, 800)
  return (
    <form action={formAction} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">First Name *</Label>
            <Input name="first_name" required placeholder="Jane" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Last Name *</Label>
            <Input name="last_name" required placeholder="Smith" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Email</Label>
          <Input name="email" type="email" placeholder="jane@email.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Phone</Label>
          <Input name="phone" type="tel" placeholder="(555) 000-0000" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Address</Label>
          <Input name="address" placeholder="123 Main St" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea name="notes" rows={3} placeholder="Any special instructions…" className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none" />
        </div>
        {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      </div>
      <SheetFooter className="border-t border-white/8 p-4">
        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-white/60">Cancel</Button>
        <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Adding…' : 'Add Customer'}</Button>
      </SheetFooter>
    </form>
  )
}
