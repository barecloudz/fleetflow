'use client'

import { useActionState, useState } from 'react'
import { createShop } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, AlertCircle, CheckCircle } from 'lucide-react'

export default function CreateShopForm() {
  const [open, setOpen] = useState(false)
  const [state, formAction, pending] = useActionState(createShop, null)

  // Close modal on success after a moment
  if (state?.success && open) {
    setTimeout(() => setOpen(false), 1200)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-white font-semibold rounded-xl border-0"
        style={{ background: 'oklch(0.55 0.22 255)' }}
      >
        <Plus size={15} />
        Create Shop
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 60%)' }}>
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(1 0 0 / 10%)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Create New Shop</h2>
              <button onClick={() => setOpen(false)} className="text-white/30 hover:text-white/70 transition-colors">
                <X size={18} />
              </button>
            </div>

            {state?.error && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg text-sm text-red-400" style={{ background: 'oklch(0.5 0.2 25 / 10%)', border: '1px solid oklch(0.5 0.2 25 / 20%)' }}>
                <AlertCircle size={14} className="shrink-0" />
                {state.error}
              </div>
            )}

            {state?.success && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg text-sm text-green-400" style={{ background: 'oklch(0.35 0.1 145 / 20%)', border: '1px solid oklch(0.5 0.15 145 / 30%)' }}>
                <CheckCircle size={14} className="shrink-0" />
                {state.success}
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-white/70">Shop name *</Label>
                <Input name="name" required placeholder="Mike's Auto Repair" className="bg-white/5 border-white/10 text-white placeholder:text-white/25" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-white/70">Email</Label>
                <Input name="email" type="email" placeholder="owner@shop.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/25" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-white/70">Phone</Label>
                <Input name="phone" type="tel" placeholder="(555) 000-0000" className="bg-white/5 border-white/10 text-white placeholder:text-white/25" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-sm text-white/70">Plan</Label>
                  <select
                    name="plan"
                    defaultValue="starter"
                    className="w-full rounded-lg px-3 py-2 text-sm text-white border"
                    style={{ background: 'oklch(1 0 0 / 5%)', borderColor: 'oklch(1 0 0 / 10%)' }}
                  >
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-white/70">Access</Label>
                  <select
                    name="status"
                    defaultValue="active"
                    className="w-full rounded-lg px-3 py-2 text-sm text-white border"
                    style={{ background: 'oklch(1 0 0 / 5%)', borderColor: 'oklch(1 0 0 / 10%)' }}
                  >
                    <option value="active">Active (free access)</option>
                    <option value="trialing">Trial</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border text-white/60 hover:text-white bg-transparent"
                  style={{ borderColor: 'oklch(1 0 0 / 10%)' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={pending}
                  className="flex-1 text-white font-semibold border-0"
                  style={{ background: 'oklch(0.55 0.22 255)' }}
                >
                  {pending ? 'Creating…' : 'Create Shop'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
