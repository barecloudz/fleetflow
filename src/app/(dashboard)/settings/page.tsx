"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Users,
  Bell,
  Plug,
  CreditCard,
  CheckCircle2,
  XCircle,
  Edit2,
  UserX,
  Upload,
  ExternalLink,
  Shield,
} from "lucide-react";

// ─── Shop Info ────────────────────────────────────────────────────────────────

function ShopInfoTab() {
  return (
    <div className="space-y-6">
      <Card className="glass-card border-white/8">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <Building2 className="size-4 text-primary" /> Shop Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-4 pb-2">
            <div className="size-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Building2 className="size-7 text-white/20" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-white font-medium">Shop Logo</p>
              <p className="text-xs text-white/40">PNG, JPG up to 2MB</p>
              <Button variant="ghost" size="sm" className="h-7 px-3 text-xs border border-white/10 text-white/60 hover:text-white gap-1.5">
                <Upload className="size-3" /> Upload Logo
              </Button>
            </div>
          </div>

          <Separator className="bg-white/6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Shop Name", placeholder: "FleetFlow Auto", defaultValue: "FleetFlow Auto" },
              { label: "Phone", placeholder: "(555) 000-0000", defaultValue: "(555) 847-2291" },
              { label: "Email", placeholder: "shop@example.com", defaultValue: "service@fleetflowauto.com" },
              { label: "Website", placeholder: "https://…", defaultValue: "https://fleetflowauto.com" },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <Label className="text-white/60 text-xs">{f.label}</Label>
                <Input defaultValue={f.defaultValue} placeholder={f.placeholder} className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
              </div>
            ))}

            <div className="md:col-span-2 space-y-1.5">
              <Label className="text-white/60 text-xs">Address</Label>
              <Input defaultValue="1247 Motor Ave, Suite 3, Austin, TX 78701" className="bg-white/5 border-white/10 text-white" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Tax Rate (%)</Label>
              <Input type="number" defaultValue="8.25" className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/60 text-xs">Labor Rate ($/hr)</Label>
              <Input type="number" defaultValue="110" className="bg-white/5 border-white/10 text-white" />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button className="gradient-blue glow-blue-sm text-white h-9 px-5">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Staff ────────────────────────────────────────────────────────────────────

const staffMembers = [
  { name: "Alex Johnson", role: "Lead Technician", email: "alex@fleetflowauto.com", status: "Active", initials: "AJ", color: "bg-blue-500/20 text-blue-300" },
  { name: "Mike Lee", role: "Technician", email: "mike@fleetflowauto.com", status: "Active", initials: "ML", color: "bg-violet-500/20 text-violet-300" },
  { name: "Ryan Kim", role: "Technician", email: "ryan@fleetflowauto.com", status: "Active", initials: "RK", color: "bg-emerald-500/20 text-emerald-300" },
  { name: "Dana Cruz", role: "Service Advisor", email: "dana@fleetflowauto.com", status: "Active", initials: "DC", color: "bg-amber-500/20 text-amber-300" },
  { name: "Sam Williams", role: "Parts Manager", email: "sam@fleetflowauto.com", status: "Inactive", initials: "SW", color: "bg-white/10 text-white/40" },
];

