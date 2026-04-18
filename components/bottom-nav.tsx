'use client'

import { Home, PieChart, FileText, User } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { icon: Home, label: 'Home', id: 'home' },
  { icon: PieChart, label: 'Analytics', id: 'analytics' },
  { icon: FileText, label: 'Reports', id: 'reports' },
  { icon: User, label: 'Account', id: 'account' },
]

interface BottomNavProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  const [active, setActive] = useState(activeTab)

  const handleTabClick = (id: string) => {
    setActive(id)
    onTabChange?.(id)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border px-6 py-4 z-40">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? 'scale-110' : 'opacity-50 hover:opacity-75'
              }`}
              aria-label={item.label}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400'
                    : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? 'text-black' : 'text-white'}`}
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isActive ? 'text-white' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
