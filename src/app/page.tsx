"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ClipboardList,
  Users,
  Package,
  CreditCard,
  CalendarDays,
  BarChart3,
  Check,
  Play,
  Menu,
  X,
  Star,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: "1px solid oklch(1 0 0 / 8%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="FleetFlow" width={32} height={32} className="size-8 drop-shadow-[0_2px_8px_oklch(0.58_0.22_255/0.5)]" />
            <span className="font-bold text-lg tracking-tight text-foreground">FleetFlow</span>
          </Link>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-lg border border-white/10 text-foreground/80 hover:text-foreground hover:border-white/20 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="gradient-blue glow-blue-sm text-sm px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden py-4 border-t flex flex-col gap-4"
            style={{ borderColor: "oklch(1 0 0 / 8%)", background: "oklch(0.11 0.018 255 / 98%)" }}
          >
            <a href="#features" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#about" className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>About</a>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" className="text-sm px-4 py-2 rounded-lg border border-white/10 text-center text-foreground/80">Sign In</Link>
              <Link href="/signup" className="gradient-blue text-sm px-4 py-2 rounded-lg font-medium text-white text-center">Start Free Trial</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.50 0.22 255 / 18%) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 80% 60%, oklch(0.58 0.22 255 / 8%) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: "oklch(0.58 0.22 255 / 12%)", border: "1px solid oklch(0.58 0.22 255 / 25%)", color: "oklch(0.75 0.18 255)" }}>
              <Zap size={12} />
              Built for modern auto shops
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
              <span className="text-foreground">The Modern Shop</span>
              <br />
              <span className="text-gradient-blue">Management Platform</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              FleetFlow gives your auto shop everything Shopmonkey has: work orders, customers,
              inventory, payments, and appointments, all in one powerful platform built for modern shops.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/signup"
                className="gradient-blue glow-blue inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-base transition-all hover:opacity-90 hover:scale-[1.02]"
              >
                Start Free Trial
              </Link>
              <button className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl border text-foreground/80 hover:text-foreground hover:border-white/20 transition-all text-base font-medium"
                style={{ border: "1px solid oklch(1 0 0 / 12%)" }}>
                <span className="flex items-center justify-center w-7 h-7 rounded-full"
                  style={{ background: "oklch(0.58 0.22 255 / 15%)", color: "oklch(0.70 0.20 255)" }}>
                  <Play size={12} fill="currentColor" />
                </span>
                Watch Demo
              </button>
            </div>

            {/* Trust signals */}
            <p className="text-sm text-muted-foreground">
              No credit card required · Free 14-day trial · Cancel anytime
            </p>

            {/* Social proof mini */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                {["bg-blue-500", "bg-indigo-500", "bg-violet-500", "bg-sky-500"].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full ${c} border-2`}
                    style={{ borderColor: "oklch(0.11 0.018 255)" }} />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="oklch(0.78 0.17 85)" color="oklch(0.78 0.17 85)" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                <span className="text-foreground font-medium">2,400+</span> shops trust FleetFlow
              </span>
            </div>
          </div>

          {/* Right: van image + mock dashboard */}
          <div className="relative flex flex-col items-center lg:items-end gap-6">
            {/* Van image */}
            <div className="relative w-full max-w-md">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{ background: "radial-gradient(ellipse at center, oklch(0.58 0.22 255 / 20%) 0%, transparent 70%)" }}
              />
              <Image
                src="/p1000ff.png"
                alt="FleetFlow branded shop van"
                width={560}
                height={360}
                className="relative w-full h-auto drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 0 32px oklch(0.58 0.22 255 / 30%))" }}
                priority
              />
            </div>

            {/* Floating mock dashboard card */}
            <div
              className="glass-card rounded-2xl p-5 w-full max-w-sm glow-blue-sm"
              style={{ border: "1px solid oklch(0.58 0.22 255 / 20%)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold">Today&apos;s Overview</span>
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "oklch(0.58 0.22 255 / 15%)", color: "oklch(0.75 0.18 255)" }}>
                  Live
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Open Orders", value: "14", trend: "+3" },
                  { label: "Revenue", value: "$8.4k", trend: "+12%" },
                  { label: "Appointments", value: "7", trend: "today" },
                ].map((stat) => (
                  <div key={stat.label}
                    className="rounded-xl p-3 flex flex-col gap-1"
                    style={{ background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 6%)" }}>
                    <span className="text-xs text-muted-foreground leading-tight">{stat.label}</span>
                    <span className="text-lg font-bold">{stat.value}</span>
                    <span className="text-xs" style={{ color: "oklch(0.72 0.18 145)" }}>{stat.trend}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { label: "2019 F-150 – Oil Change", status: "In Progress", color: "oklch(0.72 0.18 145)" },
                  { label: "2022 Accord – Brake Job", status: "Awaiting Parts", color: "oklch(0.78 0.17 85)" },
                  { label: "2020 Silverado – Diagnostics", status: "Ready", color: "oklch(0.75 0.18 255)" },
                ].map((wo) => (
                  <div key={wo.label} className="flex items-center justify-between py-1.5 px-2 rounded-lg"
                    style={{ background: "oklch(1 0 0 / 3%)" }}>
                    <span className="text-xs text-foreground/70 truncate">{wo.label}</span>
                    <span className="text-xs font-medium ml-2 shrink-0" style={{ color: wo.color }}>{wo.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: ClipboardList,
    title: "Work Orders",
    description: "Create, assign and track every repair job from estimate to invoice with full lifecycle visibility.",
  },
  {
    icon: Users,
    title: "Customer Management",
    description: "Complete customer profiles with vehicle history, service records, and communication logs.",
  },
  {
    icon: Package,
    title: "Inventory Control",
    description: "Real-time parts tracking with automatic low-stock alerts and supplier integrations.",
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Accept cards, create professional invoices, and track outstanding balances in one place.",
  },
  {
    icon: CalendarDays,
    title: "Online Scheduling",
    description: "Let customers book appointments online, 24/7. Your shop fills up while you sleep.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description: "Revenue tracking, technician performance metrics, and business insights at a glance.",
  },
];

function Features() {
  return (
    <section id="features" className="py-28 relative">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, oklch(0.50 0.22 255 / 6%) 0%, transparent 70%)" }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium mb-3" style={{ color: "oklch(0.70 0.20 255)" }}>
            PLATFORM CAPABILITIES
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Everything your shop needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            One platform to manage your entire operation. No more juggling spreadsheets, sticky notes, and disconnected tools.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 flex flex-col gap-4 group hover:border-primary/30 transition-all duration-300"
                style={{ border: "1px solid oklch(1 0 0 / 8%)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "oklch(0.58 0.22 255 / 15%)", color: "oklch(0.70 0.20 255)" }}
                >
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "2,400+", label: "Active Shops", icon: TrendingUp },
  { value: "$180M+", label: "Processed", icon: CreditCard },
  { value: "98%", label: "Uptime", icon: Shield },
  { value: "4.9★", label: "Rating", icon: Star },
];

function Stats() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="glass-card rounded-3xl px-8 py-12 text-center"
          style={{ border: "1px solid oklch(0.58 0.22 255 / 15%)" }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: "oklch(0.70 0.20 255)" }}>
            TRUSTED BY SHOPS ACROSS THE COUNTRY
          </p>
          <h2 className="text-3xl font-bold mb-12">The numbers speak for themselves</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.58 0.22 255 / 12%)", color: "oklch(0.70 0.20 255)" }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-gradient-blue">{s.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "Perfect for small shops getting started",
    features: [
      "1 service bay",
      "1 user account",
      "Work order management",
      "Customer profiles",
      "Basic invoicing",
      "Email support",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$149",
    period: "/mo",
    description: "Everything a growing shop needs",
    features: [
      "Unlimited bays",
      "Up to 5 users",
      "All Starter features",
      "Inventory management",
      "Online scheduling",
      "Payment processing",
      "Reports & analytics",
      "Priority support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Multi-location shops & franchises",
    features: [
      "Unlimited locations",
      "Unlimited users",
      "All Pro features",
      "Multi-location reporting",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    href: "/signup",
    highlight: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium mb-3" style={{ color: "oklch(0.70 0.20 255)" }}>
            PRICING
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            No hidden fees. No surprise overages. Just one clear price that grows with your shop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card rounded-2xl p-8 flex flex-col gap-6 relative ${
                plan.highlight ? "glow-blue" : ""
              }`}
              style={{
                border: plan.highlight
                  ? "1px solid oklch(0.58 0.22 255 / 40%)"
                  : "1px solid oklch(1 0 0 / 8%)",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, oklch(0.50 0.22 255), oklch(0.65 0.20 235))" }}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="flex items-end gap-1">
                <span className={`text-5xl font-bold ${plan.highlight ? "text-gradient-blue" : ""}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-muted-foreground mb-1.5 text-sm">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-3 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm">
                    <span
                      className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: "oklch(0.58 0.22 255 / 15%)", color: "oklch(0.70 0.20 255)" }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    <span className="text-foreground/80">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-center py-3 rounded-xl font-medium text-sm transition-all ${
                  plan.highlight
                    ? "gradient-blue text-white hover:opacity-90"
                    : "border border-white/10 text-foreground/80 hover:text-foreground hover:border-white/20"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="gradient-blue rounded-3xl px-8 py-16 text-center relative overflow-hidden"
          style={{ boxShadow: "0 0 60px oklch(0.58 0.22 255 / 30%)" }}
        >
          {/* Subtle texture overlay */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 20% 50%, oklch(1 0 0 / 8%) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 80% 30%, oklch(0 0 0 / 10%) 0%, transparent 50%)",
            }}
          />
          <div className="relative">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              Ready to transform your shop?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Join 2,400+ shops already using FleetFlow to streamline operations and grow revenue.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white font-semibold text-base transition-all hover:bg-white/90 hover:scale-[1.02]"
              style={{ color: "oklch(0.50 0.22 255)" }}
            >
              Start Your Free 14-Day Trial
            </Link>
            <p className="text-white/60 text-sm mt-4">No credit card required · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Documentation", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Status", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

function Footer() {
  return (
    <footer
      className="py-16"
      style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <Image src="/logo2.png" alt="FleetFlow" width={130} height={34} className="h-8 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Run Your Shop. Drive Success.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The modern shop management platform built for independent auto shops.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
        >
          <p className="text-sm text-muted-foreground">
            © 2026 FleetFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
