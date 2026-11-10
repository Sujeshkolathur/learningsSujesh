import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { AuthSession } from './types/auth'
import type { AvailabilityOffer, AvailabilityResult } from './types/availability'
import type {
  ReservationListResponse,
  ReservationResponse,
  ReservationStatusFilter,
} from './types/reservation'
import './App.css'

const PROPERTY_ID = 'DEMO-01'
const AUTH_STORAGE_KEY = 'istay.auth'

function loadStoredAuth(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthSession) : null
  } catch {
    return null
  }
}

function defaultCheckIn(): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
}

function defaultCheckOut(): string {
  const d = new Date()
  d.setDate(d.getDate() + 3)
  return d.toISOString().slice(0, 10)
}

function newIdempotencyKey(): string {
  return crypto.randomUUID()
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value))
}

function formatStayLabel(checkIn: string, checkOut: string, nights: number): string {
  const inDate = new Date(`${checkIn}T00:00:00`)
  const outDate = new Date(`${checkOut}T00:00:00`)
  const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt.format(inDate)} → ${fmt.format(outDate)} · ${nights} night${nights === 1 ? '' : 's'}`
}

function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return 0
  }
  const a = new Date(`${checkIn}T00:00:00`).getTime()
  const b = new Date(`${checkOut}T00:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}

