import { newId, type CertificationEntry, type EducationEntry, type ExperienceEntry, type ProjectEntry } from '../types/profile'

export function ExperienceEditor({
  items,
  onChange,
}: {
  items: ExperienceEntry[]
  onChange: (items: ExperienceEntry[]) => void
}) {
  function add() {
    onChange([
      {
        id: newId('exp'),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bullets: [''],
      },
      ...items,
    ])
  }

  function update(id: string, patch: Partial<ExperienceEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <section className="editor-panel">
      <div className="row-head">
        <h2>Employment history</h2>
        <button type="button" className="btn btn--outline btn--small" onClick={add}>
          + Add role
        </button>
      </div>
      <div className="section-list">
        {items.map((item) => (
          <div key={item.id} className="section-item">
            <div className="section-item-head">
              <strong>{item.title || 'New role'}</strong>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              >
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--2" style={{ marginTop: '0.75rem' }}>
              <label className="field">
                <span>Title</span>
                <input value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} />
              </label>
              <label className="field">
                <span>Company</span>
                <input value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} />
              </label>
              <label className="field">
                <span>Location</span>
                <input value={item.location} onChange={(e) => update(item.id, { location: e.target.value })} />
              </label>
              <label className="field">
                <span>Start (YYYY-MM)</span>
                <input
                  value={item.startDate}
                  onChange={(e) => update(item.id, { startDate: e.target.value })}
                  placeholder="2024-08"
                />
              </label>
              <label className="field">
                <span>End (YYYY-MM)</span>
                <input
                  value={item.endDate}
                  onChange={(e) => update(item.id, { endDate: e.target.value })}
                  disabled={item.current}
                  placeholder="2024-07"
                />
              </label>
              <label className="check">
                <input
                  type="checkbox"
                  checked={item.current}
                  onChange={(e) => update(item.id, { current: e.target.checked, endDate: '' })}
                />
                Current role
              </label>
            </div>
            <label className="field" style={{ marginTop: '0.75rem' }}>
              <span>Bullets (one per line)</span>
              <textarea
                value={item.bullets.join('\n')}
                onChange={(e) =>
                  update(item.id, {
                    bullets: e.target.value
                      .split('\n')
                      .map((l) => l.trimEnd())
                      .filter((l) => l.length > 0),
                  })
                }
              />
            </label>
          </div>
        ))}
      </div>
    </section>
  )
}

export function EducationEditor({
  items,
  onChange,
}: {
  items: EducationEntry[]
  onChange: (items: EducationEntry[]) => void
}) {
  function add() {
    onChange([
      {
        id: newId('edu'),
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        details: '',
      },
      ...items,
    ])
  }

  function update(id: string, patch: Partial<EducationEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <section className="editor-panel">
      <div className="row-head">
        <h2>Education</h2>
        <button type="button" className="btn btn--outline btn--small" onClick={add}>
          + Add education
        </button>
      </div>
      <div className="section-list">
        {items.map((item) => (
          <div key={item.id} className="section-item">
            <div className="section-item-head">
              <strong>{item.degree || 'New education'}</strong>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              >
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--2" style={{ marginTop: '0.75rem' }}>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Degree</span>
                <input value={item.degree} onChange={(e) => update(item.id, { degree: e.target.value })} />
              </label>
              <label className="field">
                <span>Institution</span>
                <input
                  value={item.institution}
                  onChange={(e) => update(item.id, { institution: e.target.value })}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input value={item.location} onChange={(e) => update(item.id, { location: e.target.value })} />
              </label>
              <label className="field">
                <span>Start</span>
                <input value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} />
              </label>
              <label className="field">
                <span>End</span>
                <input value={item.endDate} onChange={(e) => update(item.id, { endDate: e.target.value })} />
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Details (GPA, honors…)</span>
                <input value={item.details} onChange={(e) => update(item.id, { details: e.target.value })} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ProjectEditor({
  items,
  onChange,
}: {
  items: ProjectEntry[]
  onChange: (items: ProjectEntry[]) => void
}) {
  function add() {
    onChange([
      {
        id: newId('proj'),
        name: '',
        organization: '',
        stack: '',
        summary: '',
        highlights: [],
      },
      ...items,
    ])
  }

  function update(id: string, patch: Partial<ProjectEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <section className="editor-panel">
      <div className="row-head">
        <h2>Projects</h2>
        <button type="button" className="btn btn--outline btn--small" onClick={add}>
          + Add project
        </button>
      </div>
      <div className="section-list">
        {items.map((item) => (
          <div key={item.id} className="section-item">
            <div className="section-item-head">
              <strong>{item.name || 'New project'}</strong>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              >
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--2" style={{ marginTop: '0.75rem' }}>
              <label className="field">
                <span>Name</span>
                <input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} />
              </label>
              <label className="field">
                <span>Organization</span>
                <input
                  value={item.organization}
                  onChange={(e) => update(item.id, { organization: e.target.value })}
                />
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Stack</span>
                <input value={item.stack} onChange={(e) => update(item.id, { stack: e.target.value })} />
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Summary</span>
                <textarea value={item.summary} onChange={(e) => update(item.id, { summary: e.target.value })} />
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Highlights (one per line)</span>
                <textarea
                  value={item.highlights.join('\n')}
                  onChange={(e) =>
                    update(item.id, {
                      highlights: e.target.value
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CertEditor({
  items,
  onChange,
}: {
  items: CertificationEntry[]
  onChange: (items: CertificationEntry[]) => void
}) {
  function add() {
    onChange([{ id: newId('cert'), name: '', issuer: '', year: '' }, ...items])
  }

  function update(id: string, patch: Partial<CertificationEntry>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <section className="editor-panel">
      <div className="row-head">
        <h2>Certifications</h2>
        <button type="button" className="btn btn--outline btn--small" onClick={add}>
          + Add certificate
        </button>
      </div>
      <div className="section-list">
        {items.map((item) => (
          <div key={item.id} className="section-item">
            <div className="section-item-head">
              <strong>{item.name || 'New certificate'}</strong>
              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => onChange(items.filter((x) => x.id !== item.id))}
              >
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--2" style={{ marginTop: '0.75rem' }}>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span>Name</span>
                <input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} />
              </label>
              <label className="field">
                <span>Issuer</span>
                <input value={item.issuer} onChange={(e) => update(item.id, { issuer: e.target.value })} />
              </label>
              <label className="field">
                <span>Year</span>
                <input value={item.year} onChange={(e) => update(item.id, { year: e.target.value })} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
