'use client'

import { useEffect, useState } from 'react'
import { FingerprintAuth } from '@/components/fingerprint-auth'
import { Dashboard } from '@/components/dashboard'
import { ScanButton } from '@/components/scan-button'
import { BottomNav } from '@/components/bottom-nav'
import { useBookkeepingStore } from '@/lib/store'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated, setAuthenticated } = useBookkeepingStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center animate-pulse">
          <span className="text-2xl font-bold text-black">B</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <FingerprintAuth onAuthenticated={() => setAuthenticated(true)} />
  }

  return (
    <main className="min-h-screen bg-background">
      <Dashboard />
      <ScanButton />
      <BottomNav />
    </main>
  )
}