function App() {
  const [auth, setAuth] = useState<AuthSession | null>(() => loadStoredAuth())
  const [username, setUsername] = useState('front_desk')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)

  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)
  const [guestName, setGuestName] = useState('Demo Guest')
  const [guestEmail, setGuestEmail] = useState('guest@example.com')
  const [result, setResult] = useState<AvailabilityResult | null>(null)
  const [confirmation, setConfirmation] = useState<ReservationResponse | null>(null)
  const [reservations, setReservations] = useState<ReservationResponse[]>([])
  const [reservationFilter, setReservationFilter] = useState<ReservationStatusFilter>('ALL')
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [bookingRoomTypeId, setBookingRoomTypeId] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const canBook = auth?.roles.includes('FRONT_DESK') ?? false
  const nightsPreview = nightsBetween(checkIn, checkOut)
  const datesInvalid = Boolean(checkIn && checkOut && checkOut <= checkIn)
  const canSubmit = Boolean(checkIn && checkOut && !datesInvalid)
  const guestReady = guestName.trim().length > 1 && guestEmail.includes('@')

  const roleLabel = useMemo(() => auth?.roles.join(' · ') ?? '', [auth])

  function authHeaders(extra?: HeadersInit): HeadersInit {
    if (!auth) {
      return { ...extra }
    }
    return {
      ...extra,
      Authorization: `${auth.tokenType} ${auth.accessToken}`,
    }
  }

  const loadReservations = useCallback(
    async (session: AuthSession, filter: ReservationStatusFilter = reservationFilter) => {
      setReservationsLoading(true)
      try {
        const params = new URLSearchParams()
        if (filter !== 'ALL') {
          params.set('status', filter)
        }
        const query = params.toString()
        const res = await fetch(
          `/api/properties/${PROPERTY_ID}/reservations${query ? `?${query}` : ''}`,
          {
            headers: {
              Authorization: `${session.tokenType} ${session.accessToken}`,
            },
          },
        )
        if (!res.ok) {
          const body = await res.json().catch(() => null)
          throw new Error(body?.message ?? `Failed to load reservations (${res.status})`)
        }
        const payload = (await res.json()) as ReservationListResponse
        setReservations(payload.reservations)
      } finally {
        setReservationsLoading(false)
      }
    },
    [reservationFilter],
  )

  useEffect(() => {
    if (!auth) {
      return
    }
    loadReservations(auth, reservationFilter).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to load reservations')
    })
  }, [auth, reservationFilter, loadReservations])

  function persistAuth(session: AuthSession | null) {
    setAuth(session)
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  async function onLogin(event: FormEvent) {
    event.preventDefault()
    setLoginLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (!res.ok) {
        throw new Error('Invalid username or password')
      }
      const session = (await res.json()) as AuthSession
      persistAuth(session)
      setResult(null)
      setConfirmation(null)
      setSearched(false)
      setReservationFilter('ALL')
      setInfo(`Signed in as ${session.username}`)
    } catch (err) {
      persistAuth(null)
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  function onLogout() {
    persistAuth(null)
    setResult(null)
    setConfirmation(null)
    setReservations([])
    setSearched(false)
    setError(null)
    setInfo(null)
    setConfirmCancelId(null)
  }

  async function refreshAvailability() {
    const params = new URLSearchParams({ checkIn, checkOut })
    const res = await fetch(`/api/properties/${PROPERTY_ID}/availability?${params}`, {
      headers: authHeaders(),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new Error(body?.message ?? `Request failed (${res.status})`)
    }
    setResult((await res.json()) as AvailabilityResult)
  }

  async function onSearch(event: FormEvent) {
    event.preventDefault()
    if (!auth) {
      setError('Please sign in first')
      return
    }
    if (!canSubmit) {
      setError('Check-out must be after check-in')
      return
    }

    setLoading(true)
    setError(null)
    setInfo(null)
    setSearched(true)
    setConfirmation(null)
    setConfirmCancelId(null)

    try {
      await refreshAvailability()
    } catch (err) {
      setResult(null)
      setError(
        err instanceof Error
          ? err.message
          : 'Backend not reachable. Start Istay-backend on :8080',
      )
    } finally {
      setLoading(false)
    }
  }

  async function onBook(offer: AvailabilityOffer) {
    if (!canBook || !auth) {
      setError('Your role is read-only. Sign in as front_desk to book.')
      return
    }
    if (!guestReady) {
      setError('Enter a valid guest name and email before booking.')
      return
    }

    setBookingRoomTypeId(offer.roomTypeId)
    setError(null)
    setInfo(null)
    setConfirmation(null)

    try {
      const res = await fetch(`/api/properties/${PROPERTY_ID}/reservations`, {
        method: 'POST',
        headers: authHeaders({
          'Content-Type': 'application/json',
          'Idempotency-Key': newIdempotencyKey(),
        }),
        body: JSON.stringify({
          roomTypeId: offer.roomTypeId,
          checkIn,
          checkOut,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? `Booking failed (${res.status})`)
      }
      const booked = (await res.json()) as ReservationResponse
      setConfirmation(booked)
      setInfo(null)
      await Promise.all([refreshAvailability(), loadReservations(auth)])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setBookingRoomTypeId(null)
    }
  }

  async function onCancel(reservationId: string) {
    if (!canBook || !auth) {
      return
    }
    setCancellingId(reservationId)
    setError(null)
    try {
      const res = await fetch(
        `/api/properties/${PROPERTY_ID}/reservations/${reservationId}/cancel`,
        {
          method: 'POST',
          headers: authHeaders(),
        },
      )
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? `Cancel failed (${res.status})`)
      }
      const cancelled = (await res.json()) as ReservationResponse
      if (confirmation?.reservationId === reservationId) {
        setConfirmation(cancelled)
      }
      setConfirmCancelId(null)
      setInfo('Reservation cancelled. Inventory released.')
      await Promise.all([
        searched ? refreshAvailability() : Promise.resolve(),
        loadReservations(auth),
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed')
    } finally {
      setCancellingId(null)
    }
  }

  if (!auth) {
    return (
      <main className="shell shell--login">
        <p className="brand brand-mark">iStay</p>
        <p className="lede">Sign in to search availability and manage reservations for your property.</p>

        <section className="panel" aria-labelledby="sign-in-title">
          <h2 id="sign-in-title" className="section-title">
            Sign in
          </h2>
          <form className="field-grid" onSubmit={onLogin}>
            <label className="field">
              <span>Username</span>
              <input
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className="actions">
              <button type="submit" className="btn btn--primary" disabled={loginLoading}>
                {loginLoading ? 'Signing in…' : 'Sign in'}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide password' : 'Show password'}
              </button>
            </div>
          </form>
          <ul className="hint-list">
            <li>
              Front desk: <code>front_desk</code> / <code>password</code>
            </li>
            <li>
              Revenue (read-only): <code>revenue</code> / <code>password</code>
            </li>
          </ul>
        </section>

        {error && (
          <div className="alert alert--error" role="alert">
            <p>{error}</p>
            <button type="button" className="alert-dismiss" aria-label="Dismiss" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}
      </main>
    )
  }

  return (
    <main className="shell">
      <header className="top-bar">
        <div>
          <p className="brand">iStay</p>
          <div className="meta-row" aria-label="Session">
            <span className="badge">{auth.username}</span>
            <span className="badge badge--accent">{roleLabel}</span>
            <span className="badge">{auth.propertyId}</span>
          </div>
        </div>
        <button type="button" className="btn btn--ghost" onClick={onLogout}>
          Sign out
        </button>
      </header>

      {error && (
        <div className="alert alert--error" role="alert">
          <p>{error}</p>
          <button type="button" className="alert-dismiss" aria-label="Dismiss error" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {info && (
        <div className="alert alert--info" role="status">
          <p>{info}</p>
          <button type="button" className="alert-dismiss" aria-label="Dismiss message" onClick={() => setInfo(null)}>
            ×
          </button>
        </div>
      )}

      <section className="panel" aria-labelledby="stay-title">
        <h2 id="stay-title" className="section-title">
          Stay dates
        </h2>
        <form className="field-grid field-grid--search" onSubmit={onSearch}>
          <label className="field">
            <span>Check-in</span>
            <input
              type="date"
              value={checkIn}
              min={defaultCheckIn()}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Check-out</span>
            <input
              type="date"
              value={checkOut}
              min={checkIn || defaultCheckIn()}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              aria-invalid={datesInvalid}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={loading || !canSubmit}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {datesInvalid ? (
          <p className="field-hint field-hint--error">Check-out must be after check-in.</p>
        ) : (
          nightsPreview > 0 && (
            <p className="nights-chip">
              {nightsPreview} night{nightsPreview === 1 ? '' : 's'} selected
            </p>
          )
        )}
      </section>

      {canBook ? (
        <section className="panel" aria-labelledby="guest-title">
          <h2 id="guest-title" className="section-title">
            Guest details
          </h2>
          <div className="field-grid field-grid--2">
            <label className="field">
              <span>Guest name</span>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="field">
              <span>Guest email</span>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>
          </div>
          {!guestReady && (
            <p className="field-hint">Name and a valid email are required before booking.</p>
          )}
        </section>
      ) : (
        <div className="alert alert--info" role="status">
          <p>Read-only access (REVENUE). Switch to front_desk to book or cancel.</p>
        </div>
      )}

      {confirmation && (
        <section className="panel confirmation" aria-live="polite">
          <div className={`alert ${confirmation.status === 'CANCELLED' ? 'alert--info' : 'alert--ok'}`}>
            <div className="confirmation-main">
              <p className="confirmation-copy">
                <strong>
                  {confirmation.status === 'CANCELLED' ? 'Cancelled' : 'Confirmed'} · {confirmation.roomTypeId}
                </strong>
                <br />
                {formatStayLabel(confirmation.checkIn, confirmation.checkOut, confirmation.nights)}
                {' · '}
                {formatMoney(confirmation.totalRate)}
                <span className="confirmation-id">ID {confirmation.reservationId}</span>
              </p>
              {confirmation.status === 'CONFIRMED' && canBook && confirmCancelId !== confirmation.reservationId && (
                <button
                  type="button"
                  className="btn btn--danger btn--small"
                  onClick={() => setConfirmCancelId(confirmation.reservationId)}
                >
                  Cancel stay
                </button>
              )}
            </div>
          </div>
          {confirmCancelId === confirmation.reservationId && confirmation.status === 'CONFIRMED' && (
            <div className="cancel-confirm">
              <p className="field-hint" style={{ margin: 0 }}>
                Release inventory for this reservation?
              </p>
              <button
                type="button"
                className="btn btn--danger btn--small"
                disabled={cancellingId !== null}
                onClick={() => onCancel(confirmation.reservationId)}
              >
                {cancellingId === confirmation.reservationId ? 'Cancelling…' : 'Yes, cancel'}
              </button>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                disabled={cancellingId !== null}
                onClick={() => setConfirmCancelId(null)}
              >
                Keep reservation
              </button>
            </div>
          )}
        </section>
      )}

      <section className="panel" aria-labelledby="results-title" aria-busy={loading}>
        <h2 id="results-title" className="section-title">
          Availability
        </h2>

        {loading && (
          <div className="skeleton" aria-hidden="true">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        )}

        {!loading && !searched && (
          <div className="empty">
            <strong>No search yet</strong>
            Choose dates and search to see open room types.
          </div>
        )}

        {!loading && searched && result && result.offers.length === 0 && (
          <div className="empty">
            <strong>Nothing available</strong>
            Try different dates or another room category later.
          </div>
        )}

        {!loading && result && result.offers.length > 0 && (
          <div className="results">
            <div className="results-head">
              <div>
                <h2>{result.propertyName}</h2>
                <p className="field-hint" style={{ marginTop: '0.25rem' }}>
                  {formatStayLabel(result.checkIn, result.checkOut, result.nights)}
                </p>
              </div>
            </div>

            <table className="offers">
              <thead>
                <tr>
                  <th scope="col">Room</th>
                  <th scope="col">Left</th>
                  <th scope="col">Nightly</th>
                  <th scope="col">Stay total</th>
                  {canBook && <th scope="col"><span className="visually-hidden">Actions</span></th>}
                </tr>
              </thead>
              <tbody>
                {result.offers.map((offer) => (
                  <tr key={offer.roomTypeId}>
                    <td className="room-name">{offer.roomTypeName}</td>
                    <td className={`avail ${offer.availableRooms <= 2 ? 'avail--tight' : ''}`}>
                      {offer.availableRooms}
                    </td>
                    <td className="price">{formatMoney(offer.nightlyRate)}</td>
                    <td className="price price-total">{formatMoney(offer.totalRate)}</td>
                    {canBook && (
                      <td>
                        <button
                          type="button"
                          className="btn btn--accent btn--small"
                          disabled={bookingRoomTypeId !== null || !guestReady}
                          onClick={() => onBook(offer)}
                          aria-label={`Book ${offer.roomTypeName}`}
                        >
                          {bookingRoomTypeId === offer.roomTypeId ? 'Booking…' : 'Book'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel" aria-labelledby="reservations-title" aria-busy={reservationsLoading}>
        <div className="panel-head">
          <h2 id="reservations-title" className="section-title" style={{ margin: 0 }}>
            Reservations
          </h2>
          <div className="filter-row" role="group" aria-label="Reservation status filter">
            {(['ALL', 'CONFIRMED', 'CANCELLED'] as ReservationStatusFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                className={`filter-btn ${reservationFilter === filter ? 'filter-btn--active' : ''}`}
                aria-pressed={reservationFilter === filter}
                onClick={() => setReservationFilter(filter)}
              >
                {filter === 'ALL' ? 'All' : filter === 'CONFIRMED' ? 'Confirmed' : 'Cancelled'}
              </button>
            ))}
          </div>
        </div>

        {reservationsLoading && (
          <div className="skeleton" aria-hidden="true">
            <div className="skeleton-row" />
            <div className="skeleton-row" />
          </div>
        )}

        {!reservationsLoading && reservations.length === 0 && (
          <div className="empty">
            <strong>No reservations</strong>
            {reservationFilter === 'ALL'
              ? 'Book a stay to see it listed here.'
              : `No ${reservationFilter.toLowerCase()} reservations.`}
          </div>
        )}

        {!reservationsLoading && reservations.length > 0 && (
          <ul className="reservation-list">
            {reservations.map((item) => (
              <li key={item.reservationId} className="reservation-item">
                <div className="reservation-main">
                  <div>
                    <p className="reservation-title">
                      <span
                        className={`status-dot ${
                          item.status === 'CONFIRMED' ? 'status-dot--ok' : 'status-dot--muted'
                        }`}
                      />
                      {item.guestName} · {item.roomTypeId}
                    </p>
                    <p className="field-hint" style={{ marginTop: '0.2rem' }}>
                      {formatStayLabel(item.checkIn, item.checkOut, item.nights)}
                      {' · '}
                      {formatMoney(item.totalRate)}
                    </p>
                    <p className="confirmation-id">{item.guestEmail}</p>
                  </div>
                  <div className="reservation-actions">
                    <span className={`status-label status-label--${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                    {item.status === 'CONFIRMED' && canBook && confirmCancelId !== item.reservationId && (
                      <button
                        type="button"
                        className="btn btn--danger btn--small"
                        onClick={() => setConfirmCancelId(item.reservationId)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
                {confirmCancelId === item.reservationId && item.status === 'CONFIRMED' && (
                  <div className="cancel-confirm">
                    <p className="field-hint" style={{ margin: 0 }}>
                      Cancel stay for {item.guestName}?
                    </p>
                    <button
                      type="button"
                      className="btn btn--danger btn--small"
                      disabled={cancellingId !== null}
                      onClick={() => onCancel(item.reservationId)}
                    >
                      {cancellingId === item.reservationId ? 'Cancelling…' : 'Yes, cancel'}
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      disabled={cancellingId !== null}
                      onClick={() => setConfirmCancelId(null)}
                    >
                      Keep
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
