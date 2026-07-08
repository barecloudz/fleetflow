"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  Car,
  Calendar,
  Clock,
  ChevronRight,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const vehicles = [
  {
    id: "v1",
    year: 2021,
    make: "Tesla",
    model: "Model 3",
    color: "Midnight Silver",
    mileage: "38,412 mi",
    lastService: "Mar 14, 2026",
    nextService: "Sep 14, 2026",
    plate: "7TXL924",
  },
  {
    id: "v2",
    year: 2019,
    make: "Honda",
    model: "Pilot",
    color: "Lunar Silver",
    mileage: "67,830 mi",
    lastService: "Jan 6, 2026",
    nextService: "Jul 6, 2026",
    plate: "8MNP312",
  },
];

const recentOrders = [
  {
    id: "WO-1041",
    service: "Brake Inspection & Pad Replacement",
    date: "Jul 5, 2026",
    status: "Awaiting Approval",
    statusColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    total: "$486.00",
  },
  {
    id: "WO-1038",
    service: "Oil Change + Filter",
    date: "Jun 18, 2026",
    status: "Completed",
    statusColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    total: "$89.00",
  },
  {
    id: "WO-1029",
    service: "Tire Rotation & Alignment",
    date: "May 2, 2026",
    status: "Completed",
    statusColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    total: "$145.00",
  },
];

const appointments = [
  {
    id: "apt-1",
    date: "July 15, 2026",
    time: "10:00 AM",
    service: "State Inspection",
    vehicle: "2021 Tesla Model 3",
    tech: "Mike R.",
  },
  {
    id: "apt-2",
    date: "August 2, 2026",
    time: "9:00 AM",
    service: "AC Service",
    vehicle: "2019 Honda Pilot",
    tech: "James T.",
  },
];

export default function PortalDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="text-gradient-blue">Sarah</span>
        </h1>
        <p className="text-white/45 mt-1 text-sm">Blake&apos;s Auto Service · Member since 2022</p>
      </div>

      {/* Active Work Order Alert */}
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          background: "oklch(0.55 0.18 60 / 12%)",
          border: "1px solid oklch(0.65 0.18 60 / 30%)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "oklch(0.65 0.18 60 / 20%)" }}
          >
            <AlertTriangle size={17} className="text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">WO-1041 · Brake Inspection</span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "oklch(0.65 0.18 60 / 25%)", color: "oklch(0.85 0.15 65)" }}
              >
                Awaiting Your Approval
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Your technician has recommended additional services. Please review and approve to continue.
            </p>
          </div>
        </div>
        <Link href="/portal/orders/WO-1041">
          <Button
            size="sm"
            className="whitespace-nowrap text-xs font-semibold rounded-xl border-0"
            style={{ background: "oklch(0.65 0.18 60 / 30%)", color: "oklch(0.90 0.15 65)" }}
          >
            Review Now <ChevronRight size={13} className="ml-1" />
          </Button>
        </Link>
      </div>

      {/* My Vehicles */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">My Vehicles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="glass-card rounded-2xl p-5" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.50 0.22 255 / 15%)" }}
                  >
                    <Car size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">
                      {v.year} {v.make} {v.model}
                    </p>
                    <p className="text-xs text-white/40">{v.color} · {v.plate}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">Mileage</p>
                  <p className="text-xs font-semibold text-white">{v.mileage}</p>
                </div>
                <div className="glass rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">Last Service</p>
                  <p className="text-xs font-semibold text-white">{v.lastService}</p>
                </div>
                <div className="glass rounded-xl p-2.5 text-center">
                  <p className="text-[10px] text-white/35 uppercase tracking-wide mb-0.5">Next Due</p>
                  <p className="text-xs font-semibold text-emerald-400">{v.nextService}</p>
                </div>
              </div>

              <Link href={`/portal/orders?vehicle=${v.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-white/50 hover:text-white hover:bg-white/6 rounded-xl border border-white/6"
                >
                  View History
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Orders + Upcoming Appointments - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <section className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link href="/portal/orders" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentOrders.map((order) => (
            <Link key={order.id} href={`/portal/orders/${order.id}`}>
              <div
                className="glass-card rounded-xl p-4 hover:bg-white/4 transition-colors cursor-pointer flex items-center justify-between gap-4"
                style={{ border: "1px solid oklch(1 0 0 / 7%)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.50 0.22 255 / 12%)" }}
                  >
                    <Wrench size={14} className="text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{order.service}</p>
                    <p className="text-xs text-white/35">{order.id} · {order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${order.statusColor}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-white">{order.total}</span>
                  <ChevronRight size={14} className="text-white/25" />
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Upcoming Appointments */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">Upcoming</h2>
            <Link href="/portal/appointments" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Book new →
            </Link>
          </div>
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="glass-card rounded-xl p-4 space-y-2.5"
              style={{ border: "1px solid oklch(1 0 0 / 7%)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.50 0.22 255 / 12%)" }}
                >
                  <Calendar size={13} className="text-blue-400" />
                </div>
                <span className="text-sm font-medium text-white">{apt.service}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-white/45">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} />
                  {apt.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} />
                  {apt.time}
                </div>
                <div className="flex items-center gap-1.5">
                  <Car size={11} />
                  <span className="truncate">{apt.vehicle}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} />
                  {apt.tech}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
