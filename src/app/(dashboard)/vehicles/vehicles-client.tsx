'use client'

import { useState, useActionState } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, Search, Car, Wrench, AlertCircle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { addVehicle } from '@/app/actions/shop'

interface Vehicle {
  id: string
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  vin: string | null
  color: string | null
  mileage: number | null
  license_plate: string | null
  last_service: string | null
  next_service_due: string | null
  status: string
  customers: { id: string; first_name: string; last_name: string } | null
}

interface Customer { id: string; first_name: string; last_name: string }

const statusStyles: Record<string, string> = {
  'In Shop': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Inactive: 'bg-white/8 text-white/40 border-white/10',
}

type SortKey = 'vehicle' | 'mileage' | 'last_service' | 'next_service_due'
type SortDir = 'asc' | 'desc' | null

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="size-3 text-white/20" />
  if (sortDir === 'asc') return <ChevronUp className="size-3 text-primary" />
  return <ChevronDown className="size-3 text-primary" />
}

function isOverdue(dateStr: string | null) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

function truncateVin(vin: string) {
  return vin.length > 12 ? `${vin.slice(0, 8)}…${vin.slice(-4)}` : vin
}

function AddVehicleSheet({ open, onOpenChange, customers }: { open: boolean; onOpenChange: (v: boolean) => void; customers: Customer[] }) {
  const [state, formAction, pending] = useActionState(addVehicle, null)
  if (state?.success && open) setTimeout(() => onOpenChange(false), 800)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] bg-[oklch(0.13_0.025_255)] border-white/8 text-white overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white text-lg font-semibold">Add Vehicle</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Owner</Label>
            <select name="customer_id" className="w-full rounded-md h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
              <option value="">Select customer…</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Year</Label>
              <Input name="year" type="number" placeholder="2024" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Make</Label>
              <Input name="make" placeholder="Ford" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Model</Label>
              <Input name="model" placeholder="F-150" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Trim</Label>
            <Input name="trim" placeholder="XLT SuperCrew" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">VIN</Label>
            <Input name="vin" placeholder="17-character VIN" maxLength={17} className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 font-mono" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Color</Label>
              <Input name="color" placeholder="Oxford White" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Mileage</Label>
              <Input name="mileage" type="number" placeholder="0" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">License Plate</Label>
            <Input name="license_plate" placeholder="ABC-1234" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 uppercase" />
          </div>
          {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
          <SheetFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-white/60 border border-white/10">Cancel</Button>
            <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Saving…' : 'Save Vehicle'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default function VehiclesClient({ initialVehicles, customers }: { initialVehicles: Vehicle[]; customers: Customer[] }) {
  const [search, setSearch] = useState('')
  const [makeFilter, setMakeFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null) }
      else setSortDir('asc')
    } else { setSortKey(key); setSortDir('asc') }
  }

  const makes = [...new Set(initialVehicles.map(v => v.make).filter(Boolean))] as string[]

  const filtered = initialVehicles
    .filter(v => {
      const q = search.toLowerCase()
      const ownerName = v.customers ? `${v.customers.first_name} ${v.customers.last_name}` : ''
      return (!q || `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q) || ownerName.toLowerCase().includes(q) || (v.vin ?? '').toLowerCase().includes(q)) &&
        (makeFilter === 'all' || v.make === makeFilter)
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0
      let va: string | number, vb: string | number
      if (sortKey === 'vehicle') { va = `${a.year} ${a.make} ${a.model}`; vb = `${b.year} ${b.make} ${b.model}` }
      else if (sortKey === 'mileage') { va = a.mileage ?? 0; vb = b.mileage ?? 0 }
      else if (sortKey === 'last_service') { va = a.last_service ?? ''; vb = b.last_service ?? '' }
      else { va = a.next_service_due ?? ''; vb = b.next_service_due ?? '' }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const inShopCount = initialVehicles.filter(v => v.status === 'In Shop').length
  const overdueCount = initialVehicles.filter(v => isOverdue(v.next_service_due)).length

  const columns: Array<{ key: SortKey | null; label: string; hide?: string }> = [
    { key: 'vehicle', label: 'Vehicle' }, { key: null, label: 'VIN', hide: 'hidden sm:table-cell' },
    { key: null, label: 'Owner' }, { key: 'mileage', label: 'Mileage' },
    { key: 'last_service', label: 'Last Service', hide: 'hidden sm:table-cell' },
    { key: 'next_service_due', label: 'Next Service', hide: 'hidden sm:table-cell' },
    { key: null, label: 'Status' }, { key: null, label: '' },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="Vehicles" actions={
        <Button size="sm" onClick={() => setSheetOpen(true)} className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5">
          <Plus className="size-3.5" /> Add Vehicle
        </Button>
      } />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Vehicles', value: String(initialVehicles.length), icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'In Shop', value: String(inShopCount), icon: Wrench, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { label: 'Due for Service', value: String(overdueCount), icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map(s => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${s.bg} p-3 rounded-xl`}><s.icon className={`size-5 ${s.color}`} /></div>
                <div><p className="text-xs text-white/50 font-medium">{s.label}</p><p className="text-2xl font-bold text-white">{s.value}</p></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input placeholder="Search vehicles, owner, VIN…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9" />
          </div>
          <select value={makeFilter} onChange={e => setMakeFilter(e.target.value)} className="w-[180px] rounded-lg h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
            <option value="all">All Makes</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <Card className="glass-card border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {columns.map((col, i) => (
                    <th key={col.label || `col-${i}`} onClick={() => col.key && handleSort(col.key)}
                      className={`px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap select-none ${col.hide ?? ''} ${col.key ? 'cursor-pointer hover:text-white/70' : ''}`}>
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.key && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-10 text-center text-white/30 text-sm">
                    {initialVehicles.length === 0 ? 'No vehicles yet. Add your first vehicle above.' : 'No vehicles match your filters.'}
                  </td></tr>
                ) : filtered.map(v => {
                  const overdue = isOverdue(v.next_service_due)
                  const ownerName = v.customers ? `${v.customers.first_name} ${v.customers.last_name}` : '—'
                  return (
                    <tr key={v.id} className="hover:bg-white/3 transition-colors group cursor-pointer">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-medium text-white">{v.year} {v.make} {v.model}</span>
                        {v.color && <span className="block text-[11px] text-white/35">{v.color}</span>}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap hidden sm:table-cell">
                        <span className="font-mono text-[11px] text-white/50 tracking-wider" title={v.vin ?? undefined}>{v.vin ? truncateVin(v.vin) : '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-primary text-sm">{ownerName}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-white/70 tabular-nums">{v.mileage ? `${v.mileage.toLocaleString()} mi` : '—'}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-white/50 text-[13px] hidden sm:table-cell">
                        {v.last_service ? new Date(v.last_service).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap hidden sm:table-cell">
                        {v.next_service_due ? (
                          <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${overdue ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'}`}>
                            {new Date(v.next_service_due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Badge>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[v.status] ?? 'bg-white/8 text-white/40 border-white/10'}`}>{v.status}</Badge>
                      </td>
                      <td className="px-4 py-3.5" />
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-[11px] text-white/30">Showing {filtered.length} of {initialVehicles.length} vehicles</p>
          </div>
        </Card>
      </main>

      <AddVehicleSheet open={sheetOpen} onOpenChange={setSheetOpen} customers={customers} />
    </div>
  )
}