function StaffTab() {
  return (
    <Card className="glass-card border-white/8">
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
          <Users className="size-4 text-primary" /> Staff Members
        </CardTitle>
        <Button size="sm" className="gradient-blue glow-blue-sm text-white h-7 text-xs gap-1">
          Add Staff
        </Button>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Name</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40 hidden md:table-cell">Role</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40 hidden lg:table-cell">Email</th>
              <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Status</th>
              <th className="px-5 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staffMembers.map((s) => (
              <tr key={s.name} className="hover:bg-white/3 transition-colors group">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${s.color}`}>
                      {s.initials}
                    </div>
                    <span className="text-sm font-medium text-white">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <span className="text-sm text-white/60">{s.role}</span>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  <span className="text-xs text-white/40 font-mono">{s.email}</span>
                </td>
                <td className="px-5 py-3.5">
                  <Badge className={`text-[10px] border px-2 py-0.5 rounded-full font-medium ${s.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-white/8 text-white/40 border-white/10"}`}>
                    {s.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                    <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-white hover:bg-white/8">
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-7 text-white/40 hover:text-red-400 hover:bg-red-500/10">
                      <UserX className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

interface NotifRow {
  label: string;
  email: boolean;
  sms: boolean;
}

const defaultNotifs: NotifRow[] = [
  { label: "New Work Order", email: true, sms: false },
  { label: "Work Order Completed", email: true, sms: true },
  { label: "Low Inventory", email: true, sms: false },
  { label: "Payment Received", email: true, sms: false },
  { label: "Appointment Reminder", email: true, sms: true },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${checked ? "gradient-blue" : "bg-white/15"}`}
    >
      <span
        className={`inline-block size-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-[2px]"}`}
      />
    </button>
  );
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState<NotifRow[]>(defaultNotifs);

  const toggle = (i: number, channel: "email" | "sms") => {
    setNotifs((prev) =>
      prev.map((n, idx) => (idx === i ? { ...n, [channel]: !n[channel] } : n))
    );
  };

  return (
    <Card className="glass-card border-white/8">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
          <Bell className="size-4 text-primary" /> Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/6">
              <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Event</th>
              <th className="text-center px-5 py-2.5 text-xs font-medium text-white/40">Email</th>
              <th className="text-center px-5 py-2.5 text-xs font-medium text-white/40">SMS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {notifs.map((n, i) => (
              <tr key={n.label} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-sm text-white font-medium">{n.label}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <Toggle checked={n.email} onChange={() => toggle(i, "email")} />
                </td>
                <td className="px-5 py-4 text-center">
                  <Toggle checked={n.sms} onChange={() => toggle(i, "sms")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

// ─── Integrations ─────────────────────────────────────────────────────────────

const integrations = [
  {
    name: "QuickBooks",
    description: "Sync invoices, payments, and expenses automatically.",
    status: "Connected" as const,
    icon: "QB",
    iconBg: "bg-emerald-500/20 text-emerald-300",
    lastSync: "Today at 9:41 AM",
  },
  {
    name: "Parts Ordering",
    description: "Order OEM and aftermarket parts directly from FleetFlow.",
    status: "Not Connected" as const,
    icon: "PO",
    iconBg: "bg-white/8 text-white/40",
    lastSync: null,
  },
  {
    name: "SMS Provider (Twilio)",
    description: "Send appointment reminders and status updates via SMS.",
    status: "Connected" as const,
    icon: "SM",
    iconBg: "bg-blue-500/20 text-blue-300",
    lastSync: "Active",
  },
  {
    name: "Email (Resend)",
    description: "Transactional emails for invoices, reminders, and receipts.",
    status: "Connected" as const,
    icon: "EM",
    iconBg: "bg-violet-500/20 text-violet-300",
    lastSync: "Active",
  },
];

function IntegrationsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {integrations.map((intg) => (
        <Card key={intg.name} className="glass-card border-white/8">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className={`size-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${intg.iconBg}`}>
                {intg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{intg.name}</span>
                  {intg.status === "Connected" ? (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] border px-1.5 py-0 gap-0.5 flex items-center">
                      <CheckCircle2 className="size-2.5" /> Connected
                    </Badge>
                  ) : (
                    <Badge className="bg-white/8 text-white/40 border-white/10 text-[10px] border px-1.5 py-0 gap-0.5 flex items-center">
                      <XCircle className="size-2.5" /> Not Connected
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-white/40 leading-relaxed">{intg.description}</p>
                {intg.lastSync && (
                  <p className="text-[10px] text-white/30 mt-1.5">Last sync: {intg.lastSync}</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {intg.status === "Connected" ? (
                <>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-white/40 hover:text-white border border-white/8 hover:bg-white/5 gap-1">
                    <ExternalLink className="size-3" /> Manage
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-white/8">
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button size="sm" className="h-7 text-xs gradient-blue glow-blue-sm text-white gap-1">
                  <Plug className="size-3" /> Connect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Billing ──────────────────────────────────────────────────────────────────

function BillingTab() {
  const usageItems = [
    { label: "Work Orders This Month", used: 79, limit: 200 },
    { label: "Staff Accounts", used: 4, limit: 10 },
    { label: "SMS Messages Sent", used: 312, limit: 500 },
    { label: "Storage Used", used: 2.4, limit: 10, unit: "GB" },
  ];

  return (
    <div className="space-y-6">
      {/* Current plan */}
      <Card className="glass-card border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-blue opacity-5 pointer-events-none" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="size-4 text-primary" />
                <span className="text-xs text-primary font-semibold uppercase tracking-wide">Current Plan</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Pro Plan</h2>
              <p className="text-white/50 text-sm mt-1">$149 / month · Billed monthly</p>
              <p className="text-white/30 text-xs mt-1">Next billing date: August 1, 2026</p>
            </div>
            <div className="text-right">
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 border text-xs px-2.5 py-1">
                Active
              </Badge>
            </div>
          </div>

          <Separator className="bg-white/6 my-5" />

          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Technicians", value: "Up to 10" },
              { label: "Work Orders/mo", value: "Unlimited" },
              { label: "SMS Messages", value: "500/mo" },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-sm font-semibold text-white">{f.value}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-5">
            <Button className="gradient-blue glow-blue-sm text-white h-9 px-5 text-sm">Upgrade to Enterprise</Button>
            <Button variant="ghost" className="border border-white/10 text-white/60 hover:text-white h-9 px-5 text-sm hover:bg-white/5">
              Manage Billing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card className="glass-card border-white/8">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
            <CreditCard className="size-4 text-primary" /> Usage This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {usageItems.map((item) => {
            const pct = Math.round((item.used / item.limit) * 100);
            const isHigh = pct >= 80;
            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{item.label}</span>
                  <span className={`font-medium ${isHigh ? "text-amber-400" : "text-white"}`}>
                    {item.used}{item.unit ?? ""} / {item.limit}{item.unit ?? ""}
                    <span className="text-white/30 ml-1">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${isHigh ? "bg-amber-500" : "gradient-blue"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card className="glass-card border-white/8">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-white">Billing History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Date</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Description</th>
                <th className="text-right px-5 py-2.5 text-xs font-medium text-white/40">Amount</th>
                <th className="text-left px-5 py-2.5 text-xs font-medium text-white/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { date: "Jul 1, 2026", desc: "Pro Plan - Monthly", amount: "$149.00", status: "Paid" },
                { date: "Jun 1, 2026", desc: "Pro Plan - Monthly", amount: "$149.00", status: "Paid" },
                { date: "May 1, 2026", desc: "Pro Plan - Monthly", amount: "$149.00", status: "Paid" },
              ].map((row) => (
                <tr key={row.date} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-xs text-white/50">{row.date}</td>
                  <td className="px-5 py-3 text-sm text-white">{row.desc}</td>
                  <td className="px-5 py-3 text-sm text-white font-medium text-right">{row.amount}</td>
                  <td className="px-5 py-3">
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[10px] border px-1.5">
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar title="Settings" />

      <main className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="shop">
          <div className="overflow-x-auto -mx-6 px-6 mb-6">
            <TabsList className="bg-white/5 border border-white/8 h-9 w-max min-w-full">
              <TabsTrigger value="shop" className="text-xs gap-1.5 whitespace-nowrap data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Building2 className="size-3.5" /> Shop Info
              </TabsTrigger>
              <TabsTrigger value="staff" className="text-xs gap-1.5 whitespace-nowrap data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Users className="size-3.5" /> Staff
              </TabsTrigger>
              <TabsTrigger value="notifications" className="text-xs gap-1.5 whitespace-nowrap data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Bell className="size-3.5" /> Notifications
              </TabsTrigger>
              <TabsTrigger value="integrations" className="text-xs gap-1.5 whitespace-nowrap data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Plug className="size-3.5" /> Integrations
              </TabsTrigger>
              <TabsTrigger value="billing" className="text-xs gap-1.5 whitespace-nowrap data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <CreditCard className="size-3.5" /> Billing
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="shop"><ShopInfoTab /></TabsContent>
          <TabsContent value="staff"><StaffTab /></TabsContent>
          <TabsContent value="notifications"><NotificationsTab /></TabsContent>
          <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
