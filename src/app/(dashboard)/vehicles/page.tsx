"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Car,
  Wrench,
  AlertCircle,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockCustomers = [
  "Marcus Reid",
  "Sarah Chen",
  "David Torres",
  "Priya Nair",
  "Tom Walsh",
  "Angela Brooks",
  "Kevin Park",
  "Lisa Monroe",
  "James Holloway",
  "Nina Patel",
];

const mockVehicles = [
  {
    id: "V-001",
    year: 2019,
    make: "Ford",
    model: "F-150",
    vin: "1FTEW1EP5KFA12345",
    owner: "Marcus Reid",
    mileage: 68_420,
    lastService: "2026-05-14",
    nextServiceDue: "2026-07-01",
    status: "In Shop",
    color: "Oxford White",
  },
  {
    id: "V-002",
    year: 2021,
    make: "Tesla",
    model: "Model 3",
    vin: "5YJ3E1EA2MF098765",
    owner: "Sarah Chen",
    mileage: 22_100,
    lastService: "2026-04-03",
    nextServiceDue: "2026-10-03",
    status: "Active",
    color: "Midnight Silver",
  },
  {
    id: "V-003",
    year: 2018,
    make: "Chevy",
    model: "Tahoe",
    vin: "1GNSCBKC1JR234567",
    owner: "David Torres",
    mileage: 94_300,
    lastService: "2026-06-20",
    nextServiceDue: "2026-06-25",
    status: "Active",
    color: "Black",
  },
  {
    id: "V-004",
    year: 2022,
    make: "Honda",
    model: "Civic",
    vin: "2HGFE2F58NH345678",
    owner: "Priya Nair",
    mileage: 18_760,
    lastService: "2026-05-30",
    nextServiceDue: "2026-11-30",
    status: "Active",
    color: "Sonic Gray Pearl",
  },
  {
    id: "V-005",
    year: 2017,
    make: "RAM",
    model: "1500",
    vin: "1C6RR7LT4HS456789",
    owner: "Tom Walsh",
    mileage: 112_500,
    lastService: "2026-03-11",
    nextServiceDue: "2026-03-11",
    status: "In Shop",
    color: "Bright Silver",
  },
  {
    id: "V-006",
    year: 2020,
    make: "Jeep",
    model: "Wrangler",
    vin: "1C4HJXEN7LW567890",
    owner: "Angela Brooks",
    mileage: 41_880,
    lastService: "2026-06-01",
    nextServiceDue: "2026-12-01",
    status: "Active",
    color: "Firecracker Red",
  },
  {
    id: "V-007",
    year: 2023,
    make: "BMW",
    model: "X5",
    vin: "5UXCR6C07P9678901",
    owner: "Kevin Park",
    mileage: 9_200,
    lastService: "2026-01-18",
    nextServiceDue: "2027-01-18",
    status: "Active",
    color: "Alpine White",
  },
  {
    id: "V-008",
    year: 2016,
    make: "Toyota",
    model: "Camry",
    vin: "4T1BF1FK7GU789012",
    owner: "Lisa Monroe",
    mileage: 137_600,
    lastService: "2026-04-22",
    nextServiceDue: "2026-10-22",
    status: "Inactive",
    color: "Celestial Silver",
  },
  {
    id: "V-009",
    year: 2024,
    make: "Ford",
    model: "Mustang",
    vin: "1FA6P8CF0R5890123",
    owner: "James Holloway",
    mileage: 3_450,
    lastService: "2026-06-30",
    nextServiceDue: "2026-12-30",
    status: "Active",
    color: "Grabber Blue",
  },
  {
    id: "V-010",
    year: 2019,
    make: "Chevy",
    model: "Silverado",
    vin: "3GCUYDED0KG901234",
    owner: "Nina Patel",
    mileage: 78_200,
    lastService: "2026-05-05",
    nextServiceDue: "2026-05-10",
    status: "In Shop",
    color: "Satin Steel Gray",
  },
  {
    id: "V-011",
    year: 2021,
    make: "Toyota",
    model: "Tacoma",
    vin: "3TMDZ5BN3MM012345",
    owner: "Marcus Reid",
    mileage: 34_700,
    lastService: "2026-02-28",
    nextServiceDue: "2026-08-28",
    status: "Active",
    color: "Army Green",
  },
  {
    id: "V-012",
    year: 2015,
    make: "Honda",
    model: "Pilot",
    vin: "5FNYF6H59FB123456",
    owner: "Tom Walsh",
    mileage: 158_900,
    lastService: "2026-06-10",
    nextServiceDue: "2026-12-10",
    status: "Inactive",
    color: "Modern Steel",
  },
];

