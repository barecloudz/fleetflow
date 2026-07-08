"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, Plus, CalendarDays, Clock } from "lucide-react";

interface Appointment {
  id: string;
  customer: string;
  service: string;
  tech: string;
  day: number; // 0=Mon, 6=Sun
  hour: number; // 7–17 (7am–5pm)
  duration: number; // hours
  color: string;
}

const appointments: Appointment[] = [
  { id: "A1", customer: "Marcus Reid", service: "Oil Change", tech: "AJ", day: 0, hour: 8, duration: 1, color: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-500/30 dark:border-blue-500/50 dark:text-blue-100" },
  { id: "A2", customer: "Sarah Chen", service: "Brake Pads", tech: "ML", day: 0, hour: 10, duration: 2, color: "bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-500/30 dark:border-violet-500/50 dark:text-violet-100" },
  { id: "A3", customer: "David Torres", service: "Engine Diag", tech: "RK", day: 1, hour: 9, duration: 2, color: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/30 dark:border-amber-500/50 dark:text-amber-100" },
  { id: "A4", customer: "Priya Nair", service: "AC Service", tech: "AJ", day: 1, hour: 13, duration: 1, color: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-500/30 dark:border-emerald-500/50 dark:text-emerald-100" },
  { id: "A5", customer: "Tom Walsh", service: "Transmission", tech: "ML", day: 2, hour: 8, duration: 3, color: "bg-red-100 border-red-300 text-red-800 dark:bg-red-500/30 dark:border-red-500/50 dark:text-red-100" },
  { id: "A6", customer: "Lisa Park", service: "Coolant Flush", tech: "RK", day: 2, hour: 14, duration: 1, color: "bg-cyan-100 border-cyan-300 text-cyan-800 dark:bg-cyan-500/30 dark:border-cyan-500/50 dark:text-cyan-100" },
  { id: "A7", customer: "James Ortega", service: "Wheel Align", tech: "AJ", day: 3, hour: 11, duration: 1, color: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-500/30 dark:border-blue-500/50 dark:text-blue-100" },
  { id: "A8", customer: "Nina Brooks", service: "Battery Repl", tech: "ML", day: 3, hour: 15, duration: 1, color: "bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-500/30 dark:border-violet-500/50 dark:text-violet-100" },
  { id: "A9", customer: "Kevin Shaw", service: "Full Detail", tech: "RK", day: 4, hour: 9, duration: 2, color: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-500/30 dark:border-emerald-500/50 dark:text-emerald-100" },
  { id: "A10", customer: "Rachel Green", service: "Suspension", tech: "AJ", day: 4, hour: 13, duration: 2, color: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-500/30 dark:border-amber-500/50 dark:text-amber-100" },
];

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am–6pm
const SLOT_HEIGHT = 60; // px per hour

function getWeekDates(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function getMondayOfWeek(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isToday(d: Date) {
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function formatHour(h: number) {
  const ampm = h < 12 ? "am" : "pm";
  const display = h > 12 ? h - 12 : h;
  return `${display}${ampm}`;
}

export default function CalendarPage() {
  const [monday, setMonday] = useState(() => getMondayOfWeek(new Date()));
  const [sheetOpen, setSheetOpen] = useState(false);
  const weekDates = getWeekDates(monday);

  const prevWeek = () => {
    const m = new Date(monday);
    m.setDate(m.getDate() - 7);
    setMonday(m);
  };
  const nextWeek = () => {
    const m = new Date(monday);
    m.setDate(m.getDate() + 7);
    setMonday(m);
  };
  const goToday = () => setMonday(getMondayOfWeek(new Date()));

  const todayAppts = appointments.filter((a) => {
    const todayDay = new Date().getDay();
    const adjustedDay = todayDay === 0 ? 6 : todayDay - 1;
    return a.day === adjustedDay;
  }).sort((a, b) => a.hour - b.hour);

  const weekLabel = `${formatDate(weekDates[0])} – ${formatDate(weekDates[6])}, ${weekDates[0].getFullYear()}`;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <TopBar
        title="Calendar"
        subtitle="Appointments & Scheduling"
        actions={
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger render={<Button size="sm" className="gradient-blue glow-blue-sm text-white font-medium h-8 gap-1.5"><Plus className="size-3.5" />New Appointment</Button>} />
            <SheetContent className="glass-card border-border w-full sm:max-w-md">
              <SheetHeader className="pb-4">
                <SheetTitle className="text-foreground flex items-center gap-2">
                  <CalendarDays className="size-4 text-primary" />
                  New Appointment
                </SheetTitle>
                <SheetDescription className="text-muted-foreground text-sm">
                  Schedule a new service appointment.
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Customer</Label>
                  <Select>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select customer…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border">
                      {["Marcus Reid", "Sarah Chen", "David Torres", "Priya Nair", "Tom Walsh"].map((c) => (
                        <SelectItem key={c} value={c} className="hover:bg-white/8">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Vehicle</Label>
                  <Select>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select vehicle…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border">
                      {["2019 Ford F-150", "2021 Tesla Model 3", "2018 Chevy Tahoe", "2022 Honda Civic"].map((v) => (
                        <SelectItem key={v} value={v} className="hover:bg-white/8">{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Service</Label>
                  <Select>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Select service…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border">
                      {["Oil Change", "Brake Service", "Tire Rotation", "Engine Diagnostic", "AC Service"].map((s) => (
                        <SelectItem key={s} value={s} className="hover:bg-white/8">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Technician</Label>
                  <Select>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Assign tech…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border">
                      {["Alex Johnson (AJ)", "Mike Lee (ML)", "Ryan Kim (RK)"].map((t) => (
                        <SelectItem key={t} value={t} className="hover:bg-white/8">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">Date</Label>
                    <Input type="date" defaultValue="2026-07-08" className="border-border" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground text-xs">Time</Label>
                    <Select>
                      <SelectTrigger className="border-border">
                        <SelectValue placeholder="Time…" />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-border">
                        {["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"].map((t) => (
                          <SelectItem key={t} value={t} className="hover:bg-white/8">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Duration</Label>
                  <Select>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Duration…" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-border">
                      {["30 min", "1 hour", "1.5 hours", "2 hours", "3 hours", "4+ hours"].map((d) => (
                        <SelectItem key={d} value={d} className="hover:bg-white/8">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <Input placeholder="Optional notes…" className="bg-white/5 border-white/10 text-white placeholder:text-white/30" />
                </div>
              </div>

              <SheetFooter className="pt-4 flex gap-2">
                <Button variant="ghost" className="flex-1 border border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => setSheetOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1 gradient-blue glow-blue-sm text-white" onClick={() => setSheetOpen(false)}>
                  Book Appointment
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        }
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Week nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8 text-white/50 hover:text-white hover:bg-white/8" onClick={prevWeek}>
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-sm font-medium text-white min-w-[220px] text-center">{weekLabel}</span>
            <Button variant="ghost" size="icon" className="size-8 text-white/50 hover:text-white hover:bg-white/8" onClick={nextWeek}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white border border-white/10 h-7 px-3" onClick={goToday}>
            Today
          </Button>
        </div>

        {/* Week Grid */}
        <Card className="glass-card border-white/8 overflow-hidden">
          <CardContent className="p-0">
            {/* Day header row */}
            <div className="grid border-b border-white/8" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
              <div className="border-r border-white/6" />
              {weekDates.map((d, i) => (
                <div
                  key={i}
                  className={`py-3 text-center border-r border-white/6 last:border-r-0 ${isToday(d) ? "bg-primary/10" : ""}`}
                >
                  <p className={`text-[10px] font-medium uppercase tracking-wide ${isToday(d) ? "text-primary" : "text-white/40"}`}>
                    {DAY_NAMES[i]}
                  </p>
                  <p className={`text-lg font-semibold mt-0.5 ${isToday(d) ? "text-primary" : "text-white"}`}>
                    {d.getDate()}
                  </p>
                </div>
              ))}
            </div>

            {/* Time rows */}
            <div className="overflow-y-auto" style={{ maxHeight: 600 }}>
              <div className="relative" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
                {/* Background grid */}
                {HOURS.map((hour) => (
                  <div key={hour} className="grid border-b border-white/5" style={{ gridTemplateColumns: "56px repeat(7, 1fr)", height: SLOT_HEIGHT }}>
                    <div className="border-r border-white/6 flex items-start justify-end pr-2 pt-1">
                      <span className="text-[10px] text-white/30 font-mono">{formatHour(hour)}</span>
                    </div>
                    {weekDates.map((_, di) => (
                      <div
                        key={di}
                        className={`border-r border-white/5 last:border-r-0 relative hover:bg-white/2 transition-colors cursor-pointer ${isToday(weekDates[di]) ? "bg-primary/5" : ""}`}
                      />
                    ))}
                  </div>
                ))}

                {/* Appointment blocks - overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ left: 56 }}>
                  {appointments.map((appt) => {
                    const colWidth = `calc((100%) / 7)`;
                    const top = (appt.hour - 7) * SLOT_HEIGHT;
                    const height = appt.duration * SLOT_HEIGHT - 4;
                    const left = `calc(${colWidth} * ${appt.day} + 4px)`;
                    const width = `calc(${colWidth} - 8px)`;
                    return (
                      <div
                        key={appt.id}
                        className={`absolute rounded-lg border px-2 py-1.5 text-left pointer-events-auto cursor-pointer hover:brightness-110 transition-all overflow-hidden ${appt.color}`}
                        style={{ top, height, left, width }}
                      >
                        <p className="text-[11px] font-semibold leading-tight truncate">{appt.customer}</p>
                        <p className="text-[10px] opacity-70 truncate">{appt.service}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="size-4 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-[8px] font-bold">{appt.tech}</span>
                          </div>
                          <span className="text-[10px] opacity-60">{formatHour(appt.hour)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Today panel */}
        <Card className="glass-card border-white/8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Upcoming Today
              {todayAppts.length > 0 && (
                <Badge className="ml-1 bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0">
                  {todayAppts.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {todayAppts.length === 0 ? (
              <p className="text-white/30 text-sm py-4 text-center">No appointments scheduled for today.</p>
            ) : (
              <div className="space-y-2">
                {todayAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${appt.color}`}
                  >
                    <div className="flex-shrink-0 text-center w-12">
                      <p className="text-xs font-bold">{formatHour(appt.hour)}</p>
                      <p className="text-[10px] opacity-60">{appt.duration}h</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{appt.customer}</p>
                      <p className="text-xs opacity-70">{appt.service}</p>
                    </div>
                    <div className="size-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold">{appt.tech}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
