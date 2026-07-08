"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, FileText, CreditCard, Calendar, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/orders", label: "My Orders", icon: FileText },
  { href: "/portal/invoices", label: "Invoices", icon: CreditCard },
  { href: "/portal/appointments", label: "Appointments", icon: Calendar },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.11 0.018 255)" }}>
      {/* Top Nav */}
      <header className="glass-card border-b border-white/8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/portal/dashboard" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="FleetFlow" width={32} height={32} className="rounded-lg" />
            <span className="text-lg font-bold text-gradient-blue">FleetFlow</span>
          </Link>

          {/* Nav Links — hidden on mobile */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/6 transition-all duration-150"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side: avatar + logout + hamburger */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-8 w-8 border border-white/10">
                <AvatarFallback className="text-xs font-semibold" style={{ background: "oklch(0.50 0.22 255 / 30%)", color: "oklch(0.80 0.15 220)" }}>
                  SC
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white/80 hidden sm:inline">Sarah Chen</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </Link>

            {/* Hamburger — visible only on mobile */}
            <button
              type="button"
              className="sm:hidden flex items-center justify-center size-8 rounded-lg text-white/60 hover:text-white hover:bg-white/8 transition-all"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="sm:hidden border-t border-white/8 px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all"
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 text-center text-xs text-white/25">
        © 2026 FleetFlow · Customer Portal · <Link href="/" className="hover:text-white/50 transition-colors">Back to Home</Link>
      </footer>
    </div>
  );
}
