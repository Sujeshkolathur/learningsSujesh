import { FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AdminPanel } from './components/AdminPanel'
import { AuthScreen } from './components/AuthScreen'
import {
  CertEditor,
  EducationEditor,
  ExperienceEditor,
  ProjectEditor,
} from './components/ProfileEditors'
import { logOut, watchAuth } from './lib/authStore'
import {
  canDeleteProfile,
  canEditProfile,
  createDemoResumeProfile,
  createProfileForUser,
  listProfilesForUser,
  removeProfile,
  saveProfile,
  storageModeLabel,
} from './lib/profileStore'
import type { CareerUser } from './types/auth'
import { isStaff, roleLabel } from './types/auth'
import {
  AVATAR_TONES,
  emptyProfileDraft,
  type AvatarTone,
  type CareerProfile,
  type CertificationEntry,
  type EducationEntry,
  type ExperienceEntry,
  type ProjectEntry,
} from './types/profile'

type View = 'gate' | 'browse' | 'edit' | 'admin'
type DetailTarget =
  | { kind: 'experience'; item: ExperienceEntry }
  | { kind: 'education'; item: EducationEntry }
  | { kind: 'project'; item: ProjectEntry }
  | { kind: 'cert'; item: CertificationEntry }
  | null

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

function formatRange(start: string, end: string, current?: boolean) {
  const pretty = (v: string) => {
    if (!v) return ''
    const [y, m] = v.split('-')
    if (!m) return y
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[Number(m) - 1] ?? m} ${y}`
  }
  const left = pretty(start) || '—'
  const right = current ? 'Present' : pretty(end) || '—'
  return `${left} – ${right}`
}

function App() {
  const [session, setSession] = useState<CareerUser | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [profiles, setProfiles] = useState<CareerProfile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [view, setView] = useState<View>('gate')
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [detail, setDetail] = useState<DetailTarget>(null)
  const [draftName, setDraftName] = useState('')
  const [draftTone, setDraftTone] = useState<AvatarTone>('ocean')
  const [editDraft, setEditDraft] = useState<CareerProfile | null>(null)
  const [saving, setSaving] = useState(false)

  const active = useMemo(
    () => profiles.find((p) => p.id === activeId) ?? null,
    [profiles, activeId],
  )

  const staff = session ? isStaff(session.role) : false
  const canEditActive = session && active ? canEditProfile(session, active) : false

  useEffect(() => {
    return watchAuth((user) => {
      setSession(user)
      setAuthReady(true)
      if (!user) {
        setProfiles([])
        setActiveId(null)
        setView('gate')
      }
    })
  }, [])

  useEffect(() => {
    if (!session) return
    let cancelled = false
    ;(async () => {
      setLoadingProfiles(true)
      setError(null)
      try {
        const list = await listProfilesForUser(session)
        if (cancelled) return
        setProfiles(list)
        if (!staff) {
          if (list[0]) {
            setActiveId(list[0].id)
            setView('browse')
          } else {
            setActiveId(null)
            setView('gate')
            setShowAdd(true)
          }
        } else {
          setView('gate')
          setActiveId(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load profiles')
        }
      } finally {
        if (!cancelled) setLoadingProfiles(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [session?.uid, session?.role])

  async function refresh() {
    if (!session) return []
    const list = await listProfilesForUser(session)
    setProfiles(list)
    return list
  }

  async function onAddProfile(event: FormEvent) {
    event.preventDefault()
    if (!session) return
    if (staff && session.role !== 'admin') {
      setError('Hiring managers can browse profiles but cannot create candidate profiles.')
      return
    }
    const name = draftName.trim() || session.displayName
    if (!name) return
    setSaving(true)
    setError(null)
    try {
      const created = await createProfileForUser(session, {
        ...emptyProfileDraft(name),
        avatarTone: draftTone,
        email: session.email,
        headline: 'New career profile',
        summary: 'Add employment, education, skills, and more.',
      })
      await refresh()
      setShowAdd(false)
      setDraftName('')
      setActiveId(created.id)
      setEditDraft(created)
      setView('edit')
      setInfo('Profile created. Fill in your details, then Save.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create profile')
    } finally {
      setSaving(false)
    }
  }

  async function onImportDemo() {
    if (!session || session.role !== 'candidate') return
    setSaving(true)
    setError(null)
    try {
      const created = await createDemoResumeProfile(session)
      await refresh()
      setShowAdd(false)
      setActiveId(created.id)
      setView('browse')
      setInfo('Demo resume imported. You can edit anything.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setSaving(false)
    }
  }

  function openProfile(id: string) {
    setActiveId(id)
    setView('browse')
    setDetail(null)
  }

  function backToList() {
    if (!staff) return
    setView('gate')
    setActiveId(null)
    setEditDraft(null)
    setDetail(null)
  }

  function startEdit() {
    if (!active || !session || !canEditProfile(session, active)) return
    setEditDraft(structuredClone(active))
    setView('edit')
  }

  async function onSaveEdit(event?: FormEvent) {
    event?.preventDefault()
    if (!editDraft || !session) return
    if (!canEditProfile(session, editDraft)) {
      setError('You can only edit your own profile.')
      return
    }
    if (!editDraft.displayName.trim()) {
      setError('Display name is required.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const saved = await saveProfile({
        ...editDraft,
        displayName: editDraft.displayName.trim(),
        ownerUid: editDraft.ownerUid || session.uid,
      })
      const list = await refresh()
      setActiveId(saved.id)
      setEditDraft(list.find((p) => p.id === saved.id) ?? saved)
      setView('browse')
      setInfo(`Saved to ${storageModeLabel()}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function onDeleteProfile() {
    if (!editDraft || !session || !canDeleteProfile(session, editDraft)) return
    if (!confirm(`Delete profile “${editDraft.displayName}”?`)) return
    setSaving(true)
    try {
      await removeProfile(editDraft.id)
      await refresh()
      setEditDraft(null)
      setActiveId(null)
      setView(staff ? 'gate' : 'gate')
      setShowAdd(!staff)
      setInfo('Profile deleted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setSaving(false)
    }
  }

  async function onLogout() {
    await logOut()
    setSession(null)
    setProfiles([])
    setActiveId(null)
    setInfo(null)
    setError(null)
  }

  if (!authReady) {
    return (
      <main className="gate">
        <div className="gate-inner">
          <p className="brand gate-brand">CAREERFLIX</p>
          <p style={{ color: 'var(--muted)' }}>Checking session…</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return <AuthScreen onAuthed={setSession} />
  }

  if (loadingProfiles) {
    return (
      <main className="gate">
        <div className="gate-inner">
          <p className="brand gate-brand">CAREERFLIX</p>
          <p style={{ color: 'var(--muted)' }}>Loading…</p>
        </div>
      </main>
    )
  }

  if (view === 'admin' && session.role === 'admin') {
    return (
      <main className="shell">
        <header className="topnav">
          <p className="brand topnav-brand">CAREERFLIX</p>
          <div className="topnav-actions">
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setView('gate')}>
              Profiles
            </button>
            <button type="button" className="btn btn--outline btn--small" onClick={onLogout}>
              Sign out
            </button>
          </div>
        </header>
        <AdminPanel currentUser={session} />
      </main>
    )
  }

  if (view === 'gate') {
    return (
      <main className="gate">
        <div className="gate-inner">
          <p className="brand gate-brand">CAREERFLIX</p>
          <h1 className="gate-title">
            {staff ? 'Who’s in the talent pool?' : 'Create your career profile'}
          </h1>
          <p className="auth-lede">
            Signed in as <strong>{session.displayName}</strong> · {roleLabel(session.role)} · {session.email}
          </p>
          {error && (
            <p className="alert" style={{ margin: '0 0 1rem', textAlign: 'left' }}>
              {error}
            </p>
          )}
          {info && (
            <p className="alert alert--ok" style={{ margin: '0 0 1rem', textAlign: 'left' }}>
              {info}
            </p>
          )}

          {staff ? (
            <>
              <div className="profile-grid">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    className="profile-tile"
                    onClick={() => openProfile(profile.id)}
                  >
                    <div className={`avatar avatar--${profile.avatarTone}`}>
                      {initials(profile.displayName) || '?'}
                    </div>
                    <div className="profile-name">{profile.displayName}</div>
                  </button>
                ))}
                {profiles.length === 0 && (
                  <p className="empty-row">No candidate profiles yet. Ask candidates to sign up and add theirs.</p>
                )}
              </div>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                {session.role === 'admin' && (
                  <button type="button" className="btn btn--primary" onClick={() => setView('admin')}>
                    Admin panel
                  </button>
                )}
                <button type="button" className="btn btn--ghost" onClick={onLogout}>
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="profile-grid">
                <button type="button" className="profile-tile" onClick={() => setShowAdd(true)}>
                  <div className="avatar avatar--add">+</div>
                  <div className="profile-name">Add my profile</div>
                </button>
              </div>
              <div className="hero-actions" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                <button type="button" className="btn btn--outline" disabled={saving} onClick={onImportDemo}>
                  Import demo resume
                </button>
                <button type="button" className="btn btn--ghost" onClick={onLogout}>
                  Sign out
                </button>
              </div>
            </>
          )}

          <p className="storage-chip" style={{ marginTop: '1.25rem' }}>
            {storageModeLabel()}
          </p>
        </div>

        {showAdd && !staff && (
          <div className="modal-backdrop" role="presentation" onClick={() => setShowAdd(false)}>
            <div className="modal" role="dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h2>Create your profile</h2>
                <button type="button" className="icon-btn" aria-label="Close" onClick={() => setShowAdd(false)}>
                  ×
                </button>
              </div>
              <form className="field-grid" onSubmit={onAddProfile}>
                <label className="field">
                  <span>Display name</span>
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder={session.displayName}
                    autoFocus
                  />
                </label>
                <label className="field">
                  <span>Avatar color</span>
                  <select value={draftTone} onChange={(e) => setDraftTone(e.target.value as AvatarTone)}>
                    {AVATAR_TONES.map((tone) => (
                      <option key={tone} value={tone}>
                        {tone}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="modal-actions">
                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    {saving ? 'Creating…' : 'Create profile'}
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setShowAdd(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    )
  }

  if (view === 'edit' && editDraft && session) {
    return (
      <main className="shell">
        <header className="topnav">
          <p className="brand topnav-brand">CAREERFLIX</p>
          <div className="topnav-actions">
            <button type="button" className="btn btn--primary btn--small" disabled={saving} onClick={() => onSaveEdit()}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setView('browse')}>
              Cancel
            </button>
          </div>
        </header>
        {error && (
          <div className="alert" role="alert">
            {error}
          </div>
        )}
        <div className="editor-banner">
          <p>
            Edit your employment, education, and more — then press <strong>Save</strong>.
          </p>
          <button type="button" className="btn btn--primary btn--small" disabled={saving} onClick={() => onSaveEdit()}>
            {saving ? 'Saving…' : 'Save details'}
          </button>
        </div>
        <form className="editor" onSubmit={onSaveEdit}>
          <section className="editor-panel">
            <h2>Basics</h2>
            <div className="field-grid field-grid--2">
              <label className="field">
                <span>Display name</span>
                <input
                  value={editDraft.displayName}
                  onChange={(e) => setEditDraft({ ...editDraft, displayName: e.target.value })}
                  required
                />
              </label>
              <label className="field">
                <span>Headline</span>
                <input
                  value={editDraft.headline}
                  onChange={(e) => setEditDraft({ ...editDraft, headline: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Email</span>
                <input
                  type="text"
                  value={editDraft.email}
                  onChange={(e) => setEditDraft({ ...editDraft, email: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Phone</span>
                <input
                  value={editDraft.phone}
                  onChange={(e) => setEditDraft({ ...editDraft, phone: e.target.value })}
                />
              </label>
              <label className="field">
                <span>LinkedIn</span>
                <input
                  value={editDraft.linkedin}
                  onChange={(e) => setEditDraft({ ...editDraft, linkedin: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  value={editDraft.location}
                  onChange={(e) => setEditDraft({ ...editDraft, location: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Avatar color</span>
                <select
                  value={editDraft.avatarTone}
                  onChange={(e) => setEditDraft({ ...editDraft, avatarTone: e.target.value as AvatarTone })}
                >
                  {AVATAR_TONES.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="field" style={{ marginTop: '0.85rem' }}>
              <span>Professional summary</span>
              <textarea
                value={editDraft.summary}
                onChange={(e) => setEditDraft({ ...editDraft, summary: e.target.value })}
              />
            </label>
            <label className="field" style={{ marginTop: '0.85rem' }}>
              <span>Skills (comma-separated)</span>
              <textarea
                value={editDraft.skills.join(', ')}
                onChange={(e) =>
                  setEditDraft({
                    ...editDraft,
                    skills: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </section>

          <ExperienceEditor
            items={editDraft.experience}
            onChange={(experience) => setEditDraft({ ...editDraft, experience })}
          />
          <EducationEditor
            items={editDraft.education}
            onChange={(education) => setEditDraft({ ...editDraft, education })}
          />
          <ProjectEditor
            items={editDraft.projects}
            onChange={(projects) => setEditDraft({ ...editDraft, projects })}
          />
          <CertEditor
            items={editDraft.certifications}
            onChange={(certifications) => setEditDraft({ ...editDraft, certifications })}
          />

          <div className="modal-actions">
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : `Save (${storageModeLabel()})`}
            </button>
            <button type="button" className="btn btn--outline" onClick={() => setView('browse')}>
              Discard
            </button>
            {canDeleteProfile(session, editDraft) && (
              <button type="button" className="btn btn--danger" disabled={saving} onClick={onDeleteProfile}>
                Delete profile
              </button>
            )}
          </div>
        </form>
      </main>
    )
  }

  if (!active) {
    return (
      <main className="gate">
        <div className="gate-inner">
          <p className="brand gate-brand">CAREERFLIX</p>
          <p style={{ color: 'var(--muted)' }}>No profile selected.</p>
          <button type="button" className="btn btn--primary" onClick={() => setView('gate')}>
            Back
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="shell">
      <header className="topnav">
        <p className="brand topnav-brand">CAREERFLIX</p>
        <div className="topnav-actions">
          {canEditActive && (
            <button type="button" className="btn btn--ghost btn--small" onClick={startEdit}>
              Manage profile
            </button>
          )}
          {staff && (
            <button type="button" className="btn btn--outline btn--small" onClick={backToList}>
              All profiles
            </button>
          )}
          <button type="button" className="btn btn--ghost btn--small" onClick={onLogout}>
            Sign out
          </button>
          <button
            type="button"
            className={`nav-avatar avatar--${active.avatarTone}`}
            aria-label="Profile"
            onClick={staff ? backToList : undefined}
          >
            {initials(active.displayName)}
          </button>
        </div>
      </header>

      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}
      {info && (
        <div className="alert alert--ok" role="status">
          {info}
          <button type="button" className="alert-dismiss" aria-label="Dismiss" onClick={() => setInfo(null)}>
            ×
          </button>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <p className="hero-kicker">{staff ? 'Candidate profile' : 'Your career story'}</p>
          <h1>{active.displayName}</h1>
          <p className="hero-headline">{active.headline}</p>
          <p className="hero-summary">{active.summary}</p>
          <div className="hero-actions">
            {canEditActive ? (
              <button type="button" className="btn btn--primary" onClick={startEdit}>
                ▶ Add / edit details
              </button>
            ) : (
              <span className="storage-chip">View only · {roleLabel(session.role)}</span>
            )}
            {staff && (
              <button type="button" className="btn btn--ghost" onClick={backToList}>
                Back to list
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="rows">
        <Row title="Employment history" onAdd={canEditActive ? startEdit : undefined}>
          {active.experience.length === 0 ? (
            <p className="empty-row">No roles yet.</p>
          ) : (
            <div className="rail">
              {active.experience.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card"
                  onClick={() => setDetail({ kind: 'experience', item })}
                >
                  <p className="card-label">{item.current ? 'Current role' : 'Past role'}</p>
                  <p className="card-title">{item.title}</p>
                  <p className="card-meta">
                    {item.company}
                    <br />
                    {formatRange(item.startDate, item.endDate, item.current)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Row>

        <Row title="Education" onAdd={canEditActive ? startEdit : undefined}>
          {active.education.length === 0 ? (
            <p className="empty-row">No education entries yet.</p>
          ) : (
            <div className="rail">
              {active.education.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card"
                  onClick={() => setDetail({ kind: 'education', item })}
                >
                  <p className="card-label">Education</p>
                  <p className="card-title">{item.degree}</p>
                  <p className="card-meta">
                    {item.institution}
                    <br />
                    {formatRange(item.startDate, item.endDate)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </Row>

        <Row title="Selected projects" onAdd={canEditActive ? startEdit : undefined}>
          {active.projects.length === 0 ? (
            <p className="empty-row">No projects yet.</p>
          ) : (
            <div className="rail">
              {active.projects.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card"
                  onClick={() => setDetail({ kind: 'project', item })}
                >
                  <p className="card-label">{item.organization}</p>
                  <p className="card-title">{item.name}</p>
                  <p className="card-meta">{item.stack}</p>
                </button>
              ))}
            </div>
          )}
        </Row>

        <Row title="Skills" onAdd={canEditActive ? startEdit : undefined}>
          {active.skills.length === 0 ? (
            <p className="empty-row">No skills listed.</p>
          ) : (
            <div className="chip-rail">
              {active.skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </Row>

        <Row title="Certifications" onAdd={canEditActive ? startEdit : undefined}>
          {active.certifications.length === 0 ? (
            <p className="empty-row">No certifications yet.</p>
          ) : (
            <div className="rail">
              {active.certifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card"
                  onClick={() => setDetail({ kind: 'cert', item })}
                >
                  <p className="card-label">{item.issuer || 'Certificate'}</p>
                  <p className="card-title">{item.name}</p>
                  {item.year && <p className="card-meta">{item.year}</p>}
                </button>
              ))}
            </div>
          )}
        </Row>

        <Row title="Contact">
          <div className="chip-rail">
            {active.email && <span className="chip">{active.email}</span>}
            {active.phone && <span className="chip">{active.phone}</span>}
            {active.location && <span className="chip">{active.location}</span>}
            {active.linkedin && (
              <a className="chip" href={active.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </Row>
      </div>

      {detail && (
        <div className="modal-backdrop" role="presentation" onClick={() => setDetail(null)}>
          <div className="modal modal--wide" role="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>
                {detail.kind === 'experience' && detail.item.title}
                {detail.kind === 'education' && detail.item.degree}
                {detail.kind === 'project' && detail.item.name}
                {detail.kind === 'cert' && detail.item.name}
              </h2>
              <button type="button" className="icon-btn" aria-label="Close" onClick={() => setDetail(null)}>
                ×
              </button>
            </div>
            {detail.kind === 'experience' && (
              <>
                <p className="card-meta">
                  {detail.item.company} · {detail.item.location}
                  <br />
                  {formatRange(detail.item.startDate, detail.item.endDate, detail.item.current)}
                </p>
                <ul className="detail-list">
                  {detail.item.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </>
            )}
            {detail.kind === 'education' && (
              <>
                <p className="card-meta">
                  {detail.item.institution}
                  {detail.item.location ? ` · ${detail.item.location}` : ''}
                  <br />
                  {formatRange(detail.item.startDate, detail.item.endDate)}
                </p>
                {detail.item.details && <p style={{ color: 'var(--muted)' }}>{detail.item.details}</p>}
              </>
            )}
            {detail.kind === 'project' && (
              <>
                <p className="card-meta">
                  {detail.item.organization} · {detail.item.stack}
                </p>
                <p style={{ color: 'var(--muted)' }}>{detail.item.summary}</p>
                {detail.item.highlights.length > 0 && (
                  <ul className="detail-list">
                    {detail.item.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {detail.kind === 'cert' && (
              <p className="card-meta">
                {detail.item.issuer}
                {detail.item.year ? ` · ${detail.item.year}` : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function Row({
  title,
  children,
  onAdd,
}: {
  title: string
  children: ReactNode
  onAdd?: () => void
}) {
  return (
    <section className="row">
      <div className="row-head">
        <h2 className="row-title">{title}</h2>
        {onAdd && (
          <button type="button" className="btn btn--outline btn--small" onClick={onAdd}>
            + Add
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export default App
