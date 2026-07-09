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
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Plus,
  Search,
  MoreHorizontal,
  ArrowRight,
  FileCheck,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type EstimateStatus = "Draft" | "Sent" | "Approved" | "Declined" | "Expired";

interface Estimate {
  id: string;
  customer: string;
  vehicle: string;
  services: string;
  laborHours: number;
  partsCost: number;
  total: number;
  created: string;
  status: EstimateStatus;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LABOR_RATE = 95; // $ per hour

const initialEstimates: Estimate[] = [
  {
    id: "EST-0112",
    customer: "Marcus Reid",
    vehicle: "2019 Ford F-150",
    services: "Timing Chain Replacement, Valve Cover Gasket",
    laborHours: 6,
    partsCost: 480,
    total: 480 + 6 * LABOR_RATE,
    created: "Jul 7, 2026",
    status: "Approved",
    notes: "Customer approved via phone.",
  },
  {
    id: "EST-0111",
    customer: "Sarah Chen",
    vehicle: "2021 Tesla Model 3",
    services: "Brake Fluid Flush, Cabin Air Filter",
    laborHours: 1.5,
    partsCost: 85,
    total: 85 + 1.5 * LABOR_RATE,
    created: "Jul 7, 2026",
    status: "Sent",
  },
  {
    id: "EST-0110",
    customer: "David Torres",
    vehicle: "2018 Chevy Tahoe",
    services: "Full Engine Diagnostic, Spark Plug Replacement",
    laborHours: 3,
    partsCost: 210,
    total: 210 + 3 * LABOR_RATE,
    created: "Jul 6, 2026",
    status: "Draft",
  },
  {
    id: "EST-0109",
    customer: "Priya Nair",
    vehicle: "2022 Honda Civic",
    services: "AC Compressor Replacement",
    laborHours: 4,
    partsCost: 620,
    total: 620 + 4 * LABOR_RATE,
    created: "Jul 5, 2026",
    status: "Approved",
    notes: "Parts ordered, waiting for delivery.",
  },
  {
    id: "EST-0108",
    customer: "Tom Walsh",
    vehicle: "2017 RAM 1500",
    services: "Transmission Rebuild",
    laborHours: 10,
    partsCost: 1200,
    total: 1200 + 10 * LABOR_RATE,
    created: "Jul 5, 2026",
    status: "Declined",
    notes: "Customer opted for a used transmission elsewhere.",
  },
  {
    id: "EST-0107",
    customer: "Angela Kim",
    vehicle: "2020 Subaru Outback",
    services: "Head Gasket Repair, Coolant System Flush",
    laborHours: 8,
    partsCost: 390,
    total: 390 + 8 * LABOR_RATE,
    created: "Jul 3, 2026",
    status: "Expired",
  },
  {
    id: "EST-0106",
    customer: "Carlos Mendez",
    vehicle: "2016 Toyota Tacoma",
    services: "Timing Belt & Water Pump Kit",
    laborHours: 5,
    partsCost: 340,
    total: 340 + 5 * LABOR_RATE,
    created: "Jul 2, 2026",
    status: "Sent",
  },
  {
    id: "EST-0105",
    customer: "Jennifer Okafor",
    vehicle: "2023 Kia Telluride",
    services: "30k Mile Service Package",
    laborHours: 2,
    partsCost: 175,
    total: 175 + 2 * LABOR_RATE,
    created: "Jul 1, 2026",
    status: "Draft",
  },
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
};

// ─── Status config ────────────────────────────────────────────────────────────

const statusStyles: Record<EstimateStatus, string> = {
  Draft:    "bg-slate-500/15 text-slate-300 border-slate-500/20",
  Sent:     "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Declined: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  Expired:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

function StatusBadge({ status }: { status: EstimateStatus }) {
  return (
    <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const statConfig = [
  {
    label: "Total Estimates",
    key: "total",
    icon: FileText,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Pending Approval",
    key: "sent",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "Approved This Month",
    key: "approved",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Conversion Rate",
    key: "conversion",
    icon: DollarSign,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
];

// ─── New Estimate Sheet Form ───────────────────────────────────────────────────

interface NewEstimateFormProps {
  onSubmit: (est: Estimate) => void;
  onClose: () => void;
}

function NewEstimateForm({ onSubmit, onClose }: NewEstimateFormProps) {
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [services, setServices] = useState("");
  const [laborHours, setLaborHours] = useState("");
  const [partsCost, setPartsCost] = useState("");
  const [notes, setNotes] = useState("");

  const vehicleOptions = customer ? (CUSTOMERS_MAP[customer] ?? []) : [];

  const labor = parseFloat(laborHours) || 0;
  const parts = parseFloat(partsCost) || 0;
  const total = parts + labor * LABOR_RATE;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || !vehicle || !services) return;

    const newId = `EST-${113 + Math.floor(Math.random() * 100)}`;
    onSubmit({
      id: newId,
      customer,
      vehicle,
      services,
      laborHours: labor,
      partsCost: parts,
      total,
      created: "Jul 8, 2026",
      status: "Draft",
      notes: notes || undefined,
    });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Customer */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Customer</Label>
          <Select
            value={customer}
            onValueChange={(v) => { if (v) { setCustomer(v); setVehicle(""); } }}
          >
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
          <Select
            value={vehicle}
            onValueChange={(v) => v && setVehicle(v)}
            disabled={!customer}
          >
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

        {/* Services */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Services</Label>
          <textarea
            value={services}
            onChange={(e) => setServices(e.target.value)}
            placeholder="Describe services to be performed…"
            rows={3}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        {/* Labor Hours & Parts Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Labor Hours</Label>
            <Input
              type="number"
              min="0"
              step="0.5"
              value={laborHours}
              onChange={(e) => setLaborHours(e.target.value)}
              placeholder="0"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Parts Cost ($)</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={partsCost}
              onChange={(e) => setPartsCost(e.target.value)}
              placeholder="0.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-9"
            />
          </div>
        </div>

        {/* Estimated Total preview */}
        {(labor > 0 || parts > 0) && (
          <div className="flex items-center justify-between rounded-lg bg-white/4 border border-white/8 px-4 py-3">
            <span className="text-xs text-white/50 uppercase tracking-wide font-medium">Estimated Total</span>
            <span className="text-white font-semibold tabular-nums">${total.toFixed(2)}</span>
          </div>
        )}

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes or customer-facing remarks…"
            rows={2}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
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
          disabled={!customer || !vehicle || !services}
        >
          Create Estimate
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Estimates Table ──────────────────────────────────────────────────────────

interface EstimatesTableProps {
  estimates: Estimate[];
  onSendForApproval: (id: string) => void;
  onConvertToInvoice: (id: string) => void;
  onDecline: (id: string) => void;
}

function EstimatesTable({
  estimates,
  onSendForApproval,
  onConvertToInvoice,
  onDecline,
}: EstimatesTableProps) {
  if (estimates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/30">
        <FileText className="size-10 mb-3 opacity-40" />
        <p className="text-sm">No estimates found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/6">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Estimate #</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Customer</th>
            <th className="hidden sm:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Vehicle</th>
            <th className="hidden md:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Services</th>
            <th className="text-right px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Total</th>
            <th className="hidden sm:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Created</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Actions</th>
            <th className="px-4 py-3 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/4">
          {estimates.map((est) => (
            <tr key={est.id} className="hover:bg-white/3 transition-colors group">
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="font-mono text-xs text-primary/70">{est.id}</span>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-white font-medium">{est.customer}</span>
              </td>
              <td className="hidden sm:table-cell px-4 py-3.5 text-white/60 whitespace-nowrap">{est.vehicle}</td>
              <td className="hidden md:table-cell px-4 py-3.5 text-white/70 max-w-[200px] truncate">{est.services}</td>
              <td className="px-4 py-3.5 text-right font-medium text-white tabular-nums whitespace-nowrap">
                ${est.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </td>
              <td className="hidden sm:table-cell px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">{est.created}</td>
              <td className="px-4 py-3.5">
                <StatusBadge status={est.status} />
              </td>
              <td className="px-4 py-3.5">
                {est.status === "Draft" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSendForApproval(est.id)}
                    className="h-7 gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2.5"
                  >
                    <Send className="size-3" />
                    Send
                  </Button>
                )}
                {est.status === "Approved" && (
                  <Button
                    size="sm"
                    onClick={() => onConvertToInvoice(est.id)}
                    className="h-7 gap-1.5 text-xs gradient-blue glow-blue-sm text-white font-medium px-2.5"
                  >
                    <FileCheck className="size-3" />
                    Convert
                  </Button>
                )}
              </td>
              <td className="px-4 py-3.5">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end" side="bottom">
                    {est.status === "Draft" && (
                      <DropdownMenuItem onClick={() => onSendForApproval(est.id)}>
                        <Send className="size-3.5" />
                        Send for Approval
                      </DropdownMenuItem>
                    )}
                    {est.status === "Approved" && (
                      <DropdownMenuItem onClick={() => onConvertToInvoice(est.id)}>
                        <ArrowRight className="size-3.5" />
                        Convert to Invoice
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDecline(est.id)}
                      disabled={
                        est.status === "Declined" ||
                        est.status === "Expired"
                      }
                    >
                      <XCircle className="size-3.5" />
                      Decline
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

const TAB_STATUSES: Record<string, EstimateStatus | "all"> = {
  all:      "all",
  draft:    "Draft",
  sent:     "Sent",
  approved: "Approved",
  declined: "Declined",
  expired:  "Expired",
};

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimates);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  // ── handlers ──

  function handleNewEstimate(est: Estimate) {
    setEstimates((prev) => [est, ...prev]);
  }

  function handleSendForApproval(id: string) {
    setEstimates((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Sent" as EstimateStatus } : e))
    );
  }

  function handleConvertToInvoice(id: string) {
    // In a real app this would create an invoice record; here we simply mark it
    setEstimates((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "Approved" as EstimateStatus } : e
      )
    );
    // Visual feedback — a toast would live here in production
    alert(`Estimate ${id} converted to invoice (stub).`);
  }

  function handleDecline(id: string) {
    setEstimates((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Declined" as EstimateStatus } : e))
    );
  }

  // ── derived stats ──

  const totalCount = estimates.length;
  const sentCount = estimates.filter((e) => e.status === "Sent").length;
  const approvedCount = estimates.filter((e) => e.status === "Approved").length;
  const closedCount = estimates.filter(
    (e) => e.status === "Approved" || e.status === "Declined"
  ).length;
  const conversionRate =
    closedCount > 0 ? Math.round((approvedCount / closedCount) * 100) : 0;

  const statValues: Record<string, string> = {
    total:      String(totalCount),
    sent:       String(sentCount),
    approved:   String(approvedCount),
    conversion: `${conversionRate}%`,
  };

  // ── filtering ──

  const filtered = estimates.filter((e) => {
    const statusMatch =
      activeTab === "all" || e.status === TAB_STATUSES[activeTab];
    const searchMatch =
      search === "" ||
      e.customer.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.vehicle.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const countFor = (tab: string) => {
    if (tab === "all") return estimates.length;
    return estimates.filter((e) => e.status === TAB_STATUSES[tab]).length;
  };

  const filteredTotal = filtered.reduce((sum, e) => sum + e.total, 0);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Estimates"
        subtitle={`${sentCount} pending approval`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5">
                  <Plus className="size-3.5" />
                  New Estimate
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]"
              showCloseButton={false}
            >
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">New Estimate</SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">Build a cost estimate to send for customer approval.</p>
              </SheetHeader>
              <NewEstimateForm
                onSubmit={handleNewEstimate}
                onClose={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statConfig.map(({ label, key, icon: Icon, color, bg }) => (
            <div key={key} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className={`${bg} rounded-lg p-2.5 shrink-0`}>
                <Icon className={`size-4 ${color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/40 truncate">{label}</p>
                <p className="text-xl font-bold text-white tabular-nums mt-0.5">
                  {statValues[key]}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Search row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-white/5 border border-white/8 h-9 p-1 gap-0.5">
              {[
                { key: "all",      label: "All"      },
                { key: "draft",    label: "Draft"    },
                { key: "sent",     label: "Sent"     },
                { key: "approved", label: "Approved" },
                { key: "declined", label: "Declined" },
                { key: "expired",  label: "Expired"  },
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

            {["all", "draft", "sent", "approved", "declined", "expired"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0" />
            ))}
          </Tabs>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or EST#…"
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/40 text-sm"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="glass-card rounded-xl overflow-hidden border-white/8">
          <EstimatesTable
            estimates={filtered}
            onSendForApproval={handleSendForApproval}
            onConvertToInvoice={handleConvertToInvoice}
            onDecline={handleDecline}
          />

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Showing{" "}
              <span className="text-white/50 font-medium">{filtered.length}</span> of{" "}
              <span className="text-white/50 font-medium">{estimates.length}</span> estimates
            </p>
            <p className="text-xs text-white/30">
              Total value:{" "}
              <span className="text-white/60 font-medium">
                ${filteredTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