const TODAY = new Date("2026-07-08");

function isOverdue(dateStr: string) {
  return new Date(dateStr) < TODAY;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMileage(n: number) {
  return n.toLocaleString();
}

function truncateVin(vin: string) {
  return `${vin.slice(0, 8)}…${vin.slice(-4)}`;
}

const statusStyles: Record<string, string> = {
  "In Shop": "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Inactive: "bg-white/8 text-white/40 border-white/10",
};

const makes = ["Ford", "Chevy", "Toyota", "Honda", "Tesla", "RAM", "Jeep", "BMW"];

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "vehicle" | "mileage" | "lastService" | "nextServiceDue";
type SortDir = "asc" | "desc" | null;

// ─── Add Vehicle Sheet ────────────────────────────────────────────────────────

function AddVehicleSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] bg-[oklch(0.13_0.025_255)] border-white/8 text-white overflow-y-auto"
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-white text-lg font-semibold">Add Vehicle</SheetTitle>
          <SheetDescription className="text-white/40 text-sm">
            Register a new vehicle in the fleet.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Owner */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Owner</Label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                <SelectValue placeholder="Select customer…" />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
                {mockCustomers.map((c) => (
                  <SelectItem key={c} value={c} className="text-white focus:bg-white/10">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year / Make / Model row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Year</Label>
              <Input
                placeholder="2024"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Make</Label>
              <Select>
                <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
                  {makes.map((m) => (
                    <SelectItem key={m} value={m} className="text-white focus:bg-white/10">
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Model</Label>
              <Input
                placeholder="F-150"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
              />
            </div>
          </div>

          {/* Trim */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Trim</Label>
            <Input
              placeholder="XLT SuperCrew"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
            />
          </div>

          {/* VIN */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">VIN</Label>
            <Input
              placeholder="17-character VIN"
              maxLength={17}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 font-mono tracking-wider"
            />
          </div>

          {/* Color / Mileage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Color</Label>
              <Input
                placeholder="Oxford White"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Mileage</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
              />
            </div>
          </div>

          {/* License Plate */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">License Plate</Label>
            <Input
              placeholder="ABC-1234"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 uppercase tracking-widest"
            />
          </div>
        </div>

        <SheetFooter className="mt-8 gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
          >
            Cancel
          </Button>
          <Button className="flex-1 gradient-blue glow-blue-sm text-white font-medium">
            Save Vehicle
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="size-3 text-white/20" />;
  if (sortDir === "asc") return <ChevronUp className="size-3 text-primary" />;
  return <ChevronDown className="size-3 text-primary" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [makeFilter, setMakeFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = mockVehicles
    .filter((v) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q) ||
        v.owner.toLowerCase().includes(q) ||
        v.vin.toLowerCase().includes(q);
      const matchesMake = makeFilter === "all" || v.make === makeFilter;
      return matchesSearch && matchesMake;
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      let va: string | number, vb: string | number;
      if (sortKey === "vehicle") {
        va = `${a.year} ${a.make} ${a.model}`;
        vb = `${b.year} ${b.make} ${b.model}`;
      } else if (sortKey === "mileage") {
        va = a.mileage; vb = b.mileage;
      } else if (sortKey === "lastService") {
        va = a.lastService; vb = b.lastService;
      } else {
        va = a.nextServiceDue; vb = b.nextServiceDue;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const inShopCount = mockVehicles.filter((v) => v.status === "In Shop").length;
  const overdueCount = mockVehicles.filter((v) => isOverdue(v.nextServiceDue)).length;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Vehicles"
        actions={
          <Button
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"
          >
            <Plus className="size-3.5" />
            Add Vehicle
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Vehicles",
              value: "312",
              icon: Car,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "In Shop",
              value: String(inShopCount),
              icon: Wrench,
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              label: "Due for Service",
              value: String(overdueCount),
              icon: AlertCircle,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
          ].map((s) => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${s.bg} p-3 rounded-xl`}>
                  <s.icon className={`size-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-white/50 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input
              placeholder="Search vehicles, owner, VIN…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9 focus-visible:ring-primary/40"
            />
          </div>
          <Select value={makeFilter} onValueChange={(v) => v && setMakeFilter(v)}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white h-9">
              <SelectValue placeholder="All Makes" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
              <SelectItem value="all" className="text-white focus:bg-white/10">
                All Makes
              </SelectItem>
              {makes.map((m) => (
                <SelectItem key={m} value={m} className="text-white focus:bg-white/10">
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ── Table ── */}
        <Card className="glass-card border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8">
                  {(
                    [
                      { key: "vehicle", label: "Vehicle" },
                      { key: null, label: "VIN" },
                      { key: null, label: "Owner" },
                      { key: "mileage", label: "Mileage" },
                      { key: "lastService", label: "Last Service" },
                      { key: "nextServiceDue", label: "Next Service" },
                      { key: null, label: "Status" },
                      { key: null, label: "" },
                    ] as Array<{ key: SortKey | null; label: string }>
                  ).map((col) => (
                    <th
                      key={col.label || "actions"}
                      onClick={() => col.key && handleSort(col.key)}
                      className={`px-4 py-3 text-left text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap select-none ${
                        col.key ? "cursor-pointer hover:text-white/70 transition-colors" : ""
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {col.key && (
                          <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-white/30 text-sm">
                      No vehicles match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => {
                    const overdue = isOverdue(v.nextServiceDue);
                    return (
                      <tr
                        key={v.id}
                        className="hover:bg-white/3 transition-colors group cursor-pointer"
                      >
                        {/* Vehicle */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-medium text-white">
                            {v.year} {v.make} {v.model}
                          </span>
                          <span className="block text-[11px] text-white/35">{v.color}</span>
                        </td>

                        {/* VIN */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className="font-mono text-[11px] text-white/50 tracking-wider"
                            title={v.vin}
                          >
                            {truncateVin(v.vin)}
                          </span>
                        </td>

                        {/* Owner */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-primary hover:text-primary/80 transition-colors text-sm cursor-pointer">
                            {v.owner}
                          </span>
                        </td>

                        {/* Mileage */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-white/70 tabular-nums">
                          {formatMileage(v.mileage)} mi
                        </td>

                        {/* Last Service */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-white/50 text-[13px]">
                          {formatDate(v.lastService)}
                        </td>

                        {/* Next Service */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Badge
                            className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${
                              overdue
                                ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                                : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {formatDate(v.nextServiceDue)}
                          </Badge>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Badge
                            className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[v.status]}`}
                          >
                            {v.status}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-all"><MoreHorizontal className="size-4" /></Button>} />
                            <DropdownMenuContent
                              align="end"
                              className="bg-[oklch(0.18_0.025_255)] border-white/10 text-white min-w-[160px]"
                            >
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm">
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm">
                                New Work Order
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm">
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm text-red-400 focus:text-red-400">
                                Archive
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer row count */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-white/30">
              Showing {filtered.length} of {mockVehicles.length} vehicles
            </p>
            <p className="text-[11px] text-white/30">Page 1 of 1</p>
          </div>
        </Card>
      </main>

      <AddVehicleSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
