"use client";

import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function PortalLoginPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "oklch(0.11 0.018 255)" }}
    >
      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 glow-blue-sm"
            style={{ background: "oklch(0.50 0.22 255 / 20%)", border: "1px solid oklch(0.58 0.22 255 / 30%)" }}
          >
            <Image src="/logo.png" alt="FleetFlow" width={40} height={40} className="rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-blue">FleetFlow</h1>
          <p className="text-xs text-white/30 mt-1 tracking-widest uppercase">Customer Portal</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8" style={{ border: "1px solid oklch(1 0 0 / 8%)" }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-white/50 mt-1">Sign in to your customer portal</p>
          </div>

          <form className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-white/70">Email address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="sarah@example.com"
                  defaultValue="sarah@example.com"
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-white/70">Password</Label>
                <button type="button" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password"
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Sign In Button */}
            <Link href="/portal/dashboard" className="block mt-6">
              <Button
                type="button"
                className="w-full gradient-blue text-white font-semibold py-2.5 rounded-xl glow-blue-sm hover:opacity-90 transition-opacity border-0"
              >
                Sign In
              </Button>
            </Link>
          </form>

          <div className="mt-6 pt-5 border-t border-white/6 text-center">
            <p className="text-xs text-white/35">
              Don&apos;t have an account?{" "}
              <span className="text-white/55">Contact your shop</span>{" "}
              to get set up.
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          Secured by FleetFlow · 256-bit encryption
        </p>
      </div>
    </div>
  );
}
