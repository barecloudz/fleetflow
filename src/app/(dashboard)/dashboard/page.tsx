import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardList,
  Users,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    title: "Open Work Orders",
    value: "24",
    change: "+3 today",
    trend: "up",
    icon: ClipboardList,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Active Customers",
    value: "187",
    change: "+12 this month",
    trend: "up",
    icon: Users,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Revenue (MTD)",
    value: "$38,420",
    change: "+8.4% vs last month",
    trend: "up",
    icon: DollarSign,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "Avg. Completion Time",
    value: "2.4 days",
    change: "-0.3 days vs avg",
    trend: "down-good",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const recentOrders = [
  { id: "WO-1042", customer: "Marcus Reid", vehicle: "2019 Ford F-150", service: "Oil Change + Tire Rotation", status: "In Progress", progress: 65 },
  { id: "WO-1041", customer: "Sarah Chen", vehicle: "2021 Tesla Model 3", service: "Brake Inspection", status: "Awaiting Parts", progress: 30 },
  { id: "WO-1040", customer: "David Torres", vehicle: "2018 Chevy Tahoe", service: "Full Engine Diagnostic", status: "In Progress", progress: 80 },
  { id: "WO-1039", customer: "Priya Nair", vehicle: "2022 Honda Civic", service: "AC Service + Recharge", status: "Completed", progress: 100 },
  { id: "WO-1038", customer: "Tom Walsh", vehicle: "2017 RAM 1500", service: "Transmission Service", status: "In Progress", progress: 45 },
];

const statusColor: Record<string, string> = {
  "In Progress": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Awaiting Parts": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Completed": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
};

const alerts = [
  { message: "Low stock: Engine Oil 5W-30 (3 units left)", severity: "warning" },
  { message: "WO-1038 - Customer approval pending 2 days", severity: "warning" },
  { message: "Bay 3 equipment inspection due Friday", severity: "info" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Dashboard"
        subtitle="Tuesday, July 8 2026"
        actions={
          <Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5" render={<Link href="/work-orders?new=1" />}>
            <Plus className="size-3.5" />
            New Work Order
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="glass-card border-white/8">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-white/50 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="size-3" />
                      {stat.change}
                    </p>
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
          {/* Recent Work Orders */}
          <div className="xl:col-span-2">
            <Card className="glass-card border-white/8">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold text-white">Recent Work Orders</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-7 gap-1 text-xs">
                  View all <ArrowRight className="size-3" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="px-5 py-3.5 hover:bg-white/3 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-primary/70">{order.id}</span>
                          <span className="text-sm font-medium text-white">{order.customer}</span>
                        </div>
                        <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusColor[order.status]}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 space-y-1">
                          <p className="text-[11px] text-white/40">{order.vehicle} · {order.service}</p>
                          <Progress
                            value={order.progress}
                            className="h-1 bg-white/8"
                          />
                        </div>
                        <span className="text-[11px] text-white/40 w-8 text-right">{order.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Revenue */}
          <div className="space-y-4">
            <Card className="glass-card border-white/8">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="size-4 text-amber-400" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`rounded-lg p-3 text-[11px] leading-relaxed border ${
                      alert.severity === "warning"
                        ? "bg-amber-500/8 border-amber-500/20 text-amber-300"
                        : "bg-blue-500/8 border-blue-500/20 text-blue-300"
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card border-white/8">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-white">Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {[
                  { label: "Labor", value: "$22,840", pct: 59 },
                  { label: "Parts", value: "$11,200", pct: 29 },
                  { label: "Sublet", value: "$4,380", pct: 12 },
                ].map((row) => (
                  <div key={row.label} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/60">{row.label}</span>
                      <span className="text-white font-medium">{row.value}</span>
                    </div>
                    <Progress value={row.pct} className="h-1.5 bg-white/8" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
