'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Lock, AlertCircle } from 'lucide-react'
import { resetPassword } from '@/app/actions/auth'

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPassword, null)

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'oklch(0.11 0.018 255)' }}
    >
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
            <h2 className="text-xl font-bold text-white">Set a new password</h2>
            <p className="text-sm text-white/50 mt-1">Choose a strong password for your account.</p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2 mb-5 p-3 rounded-lg text-sm text-red-400" style={{ background: 'oklch(0.5 0.2 25 / 10%)', border: '1px solid oklch(0.5 0.2 25 / 20%)' }}>
              <AlertCircle size={14} className="shrink-0" />
              {state.error}
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm text-white/70">New password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm" className="text-sm text-white/70">Confirm password</Label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="Repeat your password"
                  required
                  minLength={8}
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
              {pending ? 'Updating…' : 'Update Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
