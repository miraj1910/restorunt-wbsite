'use client'

import { useAuth } from '@/lib/admin/auth'

interface AdminTopbarProps {
  onMenuToggle: () => void
  title: string
}

export default function AdminTopbar({ onMenuToggle, title }: AdminTopbarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 lg:pl-64">
      <div className="h-full flex items-center justify-between px-4 md:px-6 glass-nav">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-mist/70 hover:text-mist hover:bg-white/5 transition-all"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <nav className="flex items-center gap-1.5 text-sm">
            <span className="text-mist/40">Admin</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mist/30">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-amber font-medium">{title}</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-mist/30" />
            <input
              type="text"
              placeholder="Search..."
              className="w-40 md:w-56 bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
            />
          </div>

          <button
            type="button"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-mist/60 hover:text-mist hover:bg-white/5 transition-all"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber" />
          </button>

          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-amber/20 flex items-center justify-center text-amber text-xs font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden md:block text-sm text-mist">{user?.name || 'Admin'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mist/40">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 w-48 py-2 rounded-xl section-panel opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
              <div className="px-4 py-2 border-b border-white/10">
                <div className="text-mist text-sm font-medium">{user?.name}</div>
                <div className="text-mist/40 text-xs">{user?.email}</div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-mist/60 hover:text-red-400 hover:bg-red-400/5 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
