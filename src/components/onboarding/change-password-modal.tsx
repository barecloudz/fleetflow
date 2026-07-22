'use client'

import { useActionState, useEffect } from 'react'
import { Lock, ShieldCheck, AlertCircle } from 'lucide-react'
import { changePassword } from '@/app/actions/auth'

export default function ChangePasswordModal() {
  const [state, formAction, pending] = useActionState(changePassword, null)

  // On success reload so the layout re-checks the flag and closes the modal
  useEffect(() => {
    if (state?.success) window.location.reload()
  }, [state?.success])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 75%)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: 'oklch(0.13 0.022 255)', border: '1px solid oklch(1 0 0 / 10%)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'oklch(0.50 0.22 255 / 15%)', border: '1px solid oklch(0.58 0.22 255 / 25%)' }}
          >
            <ShieldCheck className="size-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Set your password</h2>
            <p className="text-xs text-white/40 mt-0.5">You were given a temporary password. Please set a permanent one before continuing.</p>
          </div>
        </div>

        {state?.error && (
          <div
            className="flex items-center gap-2 mb-5 p-3 rounded-lg text-sm text-red-400"
            style={{ background: 'oklch(0.5 0.2 25 / 10%)', border: '1px solid oklch(0.5 0.2 25 / 20%)' }}
          >
            <AlertCircle size={14} className="shrink-0" />
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wide">New Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/25 outline-none"
                style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 10%)' }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/60 uppercase tracking-wide">Confirm Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                name="confirm"
                type="password"
                required
                minLength={8}
                placeholder="Repeat your password"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/25 outline-none"
                style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 10%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2 transition-opacity disabled:opacity-60"
            style={{ background: 'oklch(0.55 0.22 255)' }}
          >
            {pending ? 'Saving…' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
