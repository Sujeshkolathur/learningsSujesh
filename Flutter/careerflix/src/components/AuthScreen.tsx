import { FormEvent, useState } from 'react'
import { signIn, signUp } from '../lib/authStore'
import { isFirebaseConfigured } from '../lib/firebase'
import type { CareerUser } from '../types/auth'
import { roleLabel } from '../types/auth'

type Mode = 'signin' | 'signup'

export function AuthScreen({ onAuthed }: { onAuthed: (user: CareerUser) => void }) {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const user =
        mode === 'signup'
          ? await signUp(email, password, displayName)
          : await signIn(email, password)
      onAuthed(user)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setError(message.replace('Firebase:', '').trim())
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="gate">
      <div className="gate-inner auth-panel">
        <p className="brand gate-brand">CAREERFLIX</p>
        <h1 className="gate-title">{mode === 'signin' ? 'Sign in' : 'Create account'}</h1>
        <p className="auth-lede">
          Candidates build their own profile. Hiring managers and admins browse the talent list.
        </p>

        <form className="field-grid auth-form" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <label className="field">
              <span>Full name</span>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          {error && (
            <div className="alert" role="alert" style={{ margin: 0 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button type="button" className="linkish" onClick={() => setMode('signup')}>
                Create a candidate account
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button type="button" className="linkish" onClick={() => setMode('signin')}>
                Sign in
              </button>
            </>
          )}
        </p>

        <ul className="hint-list">
          <li>
            Default role: <strong>{roleLabel('candidate')}</strong> (add your own profile only)
          </li>
          <li>
            Staff emails are configured in <code>.env</code> (
            <code>VITE_ADMIN_EMAILS</code> / <code>VITE_HIRING_MANAGER_EMAILS</code>)
          </li>
          <li>Storage: {isFirebaseConfigured() ? 'Firebase Auth + Firestore' : 'Local demo mode'}</li>
        </ul>
      </div>
    </main>
  )
}
