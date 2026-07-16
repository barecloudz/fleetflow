import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/top-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ClipboardList, Users, DollarSign, Clock, TrendingUp, AlertCircle, Plus, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { count: openWOs },
    { count: activeCustomers },
    { data: recentWOs },
    { data: invoicesThisMonth },
    { data: lowStock },
  ] = await Promise.all([
    supabase.from('work_orders').select('*', { count: 'exact', head: true }).in('status', ['Open', 'In Progress']),
    supabase.from('customers').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
    supabase.from('work_orders').select(`
      id, number, status, total, created_at,
      customers(first_name, last_name),
      vehicles(year, make, model),
      description
    `).order('created_at', { ascending: false }).limit(5),
    supabase.from('invoices').select('amount, status').gte('created_at', startOfMonth),
    supabase.from('inventory').select('name, in_stock, reorder_point').filter('in_stock', 'lte', 'reorder_point'),
  ])

  const revenueMTD = invoicesThisMonth?.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0) ?? 0
  const outstandingMTD = invoicesThisMonth?.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((s, i) => s + i.amount, 0) ?? 0

  const statusColor: Record<string, string> = {
    'In Progress':    'bg-blue-500/15 text-blue-400 border-blue-500/20',
    'Awaiting Parts': 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    'Completed':      'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    'Open':           'bg-slate-500/15 text-slate-300 border-slate-500/20',
  }

  const realLowStock = lowStock?.filter(p => p.in_stock <= p.reorder_point) ?? []

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Dashboard"
        subtitle={now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        actions={
          <Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5" render={<Link href="/work-orders?new=1" />}>
            <Plus className="size-3.5" /> New Work Order
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { title: 'Open Work Orders', value: String(openWOs ?? 0), icon: ClipboardList, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { title: 'Active Customers', value: String(activeCustomers ?? 0), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { title: 'Revenue (MTD)', value: `$${revenueMTD.toLocaleString()}`, icon: DollarSign, color: 'text-violet-400', bg: 'bg-violet-500/10' },
            { title: 'Outstanding (MTD)', value: `$${outstandingMTD.toLocaleString()}`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map(stat => (
            <Card key={stat.title} className="glass-card border-white/8">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-white/50 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-2.5 rounded-xl`}>
                    <stat.icon className={`size-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card className="glass-card border-white/8">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">Recent Work Orders</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-7 gap-1 text-xs" render={<Link href="/work-orders" />}>
                  View all <ArrowRight className="size-3" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {!recentWOs || recentWOs.length === 0 ? (
                  <div className="px-5 py-10 text-center text-white/30 text-sm">No work orders yet.</div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {recentWOs.map(wo => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const customer = (Array.isArray(wo.customers) ? wo.customers[0] : wo.customers) as any
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const vehicle = (Array.isArray(wo.vehicles) ? wo.vehicles[0] : wo.vehicles) as any
                      return (
                        <div key={wo.id} className="px-5 py-3.5 hover:bg-white/3 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-primary/70">{wo.number}</span>
                              <span className="text-sm font-medium text-white">
                                {customer ? `${customer.first_name} ${customer.last_name}` : '—'}
                              </span>
                            </div>
                            <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusColor[wo.status] ?? ''}`}>{wo.status}</Badge>
                          </div>
                          <p className="text-[11px] text-white/40">
                            {vehicle ? `${vehicle.year ?? ''} ${vehicle.make ?? ''} ${vehicle.model ?? ''}`.trim() : ''}
                            {wo.description ? ` · ${wo.description}` : ''}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="glass-card border-white/8">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="size-4 text-amber-400" /> Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {realLowStock.length === 0 ? (
                  <p className="text-xs text-white/30 text-center py-2">No alerts</p>
                ) : realLowStock.slice(0, 4).map((part, i) => (
                  <div key={i} className="rounded-lg p-3 text-[11px] leading-relaxed border bg-amber-500/8 border-amber-500/20 text-amber-300">
                    Low stock: {part.name} ({part.in_stock} left)
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/8">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" /> Revenue MTD
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {revenueMTD + outstandingMTD === 0 ? (
                  <p className="text-xs text-white/30 text-center py-2">No revenue data yet</p>
                ) : (
                  <>
                    {[
                      { label: 'Collected', value: revenueMTD, total: revenueMTD + outstandingMTD },
                      { label: 'Outstanding', value: outstandingMTD, total: revenueMTD + outstandingMTD },
                    ].map(row => (
                      <div key={row.label} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-white/60">{row.label}</span>
                          <span className="text-white font-medium">${row.value.toLocaleString()}</span>
                        </div>
                        <Progress value={row.total > 0 ? Math.round((row.value / row.total) * 100) : 0} className="h-1.5 bg-white/8" />
                      </div>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
