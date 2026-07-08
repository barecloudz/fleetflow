"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Wrench, Car, ChevronRight, ArrowUpRight } from "lucide-react";

type Order = {
  id: string;
  service: string;
  vehicle: string;
  date: string;
  total: string;
  status: "Awaiting Approval" | "In Progress" | "Completed" | "Ready for Pickup";
};

const allOrders: Order[] = [
  {
    id: "WO-1041",
    service: "Brake Inspection & Pad Replacement",
    vehicle: "2021 Tesla Model 3",
    date: "Jul 5, 2026",
    total: "$486.00",
    status: "Awaiting Approval",
  },
  {
    id: "WO-1038",
    service: "Oil Change + Filter",
    vehicle: "2019 Honda Pilot",
    date: "Jun 18, 2026",
    total: "$89.00",
    status: "Completed",
  },
  {
    id: "WO-1034",
    service: "AC Diagnostic & Recharge",
    vehicle: "2019 Honda Pilot",
    date: "May 22, 2026",
    total: "$210.00",
    status: "Completed",
  },
  {
    id: "WO-1029",
    service: "Tire Rotation & Alignment",
    vehicle: "2021 Tesla Model 3",
    date: "May 2, 2026",
    total: "$145.00",
    status: "Completed",
  },
  {
    id: "WO-1021",
    service: "Wiper Blades + Fluid Top-Off",
    vehicle: "2019 Honda Pilot",
    date: "Mar 28, 2026",
    total: "$42.00",
    status: "Completed",
  },
  {
    id: "WO-1014",
    service: "60K Mile Service",
    vehicle: "2019 Honda Pilot",
    date: "Jan 6, 2026",
    total: "$620.00",
    status: "Completed",
  },
];

const statusStyles: Record<Order["status"], string> = {
  "Awaiting Approval": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "In Progress": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Ready for Pickup": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const activeStatuses: Order["status"][] = ["Awaiting Approval", "In Progress", "Ready for Pickup"];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = allOrders.filter((o) => {
    const matchesSearch =
      o.service.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.vehicle.toLowerCase().includes(search.toLowerCase());

    if (tab === "active") return matchesSearch && activeStatuses.includes(o.status);
    if (tab === "completed") return matchesSearch && o.status === "Completed";
    return matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Orders</h1>
        <p className="text-white/45 mt-1 text-sm">All your service history in one place</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <Input
          placeholder="Search orders by service, WO number, or vehicle…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl h-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={(v) => v && setTab(v)}>
        <TabsList className="glass mb-6 p-1 rounded-xl border border-white/8 h-auto gap-1 bg-transparent">
          <TabsTrigger
            value="all"
            className="rounded-lg px-4 py-1.5 text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 transition-all"
          >
            All <span className="ml-1.5 text-xs text-white/30">{allOrders.length}</span>
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="rounded-lg px-4 py-1.5 text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 transition-all"
          >
            Active <span className="ml-1.5 text-xs text-amber-400/70">{allOrders.filter(o => activeStatuses.includes(o.status)).length}</span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="rounded-lg px-4 py-1.5 text-sm data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 transition-all"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        {["all", "active", "completed"].map((tabVal) => (
          <TabsContent key={tabVal} value={tabVal} className="mt-0 space-y-3">
            {tab === tabVal && filtered.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center" style={{ border: "1px solid oklch(1 0 0 / 7%)" }}>
                <Wrench size={32} className="mx-auto text-white/15 mb-3" />
                <p className="text-white/40 text-sm">No orders found</p>
              </div>
            ) : tab === tabVal ? (
              filtered.map((order) => (
                <div
                  key={order.id}
                  className="glass-card rounded-2xl p-5 hover:bg-white/3 transition-colors"
                  style={{ border: "1px solid oklch(1 0 0 / 7%)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "oklch(0.50 0.22 255 / 12%)" }}
                      >
                        <Wrench size={17} className="text-blue-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-xs font-mono text-white/35">{order.id}</span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusStyles[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="font-medium text-white text-sm mb-1">{order.service}</p>
                        <div className="flex items-center gap-3 text-xs text-white/35">
                          <span className="flex items-center gap-1">
                            <Car size={11} />
                            {order.vehicle}
                          </span>
                          <span>{order.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      <span className="text-lg font-bold text-white">{order.total}</span>
                      <Link href={`/portal/orders/${order.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-xl border border-white/8 px-3"
                        >
                          View Details
                          <ChevronRight size={12} className="ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
