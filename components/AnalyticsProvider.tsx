'use client'

import { useEffect } from 'react'
import { initScrollTracking } from '@/lib/analytics'

export function AnalyticsProvider() {
  useEffect(() => initScrollTracking(), [])
  return null
}
