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
  Package,
  AlertTriangle,
  XCircle,
  DollarSign,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ArrowRight,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

type Category =
  | "Engine"
  | "Brakes"
  | "Tires"
  | "Electrical"
  | "Filters"
  | "Fluids"
  | "Body";

interface Part {
  id: string;
  name: string;
  partNumber: string;
  category: Category;
  inStock: number;
  reorderPoint: number;
  unitCost: number;
  supplier: string;
}

const mockParts: Part[] = [
  {
    id: "P-001",
    name: "Engine Oil 5W-30 (1 qt)",
    partNumber: "OIL-5W30-QT",
    category: "Fluids",
    inStock: 3,
    reorderPoint: 24,
    unitCost: 7.49,
    supplier: "AutoZone Pro",
  },
  {
    id: "P-002",
    name: "Oil Filter - Universal",
    partNumber: "FIL-OIL-UNV",
    category: "Filters",
    inStock: 18,
    reorderPoint: 20,
    unitCost: 8.99,
    supplier: "NAPA Wholesale",
  },
  {
    id: "P-003",
    name: "Front Brake Pad Set",
    partNumber: "BRK-PAD-FR-OE",
    category: "Brakes",
    inStock: 7,
    reorderPoint: 8,
    unitCost: 42.0,
    supplier: "Motorcraft Direct",
  },
  {
    id: "P-004",
    name: "Rear Brake Rotor (ea)",
    partNumber: "BRK-ROT-RR-12",
    category: "Brakes",
    inStock: 4,
    reorderPoint: 4,
    unitCost: 65.0,
    supplier: "Motorcraft Direct",
  },
  {
    id: "P-005",
    name: "Air Filter - Panel",
    partNumber: "FIL-AIR-PNL",
    category: "Filters",
    inStock: 22,
    reorderPoint: 15,
    unitCost: 14.5,
    supplier: "NAPA Wholesale",
  },
  {
    id: "P-006",
    name: "Cabin Air Filter",
    partNumber: "FIL-CAB-STD",
    category: "Filters",
    inStock: 0,
    reorderPoint: 10,
    unitCost: 18.0,
    supplier: "NAPA Wholesale",
  },
  {
    id: "P-007",
    name: "Serpentine Belt - 6-rib",
    partNumber: "ENG-BELT-6RB",
    category: "Engine",
    inStock: 5,
    reorderPoint: 6,
    unitCost: 28.75,
    supplier: "Gates Automotive",
  },
  {
    id: "P-008",
    name: "Spark Plug - Iridium",
    partNumber: "ENG-PLUG-IRD",
    category: "Engine",
    inStock: 32,
    reorderPoint: 20,
    unitCost: 11.0,
    supplier: "NGK Direct",
  },
  {
    id: "P-009",
    name: "Coolant / Antifreeze (gal)",
    partNumber: "FLD-COOL-GAL",
    category: "Fluids",
    inStock: 9,
    reorderPoint: 12,
    unitCost: 16.99,
    supplier: "AutoZone Pro",
  },
  {
    id: "P-010",
    name: "Transmission Fluid ATF+4",
    partNumber: "FLD-ATF-QT",
    category: "Fluids",
    inStock: 0,
    reorderPoint: 8,
    unitCost: 12.5,
    supplier: "Mopar Supply",
  },
  {
    id: "P-011",
    name: 'All-Season Tire 225/65R17',
    partNumber: "TIR-225-65R17",
    category: "Tires",
    inStock: 8,
    reorderPoint: 4,
    unitCost: 118.0,
    supplier: "Tire Rack Pro",
  },
  {
    id: "P-012",
    name: "12V Automotive Battery 700CCA",
    partNumber: "ELC-BAT-700",
    category: "Electrical",
    inStock: 3,
    reorderPoint: 4,
    unitCost: 135.0,
    supplier: "Interstate Batteries",
  },
  {
    id: "P-013",
    name: "Alternator - Reman 140A",
    partNumber: "ELC-ALT-140R",
    category: "Electrical",
    inStock: 1,
    reorderPoint: 2,
    unitCost: 189.0,
    supplier: "Remy Power",
  },
  {
    id: "P-014",
    name: "Fender Liner - Front LH",
    partNumber: "BDY-FNL-FRLH",
    category: "Body",
    inStock: 2,
    reorderPoint: 2,
    unitCost: 54.0,
    supplier: "LKQ Auto Parts",
  },
  {
    id: "P-015",
    name: "Power Steering Fluid (qt)",
    partNumber: "FLD-PSF-QT",
    category: "Fluids",
    inStock: 6,
    reorderPoint: 8,
    unitCost: 9.25,
    supplier: "AutoZone Pro",
  },
];

