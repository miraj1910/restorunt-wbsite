'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/admin/auth'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password')
      return
    }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/admin')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  const handleForgot = () => {
    alert('Coming Soon')
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-bronze/5 rounded-full blur-[100px]" />
      </div>

      <div
        className="relative w-full max-w-md section-panel rounded-3xl p-8 md:p-10 animate-[fadeInScale_0.5s_ease-out]"
        style={{ animation: 'fadeInScale 0.5s ease-out' }}
      >
        <div className="text-center mb-8">
          <div className="font-display text-2xl md:text-3xl tracking-[0.16em] text-mist mb-1">
            BISTRO AURELIA
          </div>
          <div className="text-mist/40 text-xs uppercase tracking-[0.2em]">Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm text-mist/70 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@bistroaurelia.com"
              autoComplete="email"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-mist placeholder:text-mist/20 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-mist/70 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-mist placeholder:text-mist/20 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber/30 focus:ring-offset-0"
              />
              <span className="text-mist/60">Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgot}
              className="text-amber/70 hover:text-amber transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-3d w-full" disabled={loading}>
            <span className="btn-3d-layer w-full justify-center text-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </span>
            <span className="btn-3d-depth" />
          </button>
        </form>

        <div className="mt-6 text-center text-mist/30 text-xs">
          Default: admin@bistroaurelia.com / admin123
        </div>
      </div>
    </div>
  )
}
