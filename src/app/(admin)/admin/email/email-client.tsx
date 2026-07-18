'use client'

import { useState, useActionState } from 'react'
import { broadcastEmail } from '@/app/actions/admin'
import { Send, Users, CheckCircle, AlertCircle } from 'lucide-react'

const SEGMENTS = [
  { value: 'all',       label: 'All shops',          desc: 'Every shop on the platform' },
  { value: 'active',    label: 'Active shops',        desc: 'Paying subscribers only' },
  { value: 'trialing',  label: 'Trial shops',         desc: 'Shops still on free trial' },
  { value: 'past_due',  label: 'Past due shops',      desc: 'Shops with overdue payment' },
]

export default function EmailClient() {
  const [segment, setSegment] = useState('all')
  const [state, formAction, pending] = useActionState(broadcastEmail, null)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Email Broadcast</h1>
        <p className="text-sm text-white/40 mt-1">Send an announcement to your shops</p>
      </div>

      {state?.success && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl text-sm text-emerald-400" style={{ background: 'oklch(0.35 0.1 145 / 15%)', border: '1px solid oklch(0.5 0.15 145 / 30%)' }}>
          <CheckCircle size={16} className="shrink-0" />
          {state.success}
        </div>
      )}

      {state?.error && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl text-sm text-red-400" style={{ background: 'oklch(0.4 0.15 25 / 15%)', border: '1px solid oklch(0.5 0.18 25 / 30%)' }}>
          <AlertCircle size={16} className="shrink-0" />
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        {/* Segment picker */}
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-3">Send To</label>
          <div className="grid grid-cols-2 gap-2">
            {SEGMENTS.map(s => (
              <label
                key={s.value}
                className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: segment === s.value ? 'oklch(0.50 0.22 255 / 12%)' : 'oklch(1 0 0 / 4%)',
                  border: `1px solid ${segment === s.value ? 'oklch(0.58 0.22 255 / 40%)' : 'oklch(1 0 0 / 8%)'}`,
                }}
              >
                <input
                  type="radio"
                  name="segment"
                  value={s.value}
                  checked={segment === s.value}
                  onChange={() => setSegment(s.value)}
                  className="mt-0.5 accent-blue-500"
                />
                <div>
                  <div className="text-sm font-medium text-white">{s.label}</div>
                  <div className="text-xs text-white/40 mt-0.5">{s.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Subject</label>
          <input
            name="subject"
            required
            placeholder="e.g. Scheduled maintenance tonight at 11pm EST"
            className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/25 outline-none"
            style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 10%)' }}
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Message</label>
          <textarea
            name="body"
            required
            rows={8}
            placeholder="Write your message here. Keep it clear and direct — shop owners are busy people."
            className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/25 outline-none resize-none"
            style={{ background: 'oklch(1 0 0 / 5%)', border: '1px solid oklch(1 0 0 / 10%)' }}
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ background: 'oklch(0.55 0.22 255)' }}
        >
          {pending ? (
            <>
              <Users size={15} className="animate-pulse" />
              Sending…
            </>
          ) : (
            <>
              <Send size={15} />
              Send Broadcast
            </>
          )}
        </button>
      </form>
    </div>
  )
}
