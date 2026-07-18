'use client'

import { useState } from 'react'
import { updateShopStatus, extendTrial, deleteShop, resendCredentials } from '@/app/actions/admin'
import { ChevronDown, Trash2, AlertTriangle, Mail } from 'lucide-react'

const statusOptions = [
  { value: 'active',    label: 'Set Active',    color: 'oklch(0.65 0.18 145)' },
  { value: 'trialing',  label: 'Set Trial',     color: 'oklch(0.65 0.18 255)' },
  { value: 'past_due',  label: 'Mark Past Due', color: 'oklch(0.75 0.18 60)'  },
  { value: 'suspended', label: 'Suspend',       color: 'oklch(0.65 0.18 25)'  },
]

const planOptions = ['starter', 'pro', 'enterprise']

export default function ShopActions({
  shopId,
  shopName,
  currentStatus,
  currentPlan,
}: {
  shopId: string
  shopName: string
  currentStatus: string
  currentPlan: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

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

  async function handleExtendTrial(days: number) {
    setLoading(true)
    setOpen(false)
    await extendTrial(shopId, days)
    setLoading(false)
  }

  async function handleResendCredentials() {
    setLoading(true)
    setOpen(false)
    const result = await resendCredentials(shopId)
    setResendMsg(result.success ?? result.error ?? 'Done')
    setTimeout(() => setResendMsg(''), 4000)
    setLoading(false)
  }

  async function handleDelete() {
    if (deleteInput !== 'DELETE') return
    setDeleting(true)
    await deleteShop(shopId)
    setDeleting(false)
    setDeleteOpen(false)
  }

  return (
    <>
      {resendMsg && (
        <div
          className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-xl text-sm font-medium text-white shadow-lg"
          style={{ background: resendMsg.startsWith('New credentials') ? 'oklch(0.35 0.12 145)' : 'oklch(0.4 0.18 25)', border: '1px solid oklch(1 0 0 / 15%)' }}
        >
          {resendMsg}
        </div>
      )}

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
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div
              className="fixed z-20 w-48 rounded-xl py-1 shadow-2xl"
              style={{
                background: 'oklch(0.16 0.018 255)',
                border: '1px solid oklch(1 0 0 / 12%)',
                // positioned via JS below — use absolute as fallback
              }}
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

              <p className="px-3 py-1.5 text-[10px] text-white/30 uppercase tracking-wider font-medium">Trial</p>
              {[14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => handleExtendTrial(days)}
                  className="w-full text-left px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Extend trial +{days} days
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

              <div className="my-1" style={{ borderTop: '1px solid oklch(1 0 0 / 7%)' }} />

              <button
                onClick={handleResendCredentials}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-white/5 transition-colors text-white/60 hover:text-white"
              >
                <Mail size={12} />
                Resend Credentials
              </button>

              <div className="my-1" style={{ borderTop: '1px solid oklch(1 0 0 / 7%)' }} />

              <button
                onClick={() => { setOpen(false); setDeleteOpen(true) }}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-red-500/10 transition-colors"
                style={{ color: 'oklch(0.65 0.18 25)' }}
              >
                <Trash2 size={12} />
                Delete Shop
              </button>
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'oklch(0 0 0 / 70%)' }}>
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: 'oklch(0.14 0.018 255)', border: '1px solid oklch(0.5 0.18 25 / 30%)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'oklch(0.5 0.18 25 / 15%)' }}
              >
                <AlertTriangle size={16} style={{ color: 'oklch(0.65 0.18 25)' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Delete Shop</p>
                <p className="text-xs text-white/40 mt-0.5">This cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              You are about to permanently delete <strong className="text-white">{shopName}</strong> and all of their data — customers, vehicles, work orders, and invoices.
            </p>

            <p className="text-xs text-white/40 mb-2">
              Type <span className="text-white font-mono font-bold">DELETE</span> to confirm
            </p>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              className="w-full rounded-lg px-3 py-2 text-sm text-white font-mono mb-4 outline-none"
              style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 10%)' }}
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteOpen(false); setDeleteInput('') }}
                className="flex-1 px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white transition-colors border"
                style={{ borderColor: 'oklch(1 0 0 / 10%)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteInput !== 'DELETE' || deleting}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
                style={{
                  background: deleteInput === 'DELETE' ? 'oklch(0.45 0.2 25)' : 'oklch(0.25 0.05 25)',
                  cursor: deleteInput === 'DELETE' ? 'pointer' : 'not-allowed',
                  opacity: deleteInput === 'DELETE' ? 1 : 0.5,
                }}
              >
                {deleting ? 'Deleting…' : 'Delete Shop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
