import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signIn, signUp, hasFirebaseConfig } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'signin') await signIn(email, password)
      else await signUp(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.message === 'demo-mode'
          ? 'Firebase is not configured in this deployment — the workspace is a local demonstration only.'
          : 'Could not sign in. Check your email and password and try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16 sm:py-24">
      <h1 className="font-serif text-2xl mb-2">
        {mode === 'signin' ? 'Sign in' : 'Create an account'}
      </h1>
      <p className="text-sm text-ink-faint mb-6">
        Optional — used only to save experiment history to your personal
        workspace. The recall lab, BDH-CQ module, limitations, and sources
        are fully public and don't require an account.
      </p>

      {!hasFirebaseConfig && (
        <div className="mb-4 p-3 bg-linear-soft border border-linear/30 rounded-sm text-sm text-linear-deep">
          No Firebase credentials configured — running in local demonstration
          mode. Sign-in is disabled.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-paper-line rounded-sm bg-white text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-paper-line rounded-sm bg-white text-sm"
          />
        </div>
        {error && <p className="text-sm text-signal-error">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !hasFirebaseConfig}
          className="w-full py-2.5 bg-ink text-paper rounded-sm text-sm font-medium disabled:opacity-40"
        >
          {submitting ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <button
        onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
        className="text-sm text-ink-faint mt-4 underline"
      >
        {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </button>
    </div>
  )
}
