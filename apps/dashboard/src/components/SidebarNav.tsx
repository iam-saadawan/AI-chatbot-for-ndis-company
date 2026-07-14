'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, LayoutDashboard, Users, Settings } from 'lucide-react'

export function SidebarNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Conversations', icon: MessageSquare },
    { href: '/analytics', label: 'Analytics', icon: LayoutDashboard },
    { href: '/patients', label: 'Patients', icon: Users },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map((link) => {
        const Icon = link.icon
        // Active if current path exactly matches href (or starts with it for sub-pages, but conversations is '/')
        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)) || (link.href === '/' && pathname.startsWith('/conversations'))

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Icon className="w-5 h-5" />
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
