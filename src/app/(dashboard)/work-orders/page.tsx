"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  ClipboardList,
  Eye,
  Pencil,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type WOStatus = "Open" | "In Progress" | "Awaiting Parts" | "Completed" | "Cancelled";
type WOPriority = "Normal" | "High" | "Urgent";

interface WorkOrder {
  id: string;
  customer: string;
  vehicle: string;
  service: string;
  tech: string;
  status: WOStatus;
  total: number;
  created: string;
  priority: WOPriority;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialWorkOrders: WorkOrder[] = [
  { id: "WO-1048", customer: "Marcus Reid",      vehicle: "2019 Ford F-150",       service: "Oil Change + Tire Rotation",   tech: "Mike Torres",  status: "In Progress",    total: 189,  created: "Jul 7, 2026",  priority: "Normal" },
  { id: "WO-1047", customer: "Sarah Chen",       vehicle: "2021 Tesla Model 3",     service: "Brake Inspection & Replace",   tech: "Sarah Kim",    status: "Awaiting Parts", total: 620,  created: "Jul 7, 2026",  priority: "High"   },
  { id: "WO-1046", customer: "David Torres",     vehicle: "2018 Chevy Tahoe",       service: "Full Engine Diagnostic",       tech: "James Webb",   status: "In Progress",    total: 340,  created: "Jul 6, 2026",  priority: "High"   },
  { id: "WO-1045", customer: "Priya Nair",       vehicle: "2022 Honda Civic",       service: "AC Service & Recharge",        tech: "Mike Torres",  status: "Completed",      total: 275,  created: "Jul 5, 2026",  priority: "Normal" },
  { id: "WO-1044", customer: "Tom Walsh",        vehicle: "2017 RAM 1500",          service: "Transmission Service",         tech: "James Webb",   status: "Completed",      total: 890,  created: "Jul 5, 2026",  priority: "Normal" },
  { id: "WO-1043", customer: "Angela Kim",       vehicle: "2020 Subaru Outback",    service: "Brake Pads & Rotor Resurface", tech: "Sarah Kim",    status: "Open",           total: 430,  created: "Jul 8, 2026",  priority: "Normal" },
  { id: "WO-1042", customer: "Carlos Mendez",    vehicle: "2016 Toyota Tacoma",     service: "Timing Belt Replacement",      tech: "Unassigned",   status: "Open",           total: 760,  created: "Jul 8, 2026",  priority: "Urgent" },
  { id: "WO-1041", customer: "Jennifer Okafor",  vehicle: "2023 Kia Telluride",     service: "30k Mile Service",             tech: "Mike Torres",  status: "In Progress",    total: 310,  created: "Jul 6, 2026",  priority: "Normal" },
  { id: "WO-1040", customer: "Ryan Patel",       vehicle: "2015 BMW 328i",          service: "Coolant Flush + Thermostat",   tech: "James Webb",   status: "Awaiting Parts", total: 520,  created: "Jul 4, 2026",  priority: "High"   },
  { id: "WO-1039", customer: "Danielle Brooks",  vehicle: "2020 Chevy Equinox",     service: "Alignment & Wheel Balance",    tech: "Sarah Kim",    status: "Completed",      total: 145,  created: "Jul 3, 2026",  priority: "Normal" },
  { id: "WO-1038", customer: "James Oduya",      vehicle: "2019 Honda Pilot",       service: "Spark Plug Replacement",       tech: "Mike Torres",  status: "Cancelled",      total: 310,  created: "Jul 2, 2026",  priority: "Normal" },
  { id: "WO-1037", customer: "Lisa Fernandez",   vehicle: "2021 Ford Explorer",     service: "Battery Replace + Alternator", tech: "James Webb",   status: "Completed",      total: 480,  created: "Jul 1, 2026",  priority: "High"   },
];

const CUSTOMERS_MAP: Record<string, string[]> = {
  "Marcus Reid":     ["2019 Ford F-150", "2015 Ford Mustang"],
  "Sarah Chen":      ["2021 Tesla Model 3", "2018 Honda Accord"],
  "David Torres":    ["2018 Chevy Tahoe", "2020 Chevy Silverado"],
  "Priya Nair":      ["2022 Honda Civic", "2019 Honda CR-V"],
  "Tom Walsh":       ["2017 RAM 1500", "2014 Dodge Challenger"],
  "Angela Kim":      ["2020 Subaru Outback", "2017 Subaru Forester"],
  "Carlos Mendez":   ["2016 Toyota Tacoma", "2013 Toyota Corolla"],
  "Jennifer Okafor": ["2023 Kia Telluride", "2021 Kia Sportage"],
  "Ryan Patel":      ["2015 BMW 328i", "2012 BMW 335i"],
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<WOStatus, string> = {
  "In Progress":    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  "Open":           "bg-slate-500/15 text-slate-300 border-slate-500/20",
  "Awaiting Parts": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Completed":      "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Cancelled":      "bg-red-500/15 text-red-400 border-red-500/20",
};

const priorityStyles: Record<WOPriority, string> = {
  "Normal": "bg-slate-500/10 text-slate-400 border-slate-500/15",
  "High":   "bg-orange-500/15 text-orange-400 border-orange-500/20",
  "Urgent": "bg-red-500/15 text-red-400 border-red-500/20",
};

function StatusBadge({ status }: { status: WOStatus }) {
  return (
    <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}

// ─── New WO Sheet Form ────────────────────────────────────────────────────────

interface NewWOFormProps {
  onSubmit: (wo: WorkOrder) => void;
  onClose: () => void;
}

function NewWOForm({ onSubmit, onClose }: NewWOFormProps) {
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [priority, setPriority] = useState<WOPriority>("Normal");
  const [estimatedTotal, setEstimatedTotal] = useState("");

  const vehicleOptions = customer ? (CUSTOMERS_MAP[customer] ?? []) : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || !vehicle || !serviceType || !tech) return;

    const newId = `WO-${1049 + Math.floor(Math.random() * 100)}`;
    onSubmit({
      id: newId,
      customer,
      vehicle,
      service: serviceType,
      tech,
      status: "Open",
      total: parseFloat(estimatedTotal) || 0,
      created: "Jul 8, 2026",
      priority,
    });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Customer */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Customer</Label>
          <Select value={customer} onValueChange={(v) => { if (v) { setCustomer(v); setVehicle(""); } }}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Select customer…" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CUSTOMERS_MAP).map((name) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Vehicle</Label>
          <Select value={vehicle} onValueChange={(v) => v && setVehicle(v)} disabled={!customer}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9 disabled:opacity-40">
              <SelectValue placeholder={customer ? "Select vehicle…" : "Select a customer first"} />
            </SelectTrigger>
            <SelectContent>
              {vehicleOptions.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Service Type */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Service Type</Label>
          <Select value={serviceType} onValueChange={(v) => v && setServiceType(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Select service…" />
            </SelectTrigger>
            <SelectContent>
              {["Oil Change", "Brake Service", "Engine Diagnostic", "Tire Rotation", "AC Service", "Transmission Service", "Custom"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Description</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the work to be performed…"
            rows={3}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 px-3 py-2 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Assigned Tech */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Assigned Tech</Label>
          <Select value={tech} onValueChange={(v) => v && setTech(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Assign technician…" />
            </SelectTrigger>
            <SelectContent>
              {["Mike Torres", "Sarah Kim", "James Webb", "Unassigned"].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority & Total row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Priority</Label>
            <Select value={priority} onValueChange={(v) => v && setPriority(v as WOPriority)}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Normal", "High", "Urgent"] as WOPriority[]).map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Est. Total ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={estimatedTotal}
              onChange={(e) => setEstimatedTotal(e.target.value)}
              placeholder="0.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 h-9"
            />
          </div>
        </div>
      </div>

      <SheetFooter className="border-t border-white/8 p-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 text-white/60 hover:text-white hover:bg-white/5"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 gradient-blue glow-blue-sm text-white font-medium"
          disabled={!customer || !vehicle || !serviceType || !tech}
        >
          Create Work Order
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Work Orders Table ────────────────────────────────────────────────────────

interface WOTableProps {
  orders: WorkOrder[];
  onMarkComplete: (id: string) => void;
  onCancel: (id: string) => void;
}

function WorkOrdersTable({ orders, onMarkComplete, onCancel }: WOTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <ClipboardList className="size-10 mb-3 opacity-40" />
        <p className="text-sm">No work orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/6">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">WO #</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Customer</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Vehicle</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Service</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Assigned Tech</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Total</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Created</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/4">
          {orders.map((wo) => (
            <tr key={wo.id} className="hover:bg-white/3 transition-colors group">
              <td className="px-4 py-3.5 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-primary/70">{wo.id}</span>
                  {wo.priority !== "Normal" && (
                    <Badge className={`text-[9px] border px-1.5 py-0 rounded-full ${priorityStyles[wo.priority]}`}>
                      {wo.priority}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-white font-medium">{wo.customer}</span>
              </td>
              <td className="px-4 py-3.5 text-white/60 whitespace-nowrap">{wo.vehicle}</td>
              <td className="px-4 py-3.5 text-white/70 max-w-[180px] truncate">{wo.service}</td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className={wo.tech === "Unassigned" ? "text-white/30 italic text-xs" : "text-white/70 text-sm"}>
                  {wo.tech}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <StatusBadge status={wo.status} />
              </td>
              <td className="px-4 py-3.5 text-right font-medium text-white tabular-nums whitespace-nowrap">
                ${wo.total.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">{wo.created}</td>
              <td className="px-4 py-3.5">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="size-4" /></Button>} />
                  <DropdownMenuContent align="end" side="bottom">
                    <DropdownMenuItem>
                      <Eye className="size-3.5" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pencil className="size-3.5" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onMarkComplete(wo.id)}
                      disabled={wo.status === "Completed" || wo.status === "Cancelled"}
                    >
                      <CheckCircle className="size-3.5" />
                      Mark Complete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onCancel(wo.id)}
                      disabled={wo.status === "Cancelled" || wo.status === "Completed"}
                    >
                      <XCircle className="size-3.5" />
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_STATUSES: Record<string, WOStatus | "all"> = {
  all:             "all",
  open:            "Open",
  "in-progress":   "In Progress",
  "awaiting-parts":"Awaiting Parts",
  completed:       "Completed",
};

export default function WorkOrdersPage() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("new") === "1";
    }
    return false;
  });

  function handleNewWO(wo: WorkOrder) {
    setWorkOrders((prev) => [wo, ...prev]);
  }

  function handleMarkComplete(id: string) {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status: "Completed" as WOStatus } : wo))
    );
  }

  function handleCancel(id: string) {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === id ? { ...wo, status: "Cancelled" as WOStatus } : wo))
    );
  }

  const filtered = workOrders.filter((wo) => {
    const statusMatch =
      activeTab === "all" || wo.status === TAB_STATUSES[activeTab];
    const searchMatch =
      search === "" ||
      wo.customer.toLowerCase().includes(search.toLowerCase()) ||
      wo.id.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const countFor = (tab: string) => {
    if (tab === "all") return workOrders.length;
    return workOrders.filter((wo) => wo.status === TAB_STATUSES[tab]).length;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Work Orders"
        subtitle={`${workOrders.filter((w) => w.status === "Open" || w.status === "In Progress").length} active orders`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New Work Order</Button>} />
            <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]" showCloseButton={false}>
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">New Work Order</SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">Fill in the details to create a new work order.</p>
              </SheetHeader>
              <NewWOForm onSubmit={handleNewWO} onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-white/5 border border-white/8 h-9 p-1 gap-0.5">
              {[
                { key: "all",              label: "All" },
                { key: "open",             label: "Open" },
                { key: "in-progress",      label: "In Progress" },
                { key: "awaiting-parts",   label: "Awaiting Parts" },
                { key: "completed",        label: "Completed" },
              ].map(({ key, label }) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="text-xs px-3 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 data-[state=active]:shadow-none rounded"
                >
                  {label}
                  <span className="ml-1.5 text-[10px] opacity-60">({countFor(key)})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab content is a single shared table - tabs only filter */}
            {["all", "open", "in-progress", "awaiting-parts", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0" />
            ))}
          </Tabs>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or WO#…"
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/40 text-sm"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="glass-card rounded-xl overflow-hidden border-white/8">
          <WorkOrdersTable
            orders={filtered}
            onMarkComplete={handleMarkComplete}
            onCancel={handleCancel}
          />

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Showing <span className="text-white/50 font-medium">{filtered.length}</span> of{" "}
              <span className="text-white/50 font-medium">{workOrders.length}</span> work orders
            </p>
            <p className="text-xs text-white/30">
              Total value:{" "}
              <span className="text-white/60 font-medium">
                ${filtered.reduce((s, w) => s + w.total, 0).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