const categories: Category[] = [
  "Engine",
  "Brakes",
  "Tires",
  "Electrical",
  "Filters",
  "Fluids",
  "Body",
];

const categoryStyles: Record<Category, string> = {
  Engine: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Brakes: "bg-red-500/15 text-red-400 border-red-500/20",
  Tires: "bg-slate-500/15 text-slate-300 border-slate-500/20",
  Electrical: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  Filters: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  Fluids: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Body: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

function getStockStatus(part: Part): "OK" | "Low" | "Out of Stock" {
  if (part.inStock === 0) return "Out of Stock";
  if (part.inStock <= part.reorderPoint) return "Low";
  return "OK";
}

const stockStatusStyles: Record<string, string> = {
  OK: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Low: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  "Out of Stock": "bg-red-500/15 text-red-400 border-red-500/20",
};

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "name" | "category" | "inStock" | "unitCost" | "totalValue";
type SortDir = "asc" | "desc" | null;

// ─── Add Part Sheet ───────────────────────────────────────────────────────────

function AddPartSheet({
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
          <SheetTitle className="text-white text-lg font-semibold">Add Part</SheetTitle>
          <SheetDescription className="text-white/40 text-sm">
            Add a new part or supply item to inventory.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5">
          {/* Part Name */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Part Name</Label>
            <Input
              placeholder="e.g. Engine Oil 5W-30 (1 qt)"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
            />
          </div>

          {/* Part Number */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Part Number</Label>
            <Input
              placeholder="e.g. OIL-5W30-QT"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9 font-mono tracking-wider"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Category</Label>
            <Select>
              <SelectTrigger className="bg-white/5 border-white/10 text-white h-9">
                <SelectValue placeholder="Select category…" />
              </SelectTrigger>
              <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="text-white focus:bg-white/10">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit Cost */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Unit Cost ($)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
            />
          </div>

          {/* In Stock / Reorder Point */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">In Stock (qty)</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-white/70 text-xs font-medium">Reorder Point</Label>
              <Input
                type="number"
                placeholder="0"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
              />
            </div>
          </div>

          {/* Supplier */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Supplier</Label>
            <Input
              placeholder="e.g. NAPA Wholesale"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/25 h-9"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-white/70 text-xs font-medium">Notes</Label>
            <textarea
              rows={3}
              placeholder="Additional notes…"
              className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
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
            Save Part
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({
  col,
  sortKey,
  sortDir,
}: {
  col: SortKey;
  sortKey: SortKey | null;
  sortDir: SortDir;
}) {
  if (sortKey !== col) return <ChevronsUpDown className="size-3 text-white/20" />;
  if (sortDir === "asc") return <ChevronUp className="size-3 text-primary" />;
  return <ChevronDown className="size-3 text-primary" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") {
        setSortKey(null);
        setSortDir(null);
      } else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = mockParts
    .filter((p) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.partNumber.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q);
      const matchesCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    })
    .sort((a, b) => {
      if (!sortKey || !sortDir) return 0;
      let va: string | number, vb: string | number;
      if (sortKey === "name") {
        va = a.name; vb = b.name;
      } else if (sortKey === "category") {
        va = a.category; vb = b.category;
      } else if (sortKey === "inStock") {
        va = a.inStock; vb = b.inStock;
      } else if (sortKey === "unitCost") {
        va = a.unitCost; vb = b.unitCost;
      } else {
        va = a.inStock * a.unitCost;
        vb = b.inStock * b.unitCost;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const lowStockCount = mockParts.filter((p) => getStockStatus(p) === "Low").length;
  const outOfStockCount = mockParts.filter((p) => getStockStatus(p) === "Out of Stock").length;
  const totalValue = mockParts.reduce((acc, p) => acc + p.inStock * p.unitCost, 0);

  const columnHeaders: Array<{ key: SortKey | null; label: string }> = [
    { key: "name", label: "Part Name" },
    { key: null, label: "Part Number" },
    { key: "category", label: "Category" },
    { key: "inStock", label: "In Stock" },
    { key: null, label: "Reorder Pt" },
    { key: "unitCost", label: "Unit Cost" },
    { key: "totalValue", label: "Total Value" },
    { key: null, label: "Status" },
    { key: null, label: "" },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Inventory"
        subtitle="Parts & Supplies"
        actions={
          <Button
            size="sm"
            onClick={() => setSheetOpen(true)}
            className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"
          >
            <Plus className="size-3.5" />
            Add Part
          </Button>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* ── Low Stock Warning Banner ── */}
        {!warningDismissed && lowStockCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="size-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300 flex-1">
              <span className="font-semibold">{lowStockCount} items</span> below reorder point
              - review and reorder soon.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 text-xs font-medium"
            >
              Review <ArrowRight className="size-3" />
            </Button>
            <button
              onClick={() => setWarningDismissed(true)}
              className="text-amber-400/60 hover:text-amber-400 transition-colors ml-1 text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Total SKUs",
              value: "486",
              icon: Package,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Low Stock",
              value: String(lowStockCount),
              icon: AlertTriangle,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Out of Stock",
              value: String(outOfStockCount),
              icon: XCircle,
              color: "text-red-400",
              bg: "bg-red-500/10",
            },
            {
              label: "Total Value",
              value: formatCurrency(totalValue),
              icon: DollarSign,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map((s) => (
            <Card key={s.label} className="glass-card border-white/8">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}>
                  <s.icon className={`size-5 ${s.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/50 font-medium truncate">{s.label}</p>
                  <p className="text-xl font-bold text-white truncate">{s.value}</p>
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
              placeholder="Search parts, SKU, supplier…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-9 focus-visible:ring-primary/40"
            />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => v && setCategoryFilter(v)}>
            <SelectTrigger className="w-[190px] bg-white/5 border-white/10 text-white h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
              <SelectItem value="all" className="text-white focus:bg-white/10">
                All Categories
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="text-white focus:bg-white/10">
                  {c}
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
                  {columnHeaders.map((col, i) => (
                    <th
                      key={col.label || `col-${i}`}
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
                    <td colSpan={9} className="px-4 py-10 text-center text-white/30 text-sm">
                      No parts match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((part) => {
                    const status = getStockStatus(part);
                    const totalVal = part.inStock * part.unitCost;
                    const stockLow = part.inStock <= part.reorderPoint;

                    return (
                      <tr
                        key={part.id}
                        className="hover:bg-white/3 transition-colors group cursor-pointer"
                      >
                        {/* Part Name */}
                        <td className="px-4 py-3.5 max-w-[220px]">
                          <span className="font-medium text-white leading-snug line-clamp-1">
                            {part.name}
                          </span>
                          <span className="block text-[11px] text-white/35 mt-0.5">
                            {part.supplier}
                          </span>
                        </td>

                        {/* Part Number */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="font-mono text-[11px] text-white/50 tracking-wider bg-white/5 px-2 py-0.5 rounded">
                            {part.partNumber}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Badge
                            className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${categoryStyles[part.category]}`}
                          >
                            {part.category}
                          </Badge>
                        </td>

                        {/* In Stock */}
                        <td className="px-4 py-3.5 whitespace-nowrap tabular-nums">
                          <span
                            className={`font-semibold ${
                              part.inStock === 0
                                ? "text-red-400"
                                : stockLow
                                ? "text-amber-400"
                                : "text-white"
                            }`}
                          >
                            {part.inStock}
                          </span>
                        </td>

                        {/* Reorder Point */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-white/40 tabular-nums">
                          {part.reorderPoint}
                        </td>

                        {/* Unit Cost */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-white/70 tabular-nums">
                          {formatCurrency(part.unitCost)}
                        </td>

                        {/* Total Value */}
                        <td className="px-4 py-3.5 whitespace-nowrap text-white tabular-nums font-medium">
                          {formatCurrency(totalVal)}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <Badge
                            className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${stockStatusStyles[status]}`}
                          >
                            {status}
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
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm">
                                Reorder
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm">
                                View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/8 cursor-pointer text-sm text-red-400 focus:text-red-400">
                                Delete
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

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-white/30">
              Showing {filtered.length} of {mockParts.length} parts
            </p>
            <p className="text-[11px] text-white/30">Page 1 of 1</p>
          </div>
        </Card>
      </main>

      <AddPartSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
