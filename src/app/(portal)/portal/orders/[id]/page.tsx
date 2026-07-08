import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  MessageSquare,
  Wrench,
  ShieldCheck,
  XCircle,
  User,
} from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const mockOrder = {
  id: "WO-1041",
  status: "Awaiting Approval" as const,
  vehicle: "2021 Tesla Model 3",
  plate: "7TXL924",
  created: "July 5, 2026",
  advisor: "Blake Thompson",
  tech: "Mike Rodriguez",

  recommendedServices: [
    { id: "s1", name: "Front Brake Pad Replacement", price: 189.0, note: "Pads at 2mm - replacement recommended" },
    { id: "s2", name: "Rear Brake Pad Replacement", price: 189.0, note: "Pads at 3mm - replacement recommended" },
    { id: "s3", name: "Brake Fluid Flush", price: 79.0, note: "Fluid contaminated - moisture present" },
  ],

  timelineStep: 1, // 0=Received, 1=Diagnosed, 2=In Progress, 3=Ready, 4=Complete

  services: [
    { description: "Multi-Point Brake Inspection", type: "Labor", qty: 1, unit: 49.0 },
    { description: "Front Brake Pad Set (OEM)", type: "Part", qty: 1, unit: 89.0 },
    { description: "Rear Brake Pad Set (OEM)", type: "Part", qty: 1, unit: 79.0 },
    { description: "Pad Installation - Front", type: "Labor", qty: 1.5, unit: 95.0 },
    { description: "Pad Installation - Rear", type: "Labor", qty: 1.5, unit: 95.0 },
  ],

  messages: [
    {
      id: "m1",
      from: "shop",
      sender: "Blake's Auto Service",
      time: "Jul 5, 10:14 AM",
      text: "Hi Sarah! We've received your Tesla and our tech has completed the inspection. We found the brake pads are worn down significantly on both front and rear axles. I've added the recommended services above - please review and approve at your convenience.",
    },
    {
      id: "m2",
      from: "shop",
      sender: "Mike Rodriguez",
      time: "Jul 5, 11:32 AM",
      text: "Also noted some moisture in the brake fluid during testing. A fluid flush is recommended as contaminated fluid can affect braking performance. Happy to answer any questions!",
    },
    {
      id: "m3",
      from: "customer",
      sender: "Sarah Chen",
      time: "Jul 5, 12:05 PM",
      text: "Thanks for the thorough inspection! Looks like the full brake job makes sense. Will review the estimate now.",
    },
  ],

  subtotal: 406.0,
  tax: 32.48,
  total: 438.48,
};

const timelineSteps = ["Received", "Diagnosed", "In Progress", "Ready", "Complete"];

