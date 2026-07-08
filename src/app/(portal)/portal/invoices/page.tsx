"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  CalendarClock,
  FileText,
} from "lucide-react";

type InvoiceStatus = "Paid" | "Pending" | "Overdue";

type Invoice = {
  id: string;
  date: string;
  dueDate: string;
  services: string;
  amount: number;
  status: InvoiceStatus;
};

const invoices: Invoice[] = [
  {
    id: "INV-2406",
    date: "Jun 18, 2026",
    dueDate: "Jul 18, 2026",
    services: "Oil Change + Filter",
    amount: 89.0,
    status: "Paid",
  },
  {
    id: "INV-2401",
    date: "Jul 5, 2026",
    dueDate: "Jul 20, 2026",
    services: "Brake Inspection & Pad Replacement",
    amount: 486.0,
    status: "Overdue",
  },
  {
    id: "INV-2388",
    date: "May 22, 2026",
    dueDate: "Jun 22, 2026",
    services: "AC Diagnostic & Recharge",
    amount: 210.0,
    status: "Paid",
  },
  {
    id: "INV-2375",
    date: "May 2, 2026",
    dueDate: "Jun 2, 2026",
    services: "Tire Rotation & Alignment",
    amount: 145.0,
    status: "Paid",
  },
  {
    id: "INV-2362",
    date: "Jan 6, 2026",
    dueDate: "Feb 6, 2026",
    services: "60K Mile Service",
    amount: 620.0,
    status: "Paid",
  },
];

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  Paid: {
    label: "Paid",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: <CheckCircle2 size={11} />,
  },
  Pending: {
    label: "Pending",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: <Clock size={11} />,
  },
  Overdue: {
    label: "Overdue",
    className: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: <AlertCircle size={11} />,
  },
};

export default function InvoicesPage() {
  const [payingId, setPayingId] = useState<string | null>(null);

  const totalPaid = invoices
    .filter((i) => i.status === "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const outstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((s, i) => s + i.amount, 0);
  const nextDue = invoices.find(
    (i) => i.status === "Overdue" || i.status === "Pending"
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Invoices</h1>
        <p className="text-white/45 mt-1 text-sm">
          Your billing history and outstanding payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="glass-card rounded-2xl p-5"
          style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.55 0.18 150 / 20%)" }}
            >
              <TrendingUp size={15} className="text-emerald-400" />
            </div>
            <span className="text-xs text-white/45 uppercase tracking-wide">
              Total Paid
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-white/30 mt-1">Lifetime with Blake&apos;s Auto</p>
        </div>

        <div
          className="glass-card rounded-2xl p-5"
          style={{ border: "1px solid oklch(0.62 0.22 22 / 25%)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.62 0.22 22 / 20%)" }}
            >
              <AlertCircle size={15} className="text-red-400" />
            </div>
            <span className="text-xs text-white/45 uppercase tracking-wide">
              Outstanding
            </span>
          </div>
          <p className="text-2xl font-bold text-red-300">
            ${outstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-white/30 mt-1">
            {outstanding > 0 ? "Payment needed" : "Nothing owed"}
          </p>
        </div>

        <div
          className="glass-card rounded-2xl p-5"
          style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.50 0.22 255 / 12%)" }}
            >
              <CalendarClock size={15} className="text-blue-400" />
            </div>
            <span className="text-xs text-white/45 uppercase tracking-wide">
              Next Due
            </span>
          </div>
          <p className="text-2xl font-bold text-white">
            {nextDue ? nextDue.dueDate : "-"}
          </p>
          <p className="text-xs text-white/30 mt-1">
            {nextDue ? nextDue.id : "No pending invoices"}
          </p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="space-y-3">
        {invoices.map((inv) => {
          const cfg = statusConfig[inv.status];
          const canPay = inv.status !== "Paid";
          return (
            <div
              key={inv.id}
              className="glass-card rounded-2xl p-5 hover:bg-white/2 transition-colors"
              style={{
                border:
                  inv.status === "Overdue"
                    ? "1px solid oklch(0.62 0.22 22 / 20%)"
                    : "1px solid oklch(1 0 0 / 7%)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex items-start gap-4 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        inv.status === "Overdue"
                          ? "oklch(0.62 0.22 22 / 15%)"
                          : "oklch(0.50 0.22 255 / 10%)",
                    }}
                  >
                    <FileText
                      size={17}
                      className={
                        inv.status === "Overdue" ? "text-red-400" : "text-blue-400"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono text-white/35">{inv.id}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.className}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                    <p className="font-medium text-white text-sm">{inv.services}</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      Issued {inv.date} · Due {inv.dueDate}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
                  <span
                    className={`text-xl font-bold ${
                      inv.status === "Overdue" ? "text-red-300" : "text-white"
                    }`}
                  >
                    ${inv.amount.toFixed(2)}
                  </span>
                  {canPay ? (
                    <Button
                      size="sm"
                      className="gradient-blue text-white text-xs font-semibold rounded-xl border-0 glow-blue-sm px-4"
                      onClick={() => setPayingId(inv.id)}
                    >
                      <CreditCard size={12} className="mr-1.5" />
                      {payingId === inv.id ? "Processing…" : "Pay Now"}
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      Paid in full
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/20 pb-4">
        Payments are processed securely. For billing questions, contact Blake&apos;s
        Auto Service.
      </p>
    </div>
  );
}
