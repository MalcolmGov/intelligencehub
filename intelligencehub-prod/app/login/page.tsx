'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl  = searchParams.get('callbackUrl') || '/'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: 'Malcolm Govender', email: 'malcolm@company.com', opco: 'South Africa' })

  const devLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { ...form, redirect: false, callbackUrl })
    if (res?.ok) router.push(callbackUrl)
    else setLoading(false)
  }

  const msLogin = () => {
    setLoading(true)
    signIn('microsoft-entra-id', { callbackUrl })
  }

  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen bg-[#020508] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_60%)]" />
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 via-blue-500 to-blue-800 flex items-center justify-center text-xs font-bold text-white">
              IH
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">IntelligenceHub</span>
          </div>
          <p className="text-slate-400 text-sm">AI & Automation Command Centre</p>
        </div>

        <div className="bg-[rgba(7,17,38,0.75)] backdrop-blur border border-[rgba(148,163,184,0.08)] rounded-2xl p-8 space-y-5">
          <div>
            <h1 className="text-xl font-semibold text-white mb-1">Welcome back</h1>
            <p className="text-slate-400 text-sm">Sign in to access the command centre.</p>
          </div>

          {/* Dev login form */}
          <form onSubmit={devLogin} className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-wider bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded">Dev mode</span>
            </div>
            {[
              { key: 'name',  label: 'Name',  placeholder: 'Malcolm Govender' },
              { key: 'email', label: 'Email', placeholder: 'malcolm@company.com' },
              { key: 'opco',  label: 'OpCo',  placeholder: 'South Africa' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
                <input
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-[#111827] border border-[rgba(148,163,184,0.08)] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in (Dev)'}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[rgba(148,163,184,0.08)]" />
            <span className="text-xs text-slate-600">or</span>
            <div className="flex-1 h-px bg-[rgba(148,163,184,0.08)]" />
          </div>

          {/* Microsoft SSO */}
          <button
            onClick={msLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#111827] border border-[rgba(148,163,184,0.08)] hover:bg-white/5 text-sm text-white font-medium transition-colors disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
              <rect x="1"  y="1"  width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1"  width="9" height="9" fill="#7FBA00"/>
              <rect x="1"  y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            Sign in with Microsoft
          </button>

          <p className="text-slate-600 text-xs text-center">
            Access restricted to authorised employees.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