// ── Component ──────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = { ...mockOrder, id };

  const isAwaitingApproval = order.status === "Awaiting Approval";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      {/* Back */}
      <Link
        href="/portal/orders"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={14} />
        My Orders
      </Link>

      {/* Order Header */}
      <div className="glass-card rounded-2xl p-6" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-xl font-bold text-white font-mono">{order.id}</span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  isAwaitingApproval
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/45 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Car size={13} />
                {order.vehicle} · {order.plate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                Created {order.created}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/35 mb-0.5">Service Advisor</p>
            <p className="text-sm font-medium text-white">{order.advisor}</p>
            <p className="text-xs text-white/35 mt-1">Tech: {order.tech}</p>
          </div>
        </div>
      </div>

      {/* Service Approval Card */}
      {isAwaitingApproval && (
        <div
          className="rounded-2xl p-6 space-y-5"
          style={{
            background: "oklch(0.55 0.18 60 / 8%)",
            border: "1px solid oklch(0.65 0.18 60 / 25%)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(0.65 0.18 60 / 20%)" }}
            >
              <ShieldCheck size={17} className="text-amber-300" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Service Approval Required</p>
              <p className="text-xs text-white/45">Review the recommended services below</p>
            </div>
          </div>

          <div className="space-y-3">
            {order.recommendedServices.map((svc) => (
              <div
                key={svc.id}
                className="flex items-start gap-3 p-3.5 rounded-xl"
                style={{ background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 6%)" }}
              >
                <div
                  className="w-4 h-4 rounded border-2 border-amber-400/50 mt-0.5 flex-shrink-0"
                  style={{ background: "oklch(0.65 0.18 60 / 20%)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{svc.name}</p>
                  <p className="text-xs text-white/40 mt-0.5">{svc.note}</p>
                </div>
                <span className="text-sm font-bold text-white flex-shrink-0">
                  ${svc.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <Link href="/portal/orders" className="flex-1">
              <Button
                className="w-full gradient-blue text-white font-semibold rounded-xl border-0 glow-blue-sm"
              >
                <CheckCircle2 size={15} className="mr-1.5" />
                Approve All
              </Button>
            </Link>
            <Link href="/portal/orders">
              <Button
                variant="ghost"
                className="text-white/50 hover:text-white/80 hover:bg-white/5 rounded-xl border border-white/8 px-5"
              >
                <XCircle size={15} className="mr-1.5" />
                Decline
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div className="glass-card rounded-2xl p-6" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-6">Service Progress</h2>
        <div className="flex items-center">
          {timelineSteps.map((step, i) => {
            const isDone = i < order.timelineStep;
            const isCurrent = i === order.timelineStep;
            const isLast = i === timelineSteps.length - 1;
            return (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-emerald-500/20 border-2 border-emerald-500/60"
                        : isCurrent
                        ? "glow-blue-sm border-2 border-blue-500/70"
                        : "bg-white/5 border-2 border-white/10"
                    }`}
                    style={isCurrent ? { background: "oklch(0.50 0.22 255 / 20%)" } : {}}
                  >
                    {isDone ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "oklch(0.65 0.20 255)" }} />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium whitespace-nowrap ${
                      isDone ? "text-emerald-400" : isCurrent ? "text-blue-400" : "text-white/25"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className="h-0.5 flex-1 mx-1.5 mb-5 rounded-full"
                    style={{
                      background: isDone
                        ? "oklch(0.55 0.18 150 / 40%)"
                        : "oklch(1 0 0 / 8%)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Services Performed */}
      <div className="glass-card rounded-2xl p-6" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-5">Services & Parts</h2>
        <div className="space-y-0">
          {/* Header */}
          <div className="grid grid-cols-12 gap-3 px-3 pb-2 border-b border-white/6">
            <span className="col-span-6 text-xs text-white/35 uppercase tracking-wide">Description</span>
            <span className="col-span-2 text-xs text-white/35 uppercase tracking-wide">Type</span>
            <span className="col-span-2 text-xs text-white/35 uppercase tracking-wide text-center">Qty</span>
            <span className="col-span-2 text-xs text-white/35 uppercase tracking-wide text-right">Amount</span>
          </div>
          {order.services.map((line, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 px-3 py-3 border-b border-white/4 last:border-b-0 hover:bg-white/2 transition-colors">
              <span className="col-span-6 text-sm text-white">{line.description}</span>
              <span className="col-span-2">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    line.type === "Labor"
                      ? "bg-blue-500/15 text-blue-300"
                      : "bg-violet-500/15 text-violet-300"
                  }`}
                >
                  {line.type}
                </span>
              </span>
              <span className="col-span-2 text-sm text-white/50 text-center">{line.qty}</span>
              <span className="col-span-2 text-sm font-medium text-white text-right">
                ${(line.qty * line.unit).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-5 pt-4 border-t border-white/8 space-y-2">
          <div className="flex justify-between text-sm text-white/50">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-white/50">
            <span>Tax (8%)</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/8">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-5">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-white/35 hover:text-white/60 hover:bg-white/5 rounded-xl border border-white/6"
            disabled
          >
            <Download size={12} className="mr-1.5" />
            Download Invoice (available when complete)
          </Button>
        </div>
      </div>

      {/* Shop Messages */}
      <div className="glass-card rounded-2xl p-6" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare size={16} className="text-blue-400" />
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Messages</h2>
        </div>

        <div className="space-y-4">
          {order.messages.map((msg) => {
            const isShop = msg.from === "shop";
            return (
              <div key={msg.id} className={`flex gap-3 ${isShop ? "" : "flex-row-reverse"}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{
                    background: isShop
                      ? "oklch(0.50 0.22 255 / 20%)"
                      : "oklch(0.55 0.18 150 / 20%)",
                    color: isShop ? "oklch(0.75 0.18 255)" : "oklch(0.75 0.15 150)",
                  }}
                >
                  {isShop ? <Wrench size={13} /> : <User size={13} />}
                </div>
                <div className={`max-w-sm ${isShop ? "" : "items-end"} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/60">{msg.sender}</span>
                    <span className="text-xs text-white/25">{msg.time}</span>
                  </div>
                  <div
                    className="rounded-2xl px-4 py-3 text-sm text-white/80 leading-relaxed"
                    style={{
                      background: isShop
                        ? "oklch(1 0 0 / 5%)"
                        : "oklch(0.50 0.22 255 / 15%)",
                      border: "1px solid oklch(1 0 0 / 6%)",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Reply input */}
        <div className="mt-5 flex gap-2">
          <input
            type="text"
            placeholder="Reply to shop…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-blue-500/40 transition-colors"
          />
          <Button
            className="gradient-blue text-white text-sm font-semibold rounded-xl border-0 px-4"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
