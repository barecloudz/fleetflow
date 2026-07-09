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
  Users,
  Clock,
  Timer,
  TrendingUp,
  Wrench,
  Coffee,
  LogIn,
  LogOut,
  BarChart2,
  Plus,
  Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TechStatus = "Clocked In" | "Clocked Out" | "On Break";

interface Technician {
  id: string;
  name: string;
  initials: string;
  role: string;
  status: TechStatus;
  currentWO: string | null;
  currentJob: string | null;
  hoursToday: number;
  jobsCompleted: number;
  efficiency: number;
  avatarGradient: string;
}

interface TimeEntry {
  id: string;
  techName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  hours: number | null;
  workOrder: string | null;
  job: string | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const initialTechnicians: Technician[] = [
  {
    id: "T-001",
    name: "Jake Torres",
    initials: "JT",
    role: "Lead Tech",
    status: "Clocked In",
    currentWO: "WO-2041",
    currentJob: "Engine Diagnostic",
    hoursToday: 5.5,
    jobsCompleted: 3,
    efficiency: 92,
    avatarGradient: "from-blue-500 to-violet-600",
  },
  {
    id: "T-002",
    name: "Maria Santos",
    initials: "MS",
    role: "A/C Specialist",
    status: "Clocked In",
    currentWO: "WO-2039",
    currentJob: "A/C Recharge",
    hoursToday: 6.0,
    jobsCompleted: 4,
    efficiency: 89,
    avatarGradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "T-003",
    name: "Devon Clark",
    initials: "DC",
    role: "Lube & Tires",
    status: "On Break",
    currentWO: null,
    currentJob: null,
    hoursToday: 4.25,
    jobsCompleted: 6,
    efficiency: 94,
    avatarGradient: "from-amber-500 to-orange-600",
  },
  {
    id: "T-004",
    name: "Keisha Brown",
    initials: "KB",
    role: "Diagnostics",
    status: "Clocked In",
    currentWO: "WO-2040",
    currentJob: "Electrical Fault Scan",
    hoursToday: 5.75,
    jobsCompleted: 2,
    efficiency: 81,
    avatarGradient: "from-pink-500 to-rose-600",
  },
  {
    id: "T-005",
    name: "Chris Nguyen",
    initials: "CN",
    role: "General",
    status: "Clocked Out",
    currentWO: null,
    currentJob: null,
    hoursToday: 8.0,
    jobsCompleted: 5,
    efficiency: 78,
    avatarGradient: "from-cyan-500 to-blue-600",
  },
];

const initialTimeEntries: TimeEntry[] = [
  // Jul 8 (today)
  { id: "TE-001", techName: "Jake Torres",   date: "Jul 8, 2026", clockIn: "7:02 AM",  clockOut: null,      hours: null, workOrder: "WO-2041", job: "Engine Diagnostic"    },
  { id: "TE-002", techName: "Maria Santos",  date: "Jul 8, 2026", clockIn: "7:15 AM",  clockOut: null,      hours: null, workOrder: "WO-2039", job: "A/C Recharge"         },
  { id: "TE-003", techName: "Devon Clark",   date: "Jul 8, 2026", clockIn: "7:30 AM",  clockOut: null,      hours: null, workOrder: "WO-2038", job: "Tire Rotation"        },
  { id: "TE-004", techName: "Keisha Brown",  date: "Jul 8, 2026", clockIn: "8:00 AM",  clockOut: null,      hours: null, workOrder: "WO-2040", job: "Electrical Fault Scan"},
  // Jul 7
  { id: "TE-005", techName: "Jake Torres",   date: "Jul 7, 2026", clockIn: "7:00 AM",  clockOut: "4:02 PM", hours: 9.0,  workOrder: "WO-2035", job: "Brake Service"        },
  { id: "TE-006", techName: "Maria Santos",  date: "Jul 7, 2026", clockIn: "7:12 AM",  clockOut: "3:45 PM", hours: 8.55, workOrder: "WO-2033", job: "Coolant Flush"        },
  { id: "TE-007", techName: "Chris Nguyen",  date: "Jul 8, 2026", clockIn: "6:55 AM",  clockOut: "3:30 PM", hours: 8.58, workOrder: "WO-2037", job: "Oil Change"           },
  { id: "TE-008", techName: "Devon Clark",   date: "Jul 7, 2026", clockIn: "7:30 AM",  clockOut: "4:00 PM", hours: 8.5,  workOrder: "WO-2034", job: "Wheel Alignment"      },
  { id: "TE-009", techName: "Keisha Brown",  date: "Jul 7, 2026", clockIn: "8:00 AM",  clockOut: "5:10 PM", hours: 9.17, workOrder: "WO-2036", job: "Transmission Diag"   },
  // Jul 6
  { id: "TE-010", techName: "Jake Torres",   date: "Jul 6, 2026", clockIn: "7:05 AM",  clockOut: "3:20 PM", hours: 8.25, workOrder: "WO-2029", job: "Spark Plug Replace"   },
  { id: "TE-011", techName: "Maria Santos",  date: "Jul 6, 2026", clockIn: "7:00 AM",  clockOut: "3:15 PM", hours: 8.25, workOrder: "WO-2027", job: "A/C Compressor"       },
  { id: "TE-012", techName: "Chris Nguyen",  date: "Jul 7, 2026", clockIn: "7:00 AM",  clockOut: "3:30 PM", hours: 8.5,  workOrder: "WO-2031", job: "Battery Replace"      },
  // Jul 5
  { id: "TE-013", techName: "Devon Clark",   date: "Jul 5, 2026", clockIn: "7:30 AM",  clockOut: "3:45 PM", hours: 8.25, workOrder: "WO-2022", job: "Oil + Filter"         },
  { id: "TE-014", techName: "Keisha Brown",  date: "Jul 5, 2026", clockIn: "8:00 AM",  clockOut: "4:30 PM", hours: 8.5,  workOrder: "WO-2024", job: "Engine Scan"          },
  { id: "TE-015", techName: "Chris Nguyen",  date: "Jul 6, 2026", clockIn: "6:55 AM",  clockOut: "3:25 PM", hours: 8.5,  workOrder: "WO-2026", job: "Suspension Check"     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusStyles: Record<TechStatus, string> = {
  "Clocked In":  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Clocked Out": "bg-slate-500/15  text-slate-400  border-slate-500/20",
  "On Break":    "bg-amber-500/15  text-amber-400  border-amber-500/20",
};

const statusIcons: Record<TechStatus, React.ElementType> = {
  "Clocked In":  LogIn,
  "Clocked Out": LogOut,
  "On Break":    Coffee,
};

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

// ─── Tech Card ────────────────────────────────────────────────────────────────

interface TechCardProps {
  tech: Technician;
  onToggleClock: (id: string) => void;
}

function TechCard({ tech, onToggleClock }: TechCardProps) {
  const StatusIcon = statusIcons[tech.status];

  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-4 hover:border-white/14 transition-colors">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className={`size-12 rounded-xl bg-gradient-to-br ${tech.avatarGradient} flex items-center justify-center shrink-0`}
        >
          <span className="text-sm font-bold text-white">{tech.initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white leading-tight">{tech.name}</p>
          </div>
          <p className="text-[11px] text-white/40 mt-0.5">{tech.role}</p>
          <Badge
            className={`mt-1.5 text-[9px] font-medium border px-1.5 py-0 rounded-full inline-flex items-center gap-1 ${statusStyles[tech.status]}`}
          >
            <StatusIcon className="size-2.5" />
            {tech.status}
          </Badge>
        </div>
      </div>

      {/* Current job */}
      <div className="rounded-lg bg-white/4 border border-white/6 px-3 py-2.5 flex items-center gap-2.5">
        <Wrench className="size-3.5 text-white/30 shrink-0" />
        {tech.currentWO && tech.currentJob ? (
          <div className="min-w-0">
            <p className="text-[11px] text-primary/70 font-mono leading-none">{tech.currentWO}</p>
            <p className="text-xs text-white/70 mt-0.5 truncate">{tech.currentJob}</p>
          </div>
        ) : (
          <p className="text-xs text-white/30 italic">
            {tech.status === "On Break" ? "On break" : "Available"}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/6 pt-3.5">
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{tech.hoursToday}h</p>
          <p className="text-[10px] text-white/35 mt-0.5">Today</p>
        </div>
        <div className="text-center border-x border-white/6">
          <p className="text-sm font-semibold text-white">{tech.jobsCompleted}</p>
          <p className="text-[10px] text-white/35 mt-0.5">Jobs Done</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">{tech.efficiency}%</p>
          <p className="text-[10px] text-white/35 mt-0.5">Efficiency</p>
        </div>
      </div>

      {/* Clock toggle button */}
      <Button
        size="sm"
        onClick={() => onToggleClock(tech.id)}
        className={
          tech.status === "Clocked Out"
            ? "w-full h-8 text-xs gradient-blue glow-blue-sm text-white font-medium gap-1.5"
            : "w-full h-8 text-xs text-white/60 hover:text-white hover:bg-white/8 border border-white/10 hover:border-white/20 transition-colors gap-1.5"
        }
        variant={tech.status === "Clocked Out" ? undefined : "ghost"}
      >
        {tech.status === "Clocked Out" ? (
          <>
            <LogIn className="size-3.5" />
            Clock In
          </>
        ) : (
          <>
            <LogOut className="size-3.5" />
            {tech.status === "On Break" ? "End Break / Clock Out" : "Clock Out"}
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Add Technician Form ──────────────────────────────────────────────────────

interface AddTechFormProps {
  onSubmit: (tech: Technician) => void;
  onClose: () => void;
}

const GRADIENT_OPTIONS = [
  { label: "Blue / Violet",   value: "from-blue-500 to-violet-600"   },
  { label: "Emerald / Teal",  value: "from-emerald-500 to-teal-600"  },
  { label: "Amber / Orange",  value: "from-amber-500 to-orange-600"  },
  { label: "Pink / Rose",     value: "from-pink-500 to-rose-600"     },
  { label: "Cyan / Blue",     value: "from-cyan-500 to-blue-600"     },
  { label: "Violet / Purple", value: "from-violet-500 to-purple-600" },
];

const ROLE_OPTIONS = [
  "Lead Tech",
  "A/C Specialist",
  "Lube & Tires",
  "Diagnostics",
  "General",
  "Electrician",
  "Transmission Specialist",
];

function AddTechForm({ onSubmit, onClose }: AddTechFormProps) {
  const [name, setName]       = useState("");
  const [role, setRole]       = useState("");
  const [gradient, setGradient] = useState(GRADIENT_OPTIONS[0].value);

  function getInitials(fullName: string) {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return fullName.slice(0, 2).toUpperCase();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !role) return;

    onSubmit({
      id: `T-${String(100 + Math.floor(Math.random() * 900))}`,
      name,
      initials: getInitials(name),
      role,
      status: "Clocked Out",
      currentWO: null,
      currentJob: null,
      hoursToday: 0,
      jobsCompleted: 0,
      efficiency: 0,
      avatarGradient: gradient,
    });
    onClose();
  }

  const fieldClass =
    "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-primary/50 h-9 text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Full Name <span className="text-red-400">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
            required
            className={fieldClass}
          />
        </div>

        {/* Role */}
        <div className="space-y-1.5">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Role / Specialty <span className="text-red-400">*</span>
          </Label>
          <Select value={role} onValueChange={(v) => v && setRole(v)}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-primary/50 h-9">
              <SelectValue placeholder="Select role…" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Avatar color */}
        <div className="space-y-2">
          <Label className="text-xs text-white/60 font-medium uppercase tracking-wide">
            Avatar Color
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {GRADIENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGradient(opt.value)}
                className={`h-10 rounded-lg bg-gradient-to-br ${opt.value} flex items-center justify-center transition-all ${
                  gradient === opt.value
                    ? "ring-2 ring-white/60 ring-offset-2 ring-offset-transparent scale-105"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                {name && (
                  <span className="text-xs font-bold text-white">
                    {name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>
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
          disabled={!name || !role}
        >
          Add Technician
        </Button>
      </SheetFooter>
    </form>
  );
}

// ─── Time Clock Table ─────────────────────────────────────────────────────────

interface TimeClockTableProps {
  entries: TimeEntry[];
}

function TimeClockTable({ entries }: TimeClockTableProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/30">
        <Clock className="size-9 mb-3 opacity-40" />
        <p className="text-sm">No time entries found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/6">
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Technician</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Date</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Clock In</th>
            <th className="text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Clock Out</th>
            <th className="text-right px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Hours</th>
            <th className="hidden md:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider whitespace-nowrap">Work Order</th>
            <th className="hidden lg:table-cell text-left px-4 py-3 text-[11px] font-semibold text-white/40 uppercase tracking-wider">Job</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/4">
          {entries.map((entry) => {
            const isActive = entry.clockOut === null;
            return (
              <tr key={entry.id} className="hover:bg-white/3 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="text-white font-medium text-sm">{entry.techName}</span>
                </td>
                <td className="px-4 py-3.5 text-white/50 text-sm whitespace-nowrap">{entry.date}</td>
                <td className="px-4 py-3.5 text-white/70 text-sm whitespace-nowrap tabular-nums">{entry.clockIn}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="text-white/70 text-sm tabular-nums">{entry.clockOut}</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums">
                  {isActive ? (
                    <span className="text-white/30 text-xs italic">—</span>
                  ) : (
                    <span className="text-white font-medium">{entry.hours?.toFixed(2)}h</span>
                  )}
                </td>
                <td className="hidden md:table-cell px-4 py-3.5">
                  {entry.workOrder ? (
                    <span className="font-mono text-xs text-primary/70">{entry.workOrder}</span>
                  ) : (
                    <span className="text-white/25 text-xs italic">—</span>
                  )}
                </td>
                <td className="hidden lg:table-cell px-4 py-3.5 text-white/60 text-sm max-w-[160px] truncate">
                  {entry.job ?? <span className="text-white/25 italic text-xs">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string;
  value: string;
  sub?: string;
  color: string;
  bg: string;
  icon: React.ElementType;
}

function SummaryCard({ label, value, sub, color, bg, icon: Icon }: SummaryCardProps) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`${bg} p-1.5 rounded-lg`}>
          <Icon className={`size-3.5 ${color}`} />
        </div>
        <p className="text-xs text-white/40 font-medium">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-[11px] text-white/30 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DATE_RANGE_OPTIONS = ["Today", "This Week", "Last Week", "This Month"];

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [timeEntries]                 = useState<TimeEntry[]>(initialTimeEntries);
  const [activeTab, setActiveTab]     = useState("technicians");
  const [sheetOpen, setSheetOpen]     = useState(false);
  const [dateRange, setDateRange]     = useState("This Week");

  function handleToggleClock(id: string) {
    setTechnicians((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === "Clocked Out") {
          return { ...t, status: "Clocked In" as TechStatus };
        }
        return { ...t, status: "Clocked Out" as TechStatus, currentWO: null, currentJob: null };
      })
    );
  }

  function handleAddTech(tech: Technician) {
    setTechnicians((prev) => [...prev, tech]);
  }

  // Stat derivations
  const clockedInCount  = technicians.filter((t) => t.status === "Clocked In").length;
  const avgEfficiency   = Math.round(
    technicians.reduce((s, t) => s + t.efficiency, 0) / technicians.length
  );
  const totalHoursWeek  = 142;

  // Time clock summary
  const completedEntries  = timeEntries.filter((e) => e.clockOut !== null);
  const totalHours        = completedEntries.reduce((s, e) => s + (e.hours ?? 0), 0);
  const billableHours     = totalHours * 0.82;
  const nonBillableHours  = totalHours - billableHours;
  const overtimeHours     = completedEntries
    .filter((e) => (e.hours ?? 0) > 8)
    .reduce((s, e) => s + Math.max(0, (e.hours ?? 0) - 8), 0);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Technicians"
        subtitle={`${technicians.length} techs · ${clockedInCount} clocked in`}
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger
              render={
                <Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5">
                  <Plus className="size-3.5" />
                  Add Technician
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col border-white/10 bg-[oklch(0.13_0.022_255)]"
              showCloseButton={false}
            >
              <SheetHeader className="p-5 border-b border-white/8 shrink-0">
                <SheetTitle className="text-white text-base font-semibold">Add Technician</SheetTitle>
                <p className="text-xs text-white/40 mt-0.5">Enter the new tech&apos;s details to add them to your team.</p>
              </SheetHeader>
              <AddTechForm onSubmit={handleAddTech} onClose={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-5 h-full">
          {/* Tab switcher */}
          <TabsList className="bg-white/5 border border-white/8 h-9 p-1 gap-0.5 w-fit">
            <TabsTrigger
              value="technicians"
              className="text-xs px-4 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 data-[state=active]:shadow-none rounded"
            >
              <Users className="size-3.5 mr-1.5" />
              Technicians
            </TabsTrigger>
            <TabsTrigger
              value="timeclock"
              className="text-xs px-4 h-7 data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 data-[state=active]:shadow-none rounded"
            >
              <Clock className="size-3.5 mr-1.5" />
              Time Clock
            </TabsTrigger>
          </TabsList>

          {/* ── Technicians Tab ───────────────────────────────────────────── */}
          <TabsContent value="technicians" className="mt-0 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                icon={Users}
                label="Total Techs"
                value={technicians.length.toString()}
                color="text-blue-400"
                bg="bg-blue-500/10"
              />
              <StatCard
                icon={LogIn}
                label="Clocked In Now"
                value={clockedInCount.toString()}
                color="text-emerald-400"
                bg="bg-emerald-500/10"
              />
              <StatCard
                icon={TrendingUp}
                label="Avg Efficiency"
                value={`${avgEfficiency}%`}
                color="text-violet-400"
                bg="bg-violet-500/10"
              />
              <StatCard
                icon={Timer}
                label="Hours This Week"
                value={`${totalHoursWeek}h`}
                color="text-amber-400"
                bg="bg-amber-500/10"
              />
            </div>

            {/* Tech grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {technicians.map((tech) => (
                <TechCard key={tech.id} tech={tech} onToggleClock={handleToggleClock} />
              ))}
            </div>
          </TabsContent>

          {/* ── Time Clock Tab ────────────────────────────────────────────── */}
          <TabsContent value="timeclock" className="mt-0 space-y-5">
            {/* Date range filter */}
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-white/30 shrink-0" />
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/8 rounded-lg p-1">
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setDateRange(opt)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      dateRange === opt
                        ? "bg-primary/20 text-primary"
                        : "text-white/40 hover:text-white/70"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/25 ml-auto">
                {timeEntries.length} entries
              </p>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl overflow-hidden border-white/8">
              <TimeClockTable entries={timeEntries} />
              <div className="px-4 py-3 border-t border-white/5">
                <p className="text-xs text-white/30">
                  Showing{" "}
                  <span className="text-white/50 font-medium">{timeEntries.length}</span>{" "}
                  entries · {timeEntries.filter((e) => e.clockOut === null).length} active
                </p>
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              <SummaryCard
                icon={Timer}
                label="Total Hours"
                value={`${totalHours.toFixed(1)}h`}
                sub="All entries this week"
                color="text-blue-400"
                bg="bg-blue-500/10"
              />
              <SummaryCard
                icon={BarChart2}
                label="Billable Hours"
                value={`${billableHours.toFixed(1)}h`}
                sub={`${Math.round((billableHours / totalHours) * 100)}% of total`}
                color="text-emerald-400"
                bg="bg-emerald-500/10"
              />
              <SummaryCard
                icon={Wrench}
                label="Non-Billable"
                value={`${nonBillableHours.toFixed(1)}h`}
                sub="Admin, training, etc."
                color="text-amber-400"
                bg="bg-amber-500/10"
              />
              <SummaryCard
                icon={TrendingUp}
                label="Overtime"
                value={`${overtimeHours.toFixed(1)}h`}
                sub="Hours over 8/day"
                color="text-rose-400"
                bg="bg-rose-500/10"
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
