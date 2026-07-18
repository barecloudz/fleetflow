'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardList, Users, Car, Package, CreditCard,
  CalendarDays, X, ChevronRight, ChevronLeft, Zap, Check,
} from 'lucide-react'

const STORAGE_KEY = 'fleetflow_onboarding_v1'

const steps = [
  {
    icon: Zap,
    color: 'oklch(0.65 0.18 255)',
    bg: 'oklch(0.55 0.22 255 / 12%)',
    title: 'Welcome to FleetFlow',
    description: "You're all set up. This quick tour will show you the key parts of your shop management system.",
    tip: null,
    href: null,
    cta: "Let's go",
  },
  {
    icon: ClipboardList,
    color: 'oklch(0.70 0.18 255)',
    bg: 'oklch(0.55 0.22 255 / 12%)',
    title: 'Work Orders',
    description: 'Create a work order for every job that comes in. Track status, assign to technicians, and convert to invoices when done.',
    tip: 'Start here for every new repair job.',
    href: '/work-orders',
    cta: 'Go to Work Orders',
  },
  {
    icon: Users,
    color: 'oklch(0.70 0.18 145)',
    bg: 'oklch(0.55 0.18 145 / 12%)',
    title: 'Customers & Vehicles',
    description: 'Add your customers and their vehicles. Every vehicle links to a customer, and all service history is tracked automatically.',
    tip: 'Add a customer first, then add their vehicle.',
    href: '/customers',
    cta: 'Go to Customers',
  },
  {
    icon: Package,
    color: 'oklch(0.70 0.18 60)',
    bg: 'oklch(0.55 0.18 60 / 12%)',
    title: 'Inventory',
    description: "Keep track of your parts and supplies. Set reorder points and you'll get alerts when stock runs low.",
    tip: 'Set a reorder point so you never run out.',
    href: '/inventory',
    cta: 'Go to Inventory',
  },
  {
    icon: CreditCard,
    color: 'oklch(0.72 0.18 310)',
    bg: 'oklch(0.55 0.18 310 / 12%)',
    title: 'Payments & Invoices',
    description: 'Generate invoices from completed work orders. Track what has been paid, what is pending, and what is overdue.',
    tip: 'Mark invoices paid when you collect payment.',
    href: '/payments',
    cta: 'Go to Payments',
  },
  {
    icon: CalendarDays,
    color: 'oklch(0.70 0.18 200)',
    bg: 'oklch(0.55 0.18 200 / 12%)',
    title: 'Calendar & Scheduling',
    description: 'Schedule appointments for drop-offs, pickups, and estimates. Your whole team sees the same calendar.',
    tip: 'Book appointments in advance to stay organized.',
    href: '/calendar',
    cta: 'Go to Calendar',
  },
  {
    icon: Check,
    color: 'oklch(0.72 0.18 145)',
    bg: 'oklch(0.45 0.18 145 / 12%)',
    title: "You're ready to go",
    description: "That covers the essentials. You can always re-open this guide from the Help button in your dashboard.",
    tip: null,
    href: null,
    cta: 'Start using FleetFlow',
  },
]

export default function OnboardingWizard() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [exiting, setExiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem(STORAGE_KEY)) {
      // Small delay so the dashboard loads first
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    setExiting(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'done')
      setVisible(false)
      setExiting(false)
    }, 250)
  }

  function next() {
    if (step < steps.length - 1) {
      setStep(s => s + 1)
    } else {
      dismiss()
    }
  }

  function prev() {
    if (step > 0) setStep(s => s - 1)
  }

  function goToPage() {
    const href = steps[step].href
    if (href) {
      dismiss()
      router.push(href)
    } else {
      next()
    }
  }

  if (!visible) return null

  const current = steps[step]
  const Icon = current.icon
  const isFirst = step === 0
  const isLast = step === steps.length - 1
  const progress = ((step) / (steps.length - 1)) * 100

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{
        background: 'oklch(0 0 0 / 55%)',
        backdropFilter: 'blur(4px)',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 250ms ease',
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'oklch(0.13 0.02 255)',
          border: '1px solid oklch(1 0 0 / 10%)',
          boxShadow: '0 24px 64px oklch(0 0 0 / 50%)',
          transform: exiting ? 'translateY(16px)' : 'translateY(0)',
          transition: 'transform 250ms ease',
        }}
      >
        {/* Progress bar */}
        <div style={{ height: '3px', background: 'oklch(1 0 0 / 6%)' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'oklch(0.58 0.22 255)',
              transition: 'width 300ms ease',
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-1">
          <span className="text-xs text-white/30 font-medium">
            Step {step + 1} of {steps.length}
          </span>
          <button
            onClick={dismiss}
            className="p-1.5 rounded-lg text-white/25 hover:text-white/60 transition-colors"
            title="Skip tutorial"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 pt-3">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: current.bg, border: `1px solid ${current.color}30` }}
          >
            <Icon size={22} style={{ color: current.color }} />
          </div>

          <h2 className="text-lg font-bold text-white mb-2">{current.title}</h2>
          <p className="text-sm text-white/55 leading-relaxed mb-4">{current.description}</p>

          {current.tip && (
            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg mb-4 text-xs"
              style={{ background: 'oklch(1 0 0 / 4%)', border: '1px solid oklch(1 0 0 / 7%)' }}
            >
              <span className="text-yellow-400 mt-0.5 shrink-0">💡</span>
              <span className="text-white/50">{current.tip}</span>
            </div>
          )}

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 mb-5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === step ? '16px' : '6px',
                  height: '6px',
                  background: i === step
                    ? 'oklch(0.58 0.22 255)'
                    : i < step
                      ? 'oklch(0.58 0.22 255 / 40%)'
                      : 'oklch(1 0 0 / 12%)',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5">
            {!isFirst && (
              <button
                onClick={prev}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors border"
                style={{ borderColor: 'oklch(1 0 0 / 10%)' }}
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}

            {current.href && !isLast && (
              <button
                onClick={goToPage}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors border"
                style={{ borderColor: 'oklch(1 0 0 / 10%)' }}
              >
                {current.cta}
                <ChevronRight size={14} />
              </button>
            )}

            <button
              onClick={isLast ? dismiss : next}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'oklch(0.55 0.22 255)' }}
            >
              {isLast ? (
                <>
                  <Check size={14} />
                  {current.cta}
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>

          <button
            onClick={dismiss}
            className="w-full mt-2.5 text-xs text-white/20 hover:text-white/40 transition-colors py-1"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
