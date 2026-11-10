import { useEffect, useState } from 'react'
import { listUsersForAdmin, updateUserRole } from '../lib/authStore'
import type { CareerUser, UserRole } from '../types/auth'
import { roleLabel } from '../types/auth'

export function AdminPanel({ currentUser }: { currentUser: CareerUser }) {
  const [users, setUsers] = useState<CareerUser[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busyUid, setBusyUid] = useState<string | null>(null)

  async function refresh() {
    setUsers(await listUsersForAdmin())
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load users'))
  }, [])

  async function onRoleChange(uid: string, role: UserRole) {
    setBusyUid(uid)
    setError(null)
    try {
      await updateUserRole(uid, role)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update role')
    } finally {
      setBusyUid(null)
    }
  }

  return (
    <section className="editor-panel" style={{ margin: '1rem clamp(1rem, 4vw, 3rem)' }}>
      <h2>Admin · users & roles</h2>
      <p className="field-hint" style={{ marginTop: 0 }}>
        Signed in as {currentUser.email} ({roleLabel(currentUser.role)}). Promote hiring managers here.
      </p>
      {error && (
        <div className="alert" role="alert">
          {error}
        </div>
      )}
      <div className="section-list" style={{ marginTop: '1rem' }}>
        {users.map((user) => (
          <div key={user.uid} className="section-item">
            <div className="section-item-head">
              <div>
                <strong>{user.displayName}</strong>
                <p className="card-meta" style={{ margin: '0.2rem 0 0' }}>
                  {user.email}
                </p>
              </div>
              <select
                value={user.role}
                disabled={busyUid === user.uid || user.uid === currentUser.uid}
                onChange={(e) => onRoleChange(user.uid, e.target.value as UserRole)}
              >
                <option value="candidate">Candidate</option>
                <option value="hiring_manager">Hiring manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
