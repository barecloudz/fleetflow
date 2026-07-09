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
  ClipboardCheck,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Share2,
  Eye,
  Plus,
  Car,
  User,
  FileText,
  Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type InspectionStatus =
  | "In Progress"
  | "Completed"
  | "Sent to Customer"
  | "Approved";

type HealthStatus = "Good" | "Monitor" | "Needs Attention";

interface HealthSummary {
  good: number;
  monitor: number;
  attention: number;
}

interface Inspection {
  id: string;
  workOrder: string;
  inspector: string;
  inspectorInitials: string;
  customer: string;
  vehicle: string;
  status: InspectionStatus;
  template: string;
  totalItems: number;
  checkedItems: number;
  health: HealthSummary;
  photos: number;
  date: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialInspections: Inspection[] = [
  {
    id: "DVI-0091",
    workOrder: "WO-1048",
    inspector: "Mike Torres",
    inspectorInitials: "MT",
    customer: "Marcus Reid",
    vehicle: "2019 Ford F-150",
    status: "In Progress",
    template: "Full Inspection",
    totalItems: 15,
    checkedItems: 9,
    health: { good: 6, monitor: 2, attention: 1 },
    photos: 4,
    date: "Jul 8, 2026",
  },
  {
    id: "DVI-0090",
    workOrder: "WO-1047",
    inspector: "Sarah Kim",
    inspectorInitials: "SK",
    customer: "Sarah Chen",
    vehicle: "2021 Tesla Model 3",
    status: "Completed",
    template: "Full Inspection",
    totalItems: 15,
    checkedItems: 15,
    health: { good: 10, monitor: 3, attention: 2 },
    photos: 8,
    date: "Jul 7, 2026",
  },
  {
    id: "DVI-0089",
    workOrder: "WO-1046",
    inspector: "James Webb",
    inspectorInitials: "JW",
    customer: "David Torres",
    vehicle: "2018 Chevy Tahoe",
    status: "Sent to Customer",
    template: "Full Inspection",
    totalItems: 15,
    checkedItems: 15,
    health: { good: 5, monitor: 4, attention: 6 },
    photos: 11,
    date: "Jul 6, 2026",
  },
  {
    id: "DVI-0088",
    workOrder: "WO-1045",
    inspector: "Mike Torres",
    inspectorInitials: "MT",
    customer: "Priya Nair",
    vehicle: "2022 Honda Civic",
    status: "Approved",
    template: "Oil Change Inspection",
    totalItems: 8,
    checkedItems: 8,
    health: { good: 7, monitor: 1, attention: 0 },
    photos: 3,
    date: "Jul 5, 2026",
  },
  {
    id: "DVI-0087",
    workOrder: "WO-1044",
    inspector: "James Webb",
    inspectorInitials: "JW",
    customer: "Tom Walsh",
    vehicle: "2017 RAM 1500",
    status: "Approved",
    template: "Pre-Purchase Inspection",
    totalItems: 18,
    checkedItems: 18,
    health: { good: 11, monitor: 5, attention: 2 },
    photos: 14,
    date: "Jul 5, 2026",
  },
  {
    id: "DVI-0086",
    workOrder: "WO-1041",
    inspector: "Sarah Kim",
    inspectorInitials: "SK",
    customer: "Jennifer Okafor",
    vehicle: "2023 Kia Telluride",
    status: "In Progress",
    template: "Tire Rotation",
    totalItems: 6,
    checkedItems: 3,
    health: { good: 3, monitor: 0, attention: 0 },
    photos: 2,
    date: "Jul 8, 2026",
  },
];

const CUSTOMERS_MAP: Record<string, string[]> = {
  "Marcus Reid": ["2019 Ford F-150", "2015 Ford Mustang"],
  "Sarah Chen": ["2021 Tesla Model 3", "2018 Honda Accord"],
  "David Torres": ["2018 Chevy Tahoe", "2020 Chevy Silverado"],
  "Priya Nair": ["2022 Honda Civic", "2019 Honda CR-V"],
  "Tom Walsh": ["2017 RAM 1500", "2014 Dodge Challenger"],
  "Angela Kim": ["2020 Subaru Outback", "2017 Subaru Forester"],
  "Carlos Mendez": ["2016 Toyota Tacoma", "2013 Toyota Corolla"],
  "Jennifer Okafor": ["2023 Kia Telluride", "2021 Kia Sportage"],
  "Ryan Patel": ["2015 BMW 328i", "2012 BMW 335i"],
};

const WORK_ORDERS = [
  "WO-1048",
  "WO-1047",
  "WO-1046",
  "WO-1045",
  "WO-1044",
  "WO-1043",
  "WO-1042",
  "WO-1041",
];

const INSPECTORS = ["Mike Torres", "Sarah Kim", "James Webb"];

const TEMPLATES = [
  "Full Inspection",
  "Oil Change Inspection",
  "Pre-Purchase Inspection",
  "Tire Rotation",
];

// ─── Badge Styles ─────────────────────────────────────────────────────────────

const statusStyles: Record<InspectionStatus, string> = {
  "In Progress": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Sent to Customer": "bg-violet-500/15 text-violet-400 border-violet-500/20",
  Approved: "bg-teal-500/15 text-teal-400 border-teal-500/20",
};

function StatusBadge({ status }: { status: InspectionStatus }) {
  return (
    <Badge
      className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[status]}`}
    >
      {status}
    </Badge>
  );
}

// ─── New Inspection Form ──────────────────────────────────────────────────────

interface NewInspectionFormProps {
  onSubmit: (inspection: Inspection) => void;
  onClose: () => void;
}

function NewInspectionForm({ onSubmit, onClose }: NewInspectionFormProps) {
  const [customer, setCustomer] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [workOrder, setWorkOrder] = useState("");
  const [inspector, setInspector] = useState("");
  const [template, setTemplate] = useState("");

  const vehicleOptions = customer ? (CUSTOMERS_MAP[customer] ?? []) : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || !vehicle || !workOrder || !inspector || !template) return;

    const initials = inspector
      .split(" ")
      .map((n) => n[0])
      .join("");

    onSubmit({
      id: `DVI-${String(92 + Math.floor(Math.random() * 100)).padStart(4, "0")}`,
      workOrder,
      inspector,
      inspectorInitials: initials,
      customer,
      vehicle,
      status: "In Progress",
      template,
      totalItems: template === "Full Inspection" ? 15 : template === "Pre-Purchase Inspection" ? 18 : template === "Oil Change Inspection" ? 8 : 6,
      checkedItems: 0,
      health: { good: 0, monitor: 0, attention: 0 },
      photos: 0,
      date: "Jul 8, 2026",
    });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Customer */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Customer
          </Label>
          <Select
            value={customer}
            onValueChange={(v) => {
              if (v) {
                setCustomer(v);
                setVehicle("");
              }
            }}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Select customer…" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CUSTOMERS_MAP).map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Vehicle */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Vehicle
          </Label>
          <Select
            value={vehicle}
            onValueChange={(v) => v && setVehicle(v)}
            disabled={!customer}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9 disabled:opacity-40">
              <SelectValue
                placeholder={customer ? "Select vehicle…" : "Select a customer first"}
              />
            </SelectTrigger>
            <SelectContent>
              {vehicleOptions.map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Work Order */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Work Order #
          </Label>
          <Select value={workOrder} onValueChange={(v) => v && setWorkOrder(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Link to work order…" />
            </SelectTrigger>
            <SelectContent>
              {WORK_ORDERS.map((wo) => (
                <SelectItem key={wo} value={wo}>
                  {wo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inspector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Inspector
          </Label>
          <Select value={inspector} onValueChange={(v) => v && setInspector(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Assign inspector…" />
            </SelectTrigger>
            <SelectContent>
              {INSPECTORS.map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Inspection Template */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Inspection Template
          </Label>
          <Select value={template} onValueChange={(v) => v && setTemplate(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Select template…" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template categories info */}
        {template && (
          <div className="rounded-lg bg-white/4 border border-white/8 p-3 space-y-2">
            <p className="text-[11px] font-medium text-white/50 uppercase tracking-wide">
              Categories Included
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Exterior", "Engine Bay", "Undercarriage", "Tires & Wheels", "Brakes", "Interior", "Fluids"]
                .slice(
                  0,
                  template === "Oil Change Inspection"
                    ? 3
                    : template === "Tire Rotation"
                    ? 2
                    : 7
                )
                .map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/80 border border-primary/15"
                  >
                    {cat}
                  </span>
                ))}
            </div>
          </div>
        )}
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
          disabled={!customer || !vehicle || !workOrder || !inspector || !template}
        >
          Start Inspection
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Inspection Card ──────────────────────────────────────────────────────────

function InspectionCard({ inspection }: { inspection: Inspection }) {
  const progressPct =
    inspection.totalItems > 0
      ? Math.round((inspection.checkedItems / inspection.totalItems) * 100)
      : 0;

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:bg-white/[0.04] transition-colors">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Inspector avatar */}
          <div className="size-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">
              {inspection.inspectorInitials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-white/40 font-medium">Inspector</p>
            <p className="text-sm font-semibold text-white truncate">
              {inspection.inspector}
            </p>
          </div>
        </div>
        <StatusBadge status={inspection.status} />
      </div>

      {/* Vehicle + Customer */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Car className="size-3.5 text-white/35 shrink-0" />
          <span className="text-sm font-medium text-white truncate">
            {inspection.vehicle}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <User className="size-3.5 text-white/35 shrink-0" />
          <span className="text-xs text-white/55">{inspection.customer}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="size-3.5 text-white/35 shrink-0" />
          <span className="text-xs text-white/40 font-mono">{inspection.workOrder}</span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-[10px] text-white/35">{inspection.template}</span>
        </div>
      </div>

      {/* Progress bar + items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">
            {inspection.checkedItems}/{inspection.totalItems} items checked
          </span>
          <span className="text-xs font-semibold text-white/70">{progressPct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Health indicators */}
      <div className="flex items-center gap-2">
        <Shield className="size-3.5 text-white/30 shrink-0" />
        <div className="flex items-center gap-1.5 flex-wrap">
          {inspection.health.good > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="size-3" />
              {inspection.health.good} Good
            </span>
          )}
          {inspection.health.monitor > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-500/12 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <AlertTriangle className="size-3" />
              {inspection.health.monitor} Monitor
            </span>
          )}
          {inspection.health.attention > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-red-500/12 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
              <XCircle className="size-3" />
              {inspection.health.attention} Attention
            </span>
          )}
          {inspection.health.good === 0 &&
            inspection.health.monitor === 0 &&
            inspection.health.attention === 0 && (
              <span className="text-[11px] text-white/25">No items rated yet</span>
            )}
        </div>
      </div>

      {/* Photos badge + date */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
          <Camera className="size-3.5" />
          {inspection.photos === 0 ? "No photos" : `${inspection.photos} photos`}
        </span>
        <span className="text-[11px] text-white/30">{inspection.date}</span>
      </div>

      {/* Divider */}
      <div className="border-t border-white/6" />

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 h-8 text-xs text-white/60 hover:text-white hover:bg-white/6 border border-white/8 gap-1.5"
        >
          <Eye className="size-3.5" />
          View Report
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="flex-1 h-8 text-xs text-white/60 hover:text-white hover:bg-white/6 border border-white/8 gap-1.5"
          disabled={inspection.status === "In Progress"}
        >
          <Share2 className="size-3.5" />
          Share
        </Button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterTab = "All" | "In Progress" | "Completed" | "Sent to Customer" | "Approved";

const FILTER_TABS: FilterTab[] = [
  "All",
  "In Progress",
  "Completed",
  "Sent to Customer",
  "Approved",
];

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>(initialInspections);
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleNewInspection(inspection: Inspection) {
    setInspections((prev) => [inspection, ...prev]);
  }

  const filtered =
    activeTab === "All"
      ? inspections
      : inspections.filter((i) => i.status === activeTab);

  const countFor = (tab: FilterTab) =>
    tab === "All"
      ? inspections.length
      : inspections.filter((i) => i.status === tab).length;

  // Stat computations
  const totalCount = inspections.length;
  const inProgressCount = inspections.filter((i) => i.status === "In Progress").length;
  const completedTodayCount = inspections.filter(
    (i) => i.status === "Completed" && i.date === "Jul 8, 2026"
  ).length;
  const awaitingApprovalCount = inspections.filter(
    (i) => i.status === "Sent to Customer"
  ).length;

  const stats = [
    {
      label: "Total Inspections",
      value: totalCount,
      icon: ClipboardCheck,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "In Progress",
      value: inProgressCount,
      icon: Shield,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Completed Today",
      value: completedTodayCount,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Awaiting Approval",
      value: awaitingApprovalCount,
      icon: AlertTriangle,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Digital Vehicle Inspections"
        subtitle={`${inProgressCount} inspection${inProgressCount !== 1 ? "s" : ""} in progress`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button
                  size="sm"
                  className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"
                >
                  <Plus className="size-3.5" />
                  New Inspection
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]"
              showCloseButton={false}
            >
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">
                  New Inspection
                </SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">
                  Start a digital vehicle inspection for a work order.
                </p>
              </SheetHeader>
              <NewInspectionForm
                onSubmit={handleNewInspection}
                onClose={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}>
                <s.icon className={`size-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/50 font-medium truncate">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary/20 text-primary border border-primary/25"
                  : "text-white/45 hover:text-white/70 border border-transparent hover:border-white/8 hover:bg-white/4"
              }`}
            >
              {tab}
              <span
                className={`ml-1.5 text-[10px] ${
                  activeTab === tab ? "text-primary/60" : "text-white/25"
                }`}
              >
                ({countFor(tab)})
              </span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <ClipboardCheck className="size-10 mb-3 opacity-40" />
            <p className="text-sm">No inspections found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((inspection) => (
              <InspectionCard key={inspection.id} inspection={inspection} />
            ))}
          </div>
        )}

        {/* Footer count */}
        {filtered.length > 0 && (
          <p className="text-xs text-white/25 text-center pb-2">
            Showing{" "}
            <span className="text-white/40 font-medium">{filtered.length}</span> of{" "}
            <span className="text-white/40 font-medium">{inspections.length}</span>{" "}
            inspections
          </p>
        )}
      </main>
    </div>
  );
}
