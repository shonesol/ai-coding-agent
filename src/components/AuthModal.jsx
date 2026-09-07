import { useState } from 'react'
import { signUp, login } from '../firebase'
import { X, Sparkles } from 'lucide-react'

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password, displayName)
      } else {
        await login(email, password)
      }
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, ''))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-card border border-beige-500/15">
        {/* Gradient header */}
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 px-8 pt-8 pb-6 border-b border-beige-500/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-beige-400/50 hover:text-beige-200 transition"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-500 to-beige-500 flex items-center justify-center shadow-glow">
              <Sparkles size={22} className="text-navy-950" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-beige-100">
                {mode === 'login' ? 'Welcome back' : 'Join Aether'}
              </h2>
              <p className="text-sm text-beige-400/70">
                {mode === 'login' ? 'Continue your conversations' : 'Start exploring without limits'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-navy-900 px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-beige-400/80 mb-1.5 tracking-wide uppercase">
                  Display name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full bg-navy-800 border border-beige-500/15 rounded-xl px-4 py-2.5 text-beige-100
                    placeholder-beige-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/30 transition"
                  placeholder="Alex"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-beige-400/80 mb-1.5 tracking-wide uppercase">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-navy-800 border border-beige-500/15 rounded-xl px-4 py-2.5 text-beige-100
                  placeholder-beige-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/30 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-beige-400/80 mb-1.5 tracking-wide uppercase">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-navy-800 border border-beige-500/15 rounded-xl px-4 py-2.5 text-beige-100
                  placeholder-beige-500/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/30 transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-red-300 text-sm bg-red-950/40 border border-red-500/20 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl font-semibold text-navy-950
                bg-gradient-to-r from-gold-500 to-beige-500
                hover:from-gold-400 hover:to-beige-400
                disabled:opacity-50 transition btn-glow"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-beige-400/60">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button onClick={() => setMode('signup')} className="text-gold-400 hover:text-gold-300 font-medium">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-gold-400 hover:text-gold-300 font-medium">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
