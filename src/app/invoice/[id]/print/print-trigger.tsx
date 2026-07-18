'use client'

import { useEffect } from 'react'

export default function PrintTrigger() {
  useEffect(() => {
    // Small delay to let images/fonts load
    const t = setTimeout(() => window.print(), 600)
    return () => clearTimeout(t)
  }, [])

  return null
}
