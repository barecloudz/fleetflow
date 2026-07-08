"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Clock, User, Plus, X } from "lucide-react";

const upcoming = [
  {
    id: "APT-88",
    date: "Thu, Jul 10, 2026",
    time: "10:00 AM",
    service: "Brake Inspection Follow-up",
    tech: "Mike Torres",
    vehicle: "2021 Tesla Model 3",
    status: "Confirmed",
  },
  {
    id: "APT-91",
    date: "Tue, Jul 22, 2026",
    time: "2:30 PM",
    service: "Oil Change",
    tech: "Sarah Kim",
    vehicle: "2019 Honda Pilot",
    status: "Pending",
  },
];

export default function AppointmentsPage() {
  const [vehicle, setVehicle] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setVehicle(""); setService(""); setDate(""); setTime(""); setNotes("");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
        <p className="text-sm text-muted-foreground mt-1">View upcoming appointments or book a new one</p>
      </div>

      {/* Upcoming */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Upcoming</h2>
        {upcoming.map((apt) => (
          <Card key={apt.id} className="glass-card border-white/8">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="size-11 rounded-xl gradient-blue flex flex-col items-center justify-center text-white shrink-0 glow-blue-sm">
                    <CalendarDays className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{apt.service}</span>
                      <Badge className={`text-[10px] border px-2 py-0 ${apt.status === "Confirmed" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20"}`}>
                        {apt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="size-3" />{apt.date} at {apt.time}</span>
                      <span className="flex items-center gap-1"><User className="size-3" />{apt.tech}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">{apt.vehicle}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-red-400 shrink-0" title="Cancel appointment">
                  <X className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Book new */}
      <section>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">Book a New Appointment</h2>
        <Card className="glass-card border-white/8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-foreground flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              Request an Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {submitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="size-12 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto">
                  <CalendarDays className="size-6 text-emerald-400" />
                </div>
                <p className="font-semibold text-foreground">Request Sent!</p>
                <p className="text-sm text-muted-foreground">We'll confirm your appointment within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Vehicle</Label>
                    <Select value={vehicle} onValueChange={(v) => v && setVehicle(v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tesla">2021 Tesla Model 3</SelectItem>
                        <SelectItem value="honda">2019 Honda Pilot</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Service Type</Label>
                    <Select value={service} onValueChange={(v) => v && setService(v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oil">Oil Change</SelectItem>
                        <SelectItem value="tires">Tire Rotation</SelectItem>
                        <SelectItem value="brakes">Brake Service</SelectItem>
                        <SelectItem value="ac">AC Service</SelectItem>
                        <SelectItem value="diagnostic">Diagnostic</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Preferred Date</Label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">Preferred Time</Label>
                    <Select value={time} onValueChange={(v) => v && setTime(v)}>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8am">8:00 AM</SelectItem>
                        <SelectItem value="9am">9:00 AM</SelectItem>
                        <SelectItem value="10am">10:00 AM</SelectItem>
                        <SelectItem value="11am">11:00 AM</SelectItem>
                        <SelectItem value="1pm">1:00 PM</SelectItem>
                        <SelectItem value="2pm">2:00 PM</SelectItem>
                        <SelectItem value="3pm">3:00 PM</SelectItem>
                        <SelectItem value="4pm">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Notes (optional)</Label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe any symptoms or concerns..."
                    rows={3}
                    className="w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-blue glow-blue-sm text-white font-medium"
                  disabled={!vehicle || !service || !date || !time}
                >
                  Request Appointment
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
