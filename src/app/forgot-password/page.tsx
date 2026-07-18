'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import { forgotPassword } from '@/app/actions/auth'

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPassword, null)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'oklch(0.11 0.018 255)' }}
    >
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to login
      </Link>

      <div className="w-full max-w-md">
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
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 8%)' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Reset your password</h2>
            <p className="text-sm text-white/50 mt-1">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 mb-5 p-3 rounded-lg text-sm text-red-400" style={{ background: 'oklch(0.5 0.2 25 / 10%)', border: '1px solid oklch(0.5 0.2 25 / 20%)' }}>
              <AlertCircle size={14} className="shrink-0" />
              {state.error}
            </div>
          )}

          {state?.success ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.35 0.12 145 / 20%)' }}>
                <CheckCircle size={22} className="text-emerald-400" />
              </div>
              <p className="text-white font-medium">{state.success}</p>
              <p className="text-sm text-white/40">It may take a minute to arrive. Check your spam folder if you don&apos;t see it.</p>
              <Link href="/login" className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Back to login
              </Link>
            </div>
          ) : (
            <form action={formAction} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm text-white/70">Email address</Label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="owner@myshop.com"
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
                {pending ? 'Sending…' : 'Send Reset Link'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
