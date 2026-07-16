'use client'

import { useState, useActionState, useTransition } from 'react'
import { TopBar } from '@/components/layout/top-bar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, Search, Package, AlertTriangle, XCircle, DollarSign, MoreHorizontal, ChevronUp, ChevronDown, ChevronsUpDown, ArrowRight } from 'lucide-react'
import { addPart, deletePart } from '@/app/actions/shop'

type Category = 'Engine' | 'Brakes' | 'Tires' | 'Electrical' | 'Filters' | 'Fluids' | 'Body' | string

interface Part {
  id: string
  name: string
  part_number: string | null
  category: string | null
  in_stock: number
  reorder_point: number
  unit_cost: number
  supplier: string | null
}

const categories = ['Engine', 'Brakes', 'Tires', 'Electrical', 'Filters', 'Fluids', 'Body']

const categoryStyles: Record<string, string> = {
  Engine: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  Brakes: 'bg-red-500/15 text-red-400 border-red-500/20',
  Tires: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  Electrical: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  Filters: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  Fluids: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Body: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
}

function getStockStatus(part: Part) {
  if (part.in_stock === 0) return 'Out of Stock'
  if (part.in_stock <= part.reorder_point) return 'Low'
  return 'OK'
}

const stockStatusStyles: Record<string, string> = {
  OK: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Low: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Out of Stock': 'bg-red-500/15 text-red-400 border-red-500/20',
}

function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

type SortKey = 'name' | 'category' | 'in_stock' | 'unit_cost' | 'totalValue'
type SortDir = 'asc' | 'desc' | null

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="size-3 text-white/20" />
  if (sortDir === 'asc') return <ChevronUp className="size-3 text-primary" />
  return <ChevronDown className="size-3 text-primary" />
}

function AddPartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [state, formAction, pending] = useActionState(addPart, null)

  if (state?.success && open) setTimeout(() => onOpenChange(false), 800)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] bg-[oklch(0.13_0.025_255)] border-white/8 text-white overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white text-lg font-semibold">Add Part</SheetTitle>
        </SheetHeader>
        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Part Name *</Label>
            <Input name="name" required placeholder="e.g. Engine Oil 5W-30 (1 qt)" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Part Number</Label>
            <Input name="part_number" placeholder="e.g. OIL-5W30-QT" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Category</Label>
            <select name="category" className="w-full rounded-md h-9 px-3 text-sm text-white border bg-white/5 border-white/10">
              <option value="">Select category…</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Unit Cost ($)</Label>
            <Input name="unit_cost" type="number" step="0.01" placeholder="0.00" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">In Stock (qty)</Label>
              <Input name="in_stock" type="number" placeholder="0" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Reorder Point</Label>
              <Input name="reorder_point" type="number" placeholder="0" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Supplier</Label>
            <Input name="supplier" placeholder="e.g. NAPA Wholesale" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Notes</Label>
            <textarea name="notes" rows={3} placeholder="Additional notes…" className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm px-3 py-2 resize-none focus:outline-none" />
          </div>
          {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
          <SheetFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-white/60 border border-white/10">Cancel</Button>
            <Button type="submit" disabled={pending} className="flex-1 gradient-blue text-white font-medium">{pending ? 'Saving…' : 'Save Part'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default function InventoryClient({ initialParts }: { initialParts: Part[] }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [warningDismissed, setWarningDismissed] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [, startTransition] = useTransition()

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else if (sortDir === 'desc') { setSortKey(null); setSortDir(null) }
      else setSortDir('asc')
    } else {
      setSortKey(key); setSortDir('asc')
    }
  }

  const filtered = initialParts
    .filter(p => {
      const q = search.toLowerCase()
      return (!q || p.name.toLowerCase().includes(q) || (p.part_number ?? '').toLowerCase().includes(q) || (p.supplier ?? '').toLowerCase().includes(q)) &&
        (categoryFilter === 'all' || p.category === categoryFilter)
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0
      let va: string | number, vb: string | number
      if (sortKey === 'name') { va = a.name; vb = b.name }
      else if (sortKey === 'category') { va = a.category ?? ''; vb = b.category ?? '' }
      else if (sortKey === 'in_stock') { va = a.in_stock; vb = b.in_stock }
      else if (sortKey === 'unit_cost') { va = a.unit_cost; vb = b.unit_cost }
      else { va = a.in_stock * a.unit_cost; vb = b.in_stock * b.unit_cost }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const lowStockCount = initialParts.filter(p => getStockStatus(p) === 'Low').length
  const outOfStockCount = initialParts.filter(p => getStockStatus(p) === 'Out of Stock').length
  const totalValue = initialParts.reduce((acc, p) => acc + p.in_stock * p.unit_cost, 0)

  const columnHeaders: Array<{ key: SortKey | null; label: string; hide?: string }> = [
    { key: 'name', label: 'Part Name' },
    { key: null, label: 'Part Number', hide: 'hidden sm:table-cell' },
    { key: 'category', label: 'Category' },
    { key: 'in_stock', label: 'In Stock' },
    { key: null, label: 'Reorder Pt', hide: 'hidden sm:table-cell' },
    { key: 'unit_cost', label: 'Unit Cost', hide: 'hidden sm:table-cell' },
    { key: 'totalValue', label: 'Total Value', hide: 'hidden md:table-cell' },
    { key: null, label: 'Status' },
    { key: null, label: '' },
  ]

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Inventory"
        subtitle="Parts & Supplies"
        actions={
          <Button size="sm" onClick={() => setSheetOpen(true)} className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5">
            <Plus className="size-3.5" /> Add Part
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {!warningDismissed && lowStockCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="size-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300 flex-1"><span className="font-semibold">{lowStockCount} items</span> below reorder point</p>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-amber-400 hover:text-amber-300 text-xs">Review <ArrowRight className="size-3" /></Button>
            <button onClick={() => setWarningDismissed(true)} className="text-amber-400/60 hover:text-amber-400 ml-1 text-lg leading-none">×</button>
          </div>
        )}

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Total SKUs', value: String(initialParts.length), icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Low Stock', value: String(lowStockCount), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { label: 'Out of Stock', value: String(outOfStockCount), icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Total Value', value: formatCurrency(totalValue), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map(s => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}><s.icon className={`size-5 ${s.color}`} /></div>
                <div className="min-w-0">
                  <p className="text-xs text-white/50 font-medium truncate">{s.label}</p>
                  <p className="text-xl font-bold text-white truncate">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input placeholder="Search parts, SKU, supplier…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9" />
          </div>
          <Select value={categoryFilter} onValueChange={v => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-[190px] bg-white/5 border-white/10 text-white h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
              <SelectItem value="all" className="text-white focus:bg-white/10">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c} className="text-white focus:bg-white/10">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card className="glass-card border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {columnHeaders.map((col, i) => (
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
                  <tr><td colSpan={9} className="px-4 py-10 text-center text-white/30 text-sm">
                    {initialParts.length === 0 ? 'No parts yet. Add your first part above.' : 'No parts match your filters.'}
                  </td></tr>
                ) : filtered.map(part => {
                  const status = getStockStatus(part)
                  const totalVal = part.in_stock * part.unit_cost
                  const stockLow = part.in_stock <= part.reorder_point
                  return (
                    <tr key={part.id} className="hover:bg-white/3 transition-colors group cursor-pointer">
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <span className="font-medium text-white line-clamp-1">{part.name}</span>
                        <span className="block text-[11px] text-white/35 mt-0.5">{part.supplier ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap hidden sm:table-cell">
                        <span className="font-mono text-[11px] text-white/50 tracking-wider bg-white/5 px-2 py-0.5 rounded">{part.part_number ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${categoryStyles[part.category ?? ''] ?? 'bg-white/10 text-white/50 border-white/10'}`}>{part.category ?? '—'}</Badge>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap tabular-nums">
                        <span className={`font-semibold ${part.in_stock === 0 ? 'text-red-400' : stockLow ? 'text-amber-400' : 'text-white'}`}>{part.in_stock}</span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-white/40 tabular-nums hidden sm:table-cell">{part.reorder_point}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-white/70 tabular-nums hidden sm:table-cell">{formatCurrency(part.unit_cost)}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-white tabular-nums font-medium hidden md:table-cell">{formatCurrency(totalVal)}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${stockStatusStyles[status]}`}>{status}</Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="size-4" /></Button>} />
                          <DropdownMenuContent align="end" className="bg-[oklch(0.18_0.025_255)] border-white/10 text-white min-w-[140px]">
                            <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm text-red-400 focus:text-red-400"
                              onClick={() => startTransition(() => deletePart(part.id))}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-white/30">Showing {filtered.length} of {initialParts.length} parts</p>
          </div>
        </Card>
      </main>

      <AddPartSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}
