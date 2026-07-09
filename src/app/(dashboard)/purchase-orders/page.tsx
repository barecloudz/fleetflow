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
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type POStatus = "Draft" | "Ordered" | "Partial" | "Received" | "Cancelled";

interface LineItem {
  id: string;
  partNumber: string;
  description: string;
  qty: number;
  unitCost: number;
  received?: number;
}

interface PurchaseOrder {
  id: string;
  vendor: string;
  items: LineItem[];
  total: number;
  orderedDate: string;
  expectedDate: string;
  status: POStatus;
  linkedWO?: string;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPOs: PurchaseOrder[] = [
  {
    id: "PO-2041",
    vendor: "PartsTech",
    status: "Ordered",
    orderedDate: "Jul 6, 2026",
    expectedDate: "Jul 10, 2026",
    linkedWO: "WO-1047",
    notes: "Priority order — brakes needed ASAP for Tesla job.",
    items: [
      { id: "li-1", partNumber: "BRK-PAD-FR-OE", description: "Front Brake Pad Set", qty: 2, unitCost: 42.0, received: 0 },
      { id: "li-2", partNumber: "BRK-ROT-RR-12", description: "Rear Brake Rotor (ea)", qty: 4, unitCost: 65.0, received: 0 },
      { id: "li-3", partNumber: "BRK-FLUID-DOT4", description: "DOT 4 Brake Fluid (qt)", qty: 2, unitCost: 11.5, received: 0 },
    ],
    total: 389.0,
  },
  {
    id: "PO-2040",
    vendor: "NAPA Auto Parts",
    status: "Received",
    orderedDate: "Jun 30, 2026",
    expectedDate: "Jul 3, 2026",
    notes: "Monthly filter restock.",
    items: [
      { id: "li-4", partNumber: "FIL-OIL-UNV", description: "Oil Filter - Universal", qty: 24, unitCost: 8.99, received: 24 },
      { id: "li-5", partNumber: "FIL-AIR-PNL", description: "Air Filter - Panel", qty: 12, unitCost: 14.5, received: 12 },
      { id: "li-6", partNumber: "FIL-CAB-STD", description: "Cabin Air Filter", qty: 12, unitCost: 18.0, received: 12 },
    ],
    total: 607.76,
  },
  {
    id: "PO-2039",
    vendor: "O'Reilly Auto Parts",
    status: "Partial",
    orderedDate: "Jul 1, 2026",
    expectedDate: "Jul 5, 2026",
    linkedWO: "WO-1046",
    notes: "Remaining coolant on backorder — eta Jul 12.",
    items: [
      { id: "li-7", partNumber: "ENG-BELT-6RB", description: "Serpentine Belt - 6-rib", qty: 3, unitCost: 28.75, received: 3 },
      { id: "li-8", partNumber: "FLD-COOL-GAL", description: "Coolant / Antifreeze (gal)", qty: 6, unitCost: 16.99, received: 2 },
      { id: "li-9", partNumber: "THM-STAT-195", description: "Thermostat 195°F", qty: 2, unitCost: 22.0, received: 2 },
    ],
    total: 232.19,
  },
  {
    id: "PO-2038",
    vendor: "AutoZone Pro",
    status: "Received",
    orderedDate: "Jun 25, 2026",
    expectedDate: "Jun 28, 2026",
    items: [
      { id: "li-10", partNumber: "OIL-5W30-QT", description: "Engine Oil 5W-30 (1 qt)", qty: 48, unitCost: 7.49, received: 48 },
      { id: "li-11", partNumber: "FLD-PSF-QT", description: "Power Steering Fluid (qt)", qty: 12, unitCost: 9.25, received: 12 },
    ],
    total: 470.52,
  },
  {
    id: "PO-2037",
    vendor: "Worldpac",
    status: "Ordered",
    orderedDate: "Jul 7, 2026",
    expectedDate: "Jul 14, 2026",
    linkedWO: "WO-1040",
    notes: "BMW parts — confirm part numbers with tech before receiving.",
    items: [
      { id: "li-12", partNumber: "ELC-ALT-140R", description: "Alternator - Reman 140A", qty: 1, unitCost: 189.0, received: 0 },
      { id: "li-13", partNumber: "ENG-PLUG-IRD", description: "Spark Plug - Iridium", qty: 8, unitCost: 11.0, received: 0 },
      { id: "li-14", partNumber: "ELC-BAT-700", description: "12V Automotive Battery 700CCA", qty: 1, unitCost: 135.0, received: 0 },
    ],
    total: 412.0,
  },
  {
    id: "PO-2036",
    vendor: "Nexpart",
    status: "Draft",
    orderedDate: "Jul 8, 2026",
    expectedDate: "Jul 15, 2026",
    notes: "Pending manager approval.",
    items: [
      { id: "li-15", partNumber: "SUS-STRUT-FR", description: "Front Strut Assembly", qty: 2, unitCost: 142.0, received: 0 },
      { id: "li-16", partNumber: "SUS-LINK-FR", description: "Front Sway Bar Link", qty: 2, unitCost: 38.5, received: 0 },
    ],
    total: 361.0,
  },
  {
    id: "PO-2035",
    vendor: "PartsTech",
    status: "Cancelled",
    orderedDate: "Jun 20, 2026",
    expectedDate: "Jun 24, 2026",
    notes: "Customer declined repair estimate after parts ordered. Voided.",
    items: [
      { id: "li-17", partNumber: "ENG-TBK-KIT", description: "Timing Belt Kit", qty: 1, unitCost: 210.0, received: 0 },
      { id: "li-18", partNumber: "ENG-WP-STD", description: "Water Pump", qty: 1, unitCost: 95.0, received: 0 },
    ],
    total: 305.0,
  },
  {
    id: "PO-2034",
    vendor: "NAPA Auto Parts",
    status: "Received",
    orderedDate: "Jun 18, 2026",
    expectedDate: "Jun 21, 2026",
    items: [
      { id: "li-19", partNumber: "TIR-225-65R17", description: "All-Season Tire 225/65R17", qty: 4, unitCost: 118.0, received: 4 },
    ],
    total: 472.0,
  },
];

const VENDORS = [
  "PartsTech",
  "Nexpart",
  "NAPA Auto Parts",
  "O'Reilly Auto Parts",
  "AutoZone Pro",
  "Worldpac",
];

const WORK_ORDERS = [
  "WO-1048", "WO-1047", "WO-1046", "WO-1045",
  "WO-1044", "WO-1043", "WO-1042", "WO-1041",
  "WO-1040", "WO-1039",
];

// ─── Status Config ─────────────────────────────────────────────────────────────

const statusStyles: Record<POStatus, string> = {
  Draft:     "bg-slate-500/15 text-slate-300 border-slate-500/20",
  Ordered:   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Partial:   "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Received:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Cancelled: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const statusIcons: Record<POStatus, React.ElementType> = {
  Draft:     ShoppingCart,
  Ordered:   Truck,
  Partial:   Package,
  Received:  CheckCircle,
  Cancelled: XCircle,
};

function StatusBadge({ status }: { status: POStatus }) {
  return (
    <Badge className={`text-[10px] font-medium border px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function lineItemTotal(items: LineItem[]) {
  return items.reduce((sum, i) => sum + i.qty * i.unitCost, 0);
}

// ─── New PO Sheet ─────────────────────────────────────────────────────────────

interface NewLineItemRow {
  id: string;
  partNumber: string;
  description: string;
  qty: string;
  unitCost: string;
}

function newRow(): NewLineItemRow {
  return { id: crypto.randomUUID(), partNumber: "", description: "", qty: "1", unitCost: "" };
}

interface NewPOFormProps {
  onSubmit: (po: PurchaseOrder) => void;
  onClose: () => void;
}

function NewPOForm({ onSubmit, onClose }: NewPOFormProps) {
  const [vendor, setVendor] = useState("");
  const [linkedWO, setLinkedWO] = useState("none");
  const [notes, setNotes] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [rows, setRows] = useState<NewLineItemRow[]>([newRow()]);

  function updateRow(id: string, field: keyof NewLineItemRow, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vendor) return;

    const items: LineItem[] = rows
      .filter((r) => r.description.trim())
      .map((r) => ({
        id: r.id,
        partNumber: r.partNumber.trim() || "—",
        description: r.description.trim(),
        qty: parseInt(r.qty) || 1,
        unitCost: parseFloat(r.unitCost) || 0,
        received: 0,
      }));

    const total = items.reduce((sum, i) => sum + i.qty * i.unitCost, 0);
    const nextId = `PO-${2042 + Math.floor(Math.random() * 10)}`;

    onSubmit({
      id: nextId,
      vendor,
      items,
      total,
      orderedDate: "Jul 8, 2026",
      expectedDate: expectedDate || "TBD",
      status: "Draft",
      linkedWO: linkedWO !== "none" ? linkedWO : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  const formTotal = rows.reduce(
    (sum, r) => sum + (parseInt(r.qty) || 0) * (parseFloat(r.unitCost) || 0),
    0
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Vendor */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Vendor</Label>
          <Select value={vendor} onValueChange={(v) => v && setVendor(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Select vendor…" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
              {VENDORS.map((v) => (
                <SelectItem key={v} value={v} className="text-white focus:bg-white/10">{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Linked Work Order */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Linked Work Order <span className="normal-case opacity-50">(optional)</span>
          </Label>
          <Select value={linkedWO} onValueChange={(v) => v && setLinkedWO(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Link to work order…" />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.18_0.025_255)] border-white/10">
              <SelectItem value="none" className="text-white/40 focus:bg-white/10">None</SelectItem>
              {WORK_ORDERS.map((wo) => (
                <SelectItem key={wo} value={wo} className="text-white focus:bg-white/10">{wo}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Expected Delivery Date */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Expected Delivery Date</Label>
          <Input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-9 [color-scheme:dark]"
          />
        </div>

        {/* Line Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Line Items</Label>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, newRow()])}
              className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <Plus className="size-3" /> Add Row
            </button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_2fr_52px_80px_28px] gap-1.5 px-1">
            <span className="text-[10px] text-white/30 uppercase tracking-wide">Part #</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wide">Description</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wide">Qty</span>
            <span className="text-[10px] text-white/30 uppercase tracking-wide">Unit $</span>
            <span />
          </div>

          <div className="space-y-1.5">
            {rows.map((row) => (
              <div key={row.id} className="grid grid-cols-[1fr_2fr_52px_80px_28px] gap-1.5 items-center">
                <Input
                  value={row.partNumber}
                  onChange={(e) => updateRow(row.id, "partNumber", e.target.value)}
                  placeholder="SKU"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-8 text-xs font-mono"
                />
                <Input
                  value={row.description}
                  onChange={(e) => updateRow(row.id, "description", e.target.value)}
                  placeholder="Description"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-8 text-xs"
                />
                <Input
                  type="number"
                  min="1"
                  value={row.qty}
                  onChange={(e) => updateRow(row.id, "qty", e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-8 text-xs text-center"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={row.unitCost}
                  onChange={(e) => updateRow(row.id, "unitCost", e.target.value)}
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-8 text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  className="flex items-center justify-center size-7 rounded text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-20 disabled:pointer-events-none"
                  aria-label="Remove row"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Running total */}
          {formTotal > 0 && (
            <div className="flex justify-end pt-1">
              <span className="text-xs text-white/40">
                Est. Total:{" "}
                <span className="text-white font-semibold">{formatCurrency(formTotal)}</span>
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">Notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes about this order…"
            rows={3}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <SheetFooter className="border-t border-white/8 p-4 gap-2">
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
          disabled={!vendor}
          className="flex-1 gradient-blue glow-blue-sm text-white font-medium"
        >
          Create PO
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Expanded Line Items ───────────────────────────────────────────────────────

function ExpandedLineItems({ po }: { po: PurchaseOrder }) {
  return (
    <tr>
      <td colSpan={8} className="px-0 py-0">
        <div className="bg-white/[0.02] border-t border-b border-white/5 px-8 py-3">
          <p className="text-[10px] font-semibold text-white/30 uppercase tracking-wider mb-2">Line Items</p>
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left pb-1.5 text-[10px] text-white/25 font-medium pr-4">Part #</th>
                <th className="text-left pb-1.5 text-[10px] text-white/25 font-medium pr-4">Description</th>
                <th className="text-right pb-1.5 text-[10px] text-white/25 font-medium pr-4">Qty</th>
                {po.status === "Partial" && (
                  <th className="text-right pb-1.5 text-[10px] text-white/25 font-medium pr-4">Received</th>
                )}
                <th className="text-right pb-1.5 text-[10px] text-white/25 font-medium pr-4">Unit Cost</th>
                <th className="text-right pb-1.5 text-[10px] text-white/25 font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {po.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-1.5 pr-4 font-mono text-white/40 whitespace-nowrap">{item.partNumber}</td>
                  <td className="py-1.5 pr-4 text-white/70">{item.description}</td>
                  <td className="py-1.5 pr-4 text-right text-white/60 tabular-nums">{item.qty}</td>
                  {po.status === "Partial" && (
                    <td className="py-1.5 pr-4 text-right tabular-nums">
                      <span className={item.received === item.qty ? "text-emerald-400" : "text-amber-400"}>
                        {item.received ?? 0}
                      </span>
                    </td>
                  )}
                  <td className="py-1.5 pr-4 text-right text-white/60 tabular-nums">{formatCurrency(item.unitCost)}</td>
                  <td className="py-1.5 text-right text-white tabular-nums font-medium">{formatCurrency(item.qty * item.unitCost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/8">
                <td colSpan={po.status === "Partial" ? 5 : 4} className="pt-2 text-right text-white/40 text-[10px] font-medium uppercase tracking-wide pr-4">
                  Total
                </td>
                <td className="pt-2 text-right font-bold text-white tabular-nums">
                  {formatCurrency(lineItemTotal(po.items))}
                </td>
              </tr>
            </tfoot>
          </table>
          {po.notes && (
            <p className="mt-3 text-[11px] text-white/40 italic border-t border-white/5 pt-2">
              Note: {po.notes}
            </p>
          )}
        </div>
      </td>
    </tr>
  );
}

// ─── Tab Keys ─────────────────────────────────────────────────────────────────

const TAB_FILTER: Record<string, POStatus | "all"> = {
  all:       "all",
  draft:     "Draft",
  ordered:   "Ordered",
  partial:   "Partial",
  received:  "Received",
  cancelled: "Cancelled",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PurchaseOrdersPage() {
  const [pos, setPos] = useState<PurchaseOrder[]>(mockPOs);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleNewPO(po: PurchaseOrder) {
    setPos((prev) => [po, ...prev]);
  }

  function handleMarkReceived(id: string) {
    setPos((prev) =>
      prev.map((po) =>
        po.id === id
          ? { ...po, status: "Received" as POStatus, items: po.items.map((i) => ({ ...i, received: i.qty })) }
          : po
      )
    );
  }

  function handleCancel(id: string) {
    setPos((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: "Cancelled" as POStatus } : po))
    );
  }

  function handleSendOrder(id: string) {
    setPos((prev) =>
      prev.map((po) => (po.id === id && po.status === "Draft" ? { ...po, status: "Ordered" as POStatus } : po))
    );
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const filtered = pos.filter((po) => {
    const statusMatch = activeTab === "all" || po.status === TAB_FILTER[activeTab];
    const q = search.toLowerCase();
    const searchMatch =
      !q ||
      po.id.toLowerCase().includes(q) ||
      po.vendor.toLowerCase().includes(q) ||
      (po.linkedWO ?? "").toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  const countFor = (tab: string) => {
    if (tab === "all") return pos.length;
    return pos.filter((po) => po.status === TAB_FILTER[tab]).length;
  };

  // Stats
  const pendingPOs = pos.filter((po) => po.status === "Ordered" || po.status === "Partial" || po.status === "Draft");
  const thisMonthReceived = pos.filter((po) => po.status === "Received");
  const thisMonthSpent = thisMonthReceived.reduce((sum, po) => sum + po.total, 0);

  const stats = [
    {
      label: "Total POs",
      value: String(pos.length),
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pending / Open",
      value: String(pendingPOs.length),
      icon: Truck,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Received This Month",
      value: String(thisMonthReceived.length),
      icon: Package,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Spent This Month",
      value: formatCurrency(thisMonthSpent),
      icon: DollarSign,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Purchase Orders"
        subtitle={`${pendingPOs.length} pending order${pendingPOs.length !== 1 ? "s" : ""}`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5">
                  <Plus className="size-3.5" />
                  New PO
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]"
              showCloseButton={false}
            >
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">New Purchase Order</SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">Create a parts order for a vendor.</p>
              </SheetHeader>
              <NewPOForm onSubmit={handleNewPO} onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className={`${s.bg} p-2.5 rounded-xl shrink-0`}>
                <s.icon className={`size-5 ${s.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-white/50 font-medium truncate">{s.label}</p>
                <p className="text-xl font-bold text-white truncate">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-white/5 border border-white/8 h-9 p-1 gap-0.5">
              {[
                { key: "all",       label: "All" },
                { key: "draft",     label: "Draft" },
                { key: "ordered",   label: "Ordered" },
                { key: "partial",   label: "Partial" },
                { key: "received",  label: "Received" },
                { key: "cancelled", label: "Cancelled" },
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
            {["all", "draft", "ordered", "partial", "received", "cancelled"].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0" />
            ))}
          </Tabs>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PO #, vendor…"
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/40 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">PO #</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Vendor</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Items</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Ordered</th>
                  <th className="hidden sm:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> Expected</span>
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/4">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-14 text-center text-white/30 text-sm">
                      <ShoppingCart className="size-8 mx-auto mb-2 opacity-25" />
                      No purchase orders match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((po) => {
                    const isExpanded = expandedId === po.id;
                    return (
                      <>
                        <tr
                          key={po.id}
                          onClick={() => toggleExpand(po.id)}
                          className="hover:bg-white/3 transition-colors group cursor-pointer"
                        >
                          {/* PO # */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-primary/70 font-semibold">{po.id}</span>
                              {po.linkedWO && (
                                <span className="hidden md:inline-flex items-center gap-0.5 text-[10px] text-white/30 font-normal">
                                  <ExternalLink className="size-2.5" />
                                  {po.linkedWO}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Vendor */}
                          <td className="px-4 py-3.5">
                            <span className="text-white font-medium">{po.vendor}</span>
                          </td>

                          {/* Items count */}
                          <td className="hidden sm:table-cell px-4 py-3.5 text-white/50 tabular-nums whitespace-nowrap">
                            {po.items.length} {po.items.length === 1 ? "item" : "items"}
                          </td>

                          {/* Total */}
                          <td className="px-4 py-3.5 text-right font-semibold text-white tabular-nums whitespace-nowrap">
                            {formatCurrency(po.total)}
                          </td>

                          {/* Ordered Date */}
                          <td className="px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">
                            {po.orderedDate}
                          </td>

                          {/* Expected Date */}
                          <td className="hidden sm:table-cell px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">
                            {po.expectedDate}
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <StatusBadge status={po.status} />
                          </td>

                          {/* Actions */}
                          <td
                            className="px-4 py-3.5 text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-white/20 group-hover:text-white/40 transition-colors">
                                {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  render={
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="size-7 text-white/30 hover:text-white hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  }
                                />
                                <DropdownMenuContent align="end" side="bottom" className="bg-[oklch(0.18_0.025_255)] border-white/10 text-white min-w-[170px]">
                                  <DropdownMenuItem
                                    className="focus:bg-white/8 cursor-pointer text-sm"
                                    onClick={() => handleSendOrder(po.id)}
                                    disabled={po.status !== "Draft"}
                                  >
                                    <Truck className="size-3.5" />
                                    Send Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="focus:bg-white/8 cursor-pointer text-sm"
                                    onClick={() => handleMarkReceived(po.id)}
                                    disabled={po.status === "Received" || po.status === "Cancelled" || po.status === "Draft"}
                                  >
                                    <CheckCircle className="size-3.5" />
                                    Mark Received
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-white/8" />
                                  <DropdownMenuItem
                                    className="focus:bg-rose-500/15 cursor-pointer text-sm text-rose-400 focus:text-rose-400"
                                    onClick={() => handleCancel(po.id)}
                                    disabled={po.status === "Cancelled" || po.status === "Received"}
                                  >
                                    <XCircle className="size-3.5" />
                                    Cancel PO
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded row */}
                        {isExpanded && <ExpandedLineItems key={`${po.id}-expanded`} po={po} />}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-white/30">
              Showing <span className="text-white/50 font-medium">{filtered.length}</span> of{" "}
              <span className="text-white/50 font-medium">{pos.length}</span> purchase orders
            </p>
            <p className="text-xs text-white/30">
              Total:{" "}
              <span className="text-white/60 font-medium">
                {formatCurrency(filtered.reduce((s, p) => s + p.total, 0))}
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
