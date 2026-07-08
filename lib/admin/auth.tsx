'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AdminUser } from './types'

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const MOCK_USER: AdminUser = {
  id: 'admin-001',
  email: 'admin@bistroaurelia.com',
  name: 'Marcus Aurelius',
  role: 'manager',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('admin-auth')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch { localStorage.removeItem('admin-auth') }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 600))
    if (email === 'admin@bistroaurelia.com' && password === 'admin123') {
      const u = { ...MOCK_USER }
      localStorage.setItem('admin-auth', JSON.stringify(u))
      setUser(u)
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('admin-auth')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function useRequireAuth() {
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      router.replace('/admin/login')
    }
  }, [auth.loading, auth.isAuthenticated, router])
  return auth
}
