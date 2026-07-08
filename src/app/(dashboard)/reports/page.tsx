import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, ClipboardList, Users, Package, Wrench, TrendingUp } from "lucide-react";

const revenueData = [
  { month: "Feb", value: 31200 },
  { month: "Mar", value: 34800 },
  { month: "Apr", value: 29500 },
  { month: "May", value: 37100 },
  { month: "Jun", value: 35600 },
  { month: "Jul", value: 38420 },
];

const maxRevenue = Math.max(...revenueData.map((d) => d.value));

const statsGrid = [
  { label: "Revenue MTD", value: "$38,420", icon: DollarSign, color: "text-violet-400", bg: "bg-violet-500/10", change: "+8.4%" },
  { label: "Work Orders Completed", value: "79", icon: ClipboardList, color: "text-blue-400", bg: "bg-blue-500/10", change: "+6" },
  { label: "New Customers", value: "22", icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", change: "+4" },
  { label: "Parts Revenue", value: "$11,200", icon: Package, color: "text-amber-400", bg: "bg-amber-500/10", change: "+3.1%" },
  { label: "Labor Revenue", value: "$22,840", icon: Wrench, color: "text-cyan-400", bg: "bg-cyan-500/10", change: "+9.2%" },
  { label: "Avg Ticket", value: "$486", icon: TrendingUp, color: "text-pink-400", bg: "bg-pink-500/10", change: "+$18" },
];

const topServices = [
  { service: "Oil Change & Filter", count: 28, revenue: "$5,432" },
  { service: "Brake Service", count: 14, revenue: "$9,800" },
  { service: "Tire Rotation & Balance", count: 19, revenue: "$2,850" },
  { service: "Engine Diagnostic", count: 11, revenue: "$3,740" },
  { service: "AC Service & Recharge", count: 9, revenue: "$2,475" },
  { service: "Transmission Service", count: 6, revenue: "$5,340" },
];

const techPerformance = [
  { name: "Alex Johnson", initials: "AJ", wos: 29, hours: "112h", revenue: "$14,200", color: "bg-blue-500/20 text-blue-300" },
  { name: "Mike Lee", initials: "ML", wos: 27, hours: "108h", revenue: "$13,640" , color: "bg-violet-500/20 text-violet-300"},
  { name: "Ryan Kim", initials: "RK", wos: 23, hours: "92h", revenue: "$10,580", color: "bg-emerald-500/20 text-emerald-300" },
];

const retentionData = [
  { label: "Returning Customers", pct: 73, color: "bg-emerald-500" },
  { label: "New Customers", pct: 27, color: "bg-blue-500" },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Reports & Analytics"
        actions={
          <Select defaultValue="this-month">
            <SelectTrigger className="h-8 w-[160px] bg-white/5 border-white/10 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/10 text-white text-sm">
              <SelectItem value="this-month" className="hover:bg-white/8">This Month</SelectItem>
              <SelectItem value="last-month" className="hover:bg-white/8">Last Month</SelectItem>
              <SelectItem value="last-3" className="hover:bg-white/8">Last 3 Months</SelectItem>
              <SelectItem value="this-year" className="hover:bg-white/8">This Year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Revenue Chart */}
        <Card className="glass-card border-white/8">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">Revenue - Last 6 Months</CardTitle>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] border">
                +8.4% vs prior period
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Y-axis labels + bars */}
            <div className="flex gap-4">
              {/* Y-axis */}
              <div className="flex flex-col justify-between text-right pb-6" style={{ minWidth: 48 }}>
                {[40000, 30000, 20000, 10000, 0].map((v) => (
                  <span key={v} className="text-[10px] text-white/30 font-mono">
                    ${(v / 1000).toFixed(0)}k
                  </span>
                ))}
              </div>

              {/* Chart area */}
              <div className="flex-1">
                <div className="relative h-48 mb-2">
                  {/* Horizontal guide lines */}
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <div
                      key={pct}
                      className="absolute left-0 right-0 border-t border-white/5"
                      style={{ bottom: `${pct}%` }}
                    />
                  ))}

                  {/* Bars */}
                  <div className="absolute inset-0 flex items-end gap-3 px-2">
                    {revenueData.map((d) => {
                      const heightPct = (d.value / maxRevenue) * 100;
                      return (
                        <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                          <div className="relative w-full flex justify-center">
                            <span className="absolute -top-5 text-[10px] text-white/50 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                              ${(d.value / 1000).toFixed(1)}k
                            </span>
                          </div>
                          <div
                            className="w-full rounded-t-md gradient-blue transition-all duration-500 hover:brightness-110 cursor-pointer"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex gap-3 px-2">
                  {revenueData.map((d) => (
                    <div key={d.month} className="flex-1 text-center">
                      <span className="text-[11px] text-white/40 font-medium">{d.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
          {statsGrid.map((s) => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-white/50 font-medium">{s.label}</p>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-[11px] text-emerald-400">{s.change} vs last month</p>
                  </div>
                  <div className={`${s.bg} p-2.5 rounded-xl`}>
                    <s.icon className={`size-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Top Services */}
          <Card className="glass-card border-white/8">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white">Top Services</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Service</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-white/40">Count</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-white/40">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topServices.map((row, i) => (
                    <tr key={row.service} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/30 font-mono w-4">{i + 1}</span>
                          <span className="text-sm text-white font-medium">{row.service}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm text-white/70">{row.count}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-semibold text-white">{row.revenue}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Technician Performance */}
          <Card className="glass-card border-white/8">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-white">Technician Performance</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Technician</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-white/40">WOs</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-white/40">Hours</th>
                    <th className="text-right px-5 py-2.5 text-xs font-medium text-white/40">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {techPerformance.map((tech) => (
                    <tr key={tech.name} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold ${tech.color}`}>
                            {tech.initials}
                          </div>
                          <span className="text-sm text-white font-medium">{tech.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm text-white/70">{tech.wos}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm text-white/70">{tech.hours}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-semibold text-white">{tech.revenue}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mini performance bars */}
              <div className="px-5 pt-3 pb-4 space-y-2.5 border-t border-white/6">
                {techPerformance.map((tech) => (
                  <div key={tech.name} className="flex items-center gap-3">
                    <span className="text-[10px] text-white/40 w-6">{tech.initials}</span>
                    <div className="flex-1 bg-white/8 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-blue"
                        style={{ width: `${(tech.wos / 30) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-white/40 w-8 text-right">{tech.wos} WO</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Retention */}
        <Card className="glass-card border-white/8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-white">Customer Retention</CardTitle>
              <span className="text-xs text-white/40">Jul 2026 · 187 total customers</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Combined stacked bar */}
            <div className="h-3 rounded-full overflow-hidden flex">
              {retentionData.map((r) => (
                <div
                  key={r.label}
                  className={`h-full transition-all duration-700 ${r.color}`}
                  style={{ width: `${r.pct}%` }}
                />
              ))}
            </div>

            <div className="flex items-center gap-8">
              {retentionData.map((r) => (
                <div key={r.label} className="flex items-center gap-2">
                  <div className={`size-2.5 rounded-full ${r.color}`} />
                  <span className="text-xs text-white/60">{r.label}</span>
                  <span className="text-sm font-bold text-white">{r.pct}%</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { label: "12-month retention rate", value: "68%" },
                { label: "Avg visits per year", value: "2.4" },
                { label: "Customer lifetime value", value: "$1,165" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-white/4 border border-white/6 p-4 text-center">
                  <p className="text-xl font-bold text-white">{m.value}</p>
                  <p className="text-[11px] text-white/40 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
