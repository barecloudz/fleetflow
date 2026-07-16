'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail, Lock, User, Building2, ArrowLeft, AlertCircle } from 'lucide-react'
import { signup } from '@/app/actions/auth'

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, null)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'oklch(0.11 0.018 255)' }}
    >
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: 'oklch(0.50 0.22 255 / 20%)',
              border: '1px solid oklch(0.58 0.22 255 / 30%)',
            }}
          >
            <span className="text-2xl font-black text-white">FF</span>
          </div>
          <h1 className="text-2xl font-bold text-white">FleetFlow</h1>
          <p className="text-xs text-white/30 mt-1 tracking-widest uppercase">Get Started Free</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 8%)' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Create your shop</h2>
            <p className="text-sm text-white/50 mt-1">Start your free trial — no credit card required</p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 mb-5 p-3 rounded-lg text-sm text-red-400" style={{ background: 'oklch(0.5 0.2 25 / 10%)', border: '1px solid oklch(0.5 0.2 25 / 20%)' }}>
              <AlertCircle size={14} className="shrink-0" />
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-4">
            {/* Shop Name */}
            <div className="space-y-1.5">
              <Label htmlFor="shop_name" className="text-sm text-white/70">Shop name</Label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="shop_name"
                  name="shop_name"
                  type="text"
                  placeholder="Mike's Auto Repair"
                  required
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-sm text-white/70">First name</Label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    id="first_name"
                    name="first_name"
                    type="text"
                    placeholder="Mike"
                    required
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-sm text-white/70">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Johnson"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-white/70">Email address</Label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="mike@mikes-auto.com"
                  required
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-white/70">Password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={pending}
              className="w-full mt-2 text-white font-semibold py-2.5 rounded-xl border-0"
              style={{ background: 'oklch(0.55 0.22 255)' }}
            >
              {pending ? 'Creating your shop…' : 'Create Shop & Start Free Trial'}
            </Button>
          </form>

          <p className="text-xs text-white/30 text-center mt-4">
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>

          <div className="mt-5 pt-5 border-t border-white/6 text-center">
            <p className="text-xs text-white/35">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
