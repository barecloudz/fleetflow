import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, FileText, CreditCard, Calendar } from "lucide-react";

const navLinks = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/orders", label: "My Orders", icon: FileText },
  { href: "/portal/invoices", label: "Invoices", icon: CreditCard },
  { href: "/portal/appointments", label: "Appointments", icon: Calendar },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
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

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
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

          {/* Customer + Logout */}
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
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/6 transition-all whitespace-nowrap"
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
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
