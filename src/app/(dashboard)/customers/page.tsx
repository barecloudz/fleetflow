"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Plus,
  Search,
  Users,
  UserCheck,
  UserPlus,
  DollarSign,
  Car,
  Mail,
  Phone,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CustomerStatus = "Active" | "Inactive";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicles: number;
  totalSpent: number;
  lastVisit: string;
  status: CustomerStatus;
  notes?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialCustomers: Customer[] = [
  {
    id: "C-001",
    firstName: "Marcus",
    lastName: "Reid",
    email: "marcus.reid@email.com",
    phone: "(512) 883-4421",
    vehicles: 2,
    totalSpent: 3_840,
    lastVisit: "Jul 7, 2026",
    status: "Active",
    notes: "Prefers early morning appointments.",
  },
  {
    id: "C-002",
    firstName: "Sarah",
    lastName: "Chen",
    email: "s.chen@techmail.io",
    phone: "(737) 299-5810",
    vehicles: 2,
    totalSpent: 1_275,
    lastVisit: "Jul 7, 2026",
    status: "Active",
  },
  {
    id: "C-003",
    firstName: "David",
    lastName: "Torres",
    email: "dtorres@outlook.com",
    phone: "(512) 441-7703",
    vehicles: 2,
    totalSpent: 6_120,
    lastVisit: "Jul 6, 2026",
    status: "Active",
    notes: "Fleet account - extended net-30 terms.",
  },
  {
    id: "C-004",
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@gmail.com",
    phone: "(737) 554-0092",
    vehicles: 2,
    totalSpent: 890,
    lastVisit: "Jul 5, 2026",
    status: "Active",
  },
  {
    id: "C-005",
    firstName: "Tom",
    lastName: "Walsh",
    email: "twalsh@construx.com",
    phone: "(512) 678-3301",
    vehicles: 3,
    totalSpent: 4_560,
    lastVisit: "Jul 5, 2026",
    status: "Active",
    notes: "Works nights - call before noon.",
  },
  {
    id: "C-006",
    firstName: "Angela",
    lastName: "Kim",
    email: "angelak@icloud.com",
    phone: "(512) 203-8847",
    vehicles: 2,
    totalSpent: 2_105,
    lastVisit: "Jun 29, 2026",
    status: "Active",
  },
  {
    id: "C-007",
    firstName: "Carlos",
    lastName: "Mendez",
    email: "c.mendez@yahoo.com",
    phone: "(737) 812-6640",
    vehicles: 2,
    totalSpent: 980,
    lastVisit: "May 14, 2026",
    status: "Inactive",
  },
  {
    id: "C-008",
    firstName: "Jennifer",
    lastName: "Okafor",
    email: "jokafor@gmail.com",
    phone: "(512) 390-5517",
    vehicles: 2,
    totalSpent: 3_210,
    lastVisit: "Jul 6, 2026",
    status: "Active",
  },
  {
    id: "C-009",
    firstName: "Ryan",
    lastName: "Patel",
    email: "ryan.patel@proton.me",
    phone: "(512) 774-2209",
    vehicles: 2,
    totalSpent: 1_740,
    lastVisit: "Apr 22, 2026",
    status: "Inactive",
    notes: "Snowbird - in town only Oct–Apr.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

const AVATAR_COLORS = [
  "from-blue-500 to-violet-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-violet-500 to-purple-600",
  "from-fuchsia-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-green-500 to-emerald-600",
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}

function StatCard({ icon: Icon, label, value, color, bg }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-4 flex items-center gap-4">
      <div className={`${bg} p-2.5 rounded-xl shrink-0`}>
        <Icon className={`size-5 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-white/40 font-medium leading-tight">{label}</p>
        <p className="text-xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Customer Card ────────────────────────────────────────────────────────────

interface CustomerCardProps {
  customer: Customer;
  colorClass: string;
}

function CustomerCard({ customer, colorClass }: CustomerCardProps) {
  const isActive = customer.status === "Active";

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:border-white/14 transition-colors">
      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`size-11 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}
        >
          <span className="text-sm font-bold text-white">
            {getInitials(customer.firstName, customer.lastName)}
          </span>
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white leading-tight">
              {customer.firstName} {customer.lastName}
            </p>
            <Badge
              className={`text-[9px] font-medium border px-1.5 py-0 rounded-full ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                  : "bg-slate-500/15 text-slate-400 border-slate-500/20"
              }`}
            >
              {customer.status}
            </Badge>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">{customer.id}</p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <Mail className="size-3 shrink-0 text-white/30" />
          <span className="truncate">{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <Phone className="size-3 shrink-0 text-white/30" />
          <span>{customer.phone}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/6 pt-3.5">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Car className="size-3 text-white/25" />
          </div>
          <p className="text-sm font-semibold text-white">{customer.vehicles}</p>
          <p className="text-[10px] text-white/35">Vehicles</p>
        </div>
        <div className="text-center border-x border-white/6">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <DollarSign className="size-3 text-white/25" />
          </div>
          <p className="text-sm font-semibold text-white">${customer.totalSpent.toLocaleString()}</p>
          <p className="text-[10px] text-white/35">Lifetime</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <CalendarDays className="size-3 text-white/25" />
          </div>
          <p className="text-[11px] font-medium text-white leading-tight">{customer.lastVisit.split(",")[0]}</p>
          <p className="text-[10px] text-white/35">Last Visit</p>
        </div>
      </div>

      {/* Notes */}
      {customer.notes && (
        <p className="text-[11px] text-white/35 italic leading-relaxed -mt-1 border-t border-white/5 pt-3">
          {customer.notes}
        </p>
      )}

      {/* Action */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full h-8 text-xs text-primary/70 hover:text-primary hover:bg-primary/10 border border-primary/15 hover:border-primary/30 transition-colors gap-1.5 mt-auto"
      >
        View Profile
        <ArrowRight className="size-3" />
      </Button>
    </div>
  );
}

// ─── Add Customer Form ────────────────────────────────────────────────────────

interface AddCustomerFormProps {
  onSubmit: (c: Customer) => void;
  onClose: () => void;
}

function AddCustomerForm({ onSubmit, onClose }: AddCustomerFormProps) {
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [address, setAddress]       = useState("");
  const [notes, setNotes]           = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phone) return;

    const newId = `C-${String(initialCustomers.length + 1 + Math.floor(Math.random() * 100)).padStart(3, "0")}`;
    onSubmit({
      id: newId,
      firstName,
      lastName,
      email,
      phone,
      vehicles: 0,
      totalSpent: 0,
      lastVisit: "-",
      status: "Active",
      notes: notes || undefined,
    });
    onClose();
  }

  const fieldClass = "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-9 text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
              First Name <span className="text-red-400">*</span>
            </Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane"
              required
              className={fieldClass}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
              Last Name <span className="text-red-400">*</span>
            </Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith"
              required
              className={fieldClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane.smith@email.com"
            required
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Phone <span className="text-red-400">*</span>
          </Label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(512) 555-0100"
            required
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Address <span className="text-white/25 font-normal normal-case tracking-normal">(optional)</span>
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Austin, TX 78701"
            className={fieldClass}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Notes <span className="text-white/25 font-normal normal-case tracking-normal">(optional)</span>
          </Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or preferences…"
            rows={3}
            className="w-full rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 px-3 py-2 resize-none focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <p className="text-[11px] text-white/25">
          <span className="text-red-400">*</span> Required fields
        </p>
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
          disabled={!firstName || !lastName || !email || !phone}
        >
          Add Customer
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleAddCustomer(c: Customer) {
    setCustomers((prev) => [c, ...prev]);
  }

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  const activeThisMonth = customers.filter((c) => c.status === "Active").length;
  const avgSpend = Math.round(
    customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Customers"
        subtitle={`${customers.length} total customers`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />Add Customer</Button>} />
            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]"
              showCloseButton={false}
            >
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">Add Customer</SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">Enter the new customer&apos;s contact information.</p>
              </SheetHeader>
              <AddCustomerForm
                onSubmit={handleAddCustomer}
                onClose={() => setSheetOpen(false)}
              />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Total Customers"
            value={customers.length.toString()}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <StatCard
            icon={UserCheck}
            label="Active This Month"
            value={activeThisMonth.toString()}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatCard
            icon={UserPlus}
            label="New This Month"
            value="12"
            color="text-violet-400"
            bg="bg-violet-500/10"
          />
          <StatCard
            icon={DollarSign}
            label="Avg Lifetime Spend"
            value={`$${avgSpend.toLocaleString()}`}
            color="text-amber-400"
            bg="bg-amber-500/10"
          />
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="pl-9 h-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/40 text-sm"
            />
          </div>
          <p className="text-xs text-white/30 shrink-0">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Customer Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <Users className="size-10 mb-3 opacity-40" />
            <p className="text-sm">No customers found</p>
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-xs text-primary/60 hover:text-primary"
                onClick={() => setSearch("")}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((customer, i) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
