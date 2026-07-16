'use client'

import { useState } from 'react'
import { updateShopStatus } from '@/app/actions/admin'
import { ChevronDown } from 'lucide-react'

const statusOptions = [
  { value: 'active',    label: 'Set Active',    color: 'oklch(0.65 0.18 145)' },
  { value: 'trialing',  label: 'Set Trial',     color: 'oklch(0.65 0.18 255)' },
  { value: 'past_due',  label: 'Mark Past Due', color: 'oklch(0.75 0.18 60)'  },
  { value: 'suspended', label: 'Suspend',       color: 'oklch(0.65 0.18 25)'  },
]

const planOptions = ['starter', 'pro', 'enterprise']

export default function ShopActions({
  shopId,
  currentStatus,
  currentPlan,
}: {
  shopId: string
  currentStatus: string
  currentPlan: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleStatus(status: string) {
    setLoading(true)
    setOpen(false)
    await updateShopStatus(shopId, status)
    setLoading(false)
  }

  async function handlePlan(plan: string) {
    setLoading(true)
    setOpen(false)
    await updateShopStatus(shopId, currentStatus, plan)
    setLoading(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white transition-colors"
        style={{ background: 'oklch(1 0 0 / 6%)', border: '1px solid oklch(1 0 0 / 8%)' }}
      >
        {loading ? 'Saving…' : 'Manage'}
        <ChevronDown size={12} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 top-8 z-20 w-44 rounded-xl py-1 shadow-xl"
            style={{ background: 'oklch(0.16 0.018 255)', border: '1px solid oklch(1 0 0 / 12%)' }}
          >
            <p className="px-3 py-1.5 text-[10px] text-white/30 uppercase tracking-wider font-medium">Status</p>
            {statusOptions.filter(o => o.value !== currentStatus).map(({ value, label, color }) => (
              <button
                key={value}
                onClick={() => handleStatus(value)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition-colors"
                style={{ color }}
              >
                {label}
              </button>
            ))}

            <div className="my-1" style={{ borderTop: '1px solid oklch(1 0 0 / 7%)' }} />

            <p className="px-3 py-1.5 text-[10px] text-white/30 uppercase tracking-wider font-medium">Plan</p>
            {planOptions.filter(p => p !== currentPlan).map(plan => (
              <button
                key={plan}
                onClick={() => handlePlan(plan)}
                className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors capitalize"
              >
                Switch to {plan}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
