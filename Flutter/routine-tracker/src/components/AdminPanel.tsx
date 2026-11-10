import { useMemo, useState } from 'react';
import {
  PEOPLE,
  newTaskId,
  normalizeTask,
  type PersonId,
  type RoutineTask,
  type TaskCategory,
  type TaskKind,
} from '../data/routines';

const ADMIN_PIN = (import.meta.env.VITE_ADMIN_PIN as string) || '2468';
const ADMIN_KEY = 'routine_admin_ok';

interface Props {
  tasks: RoutineTask[];
  onSave: (tasks: RoutineTask[]) => Promise<unknown>;
  saving: boolean;
}

type Draft = {
  id?: string;
  label: string;
  hint: string;
  category: TaskCategory;
  kind: TaskKind;
  weeklyGoal: number;
  waterGoal: number;
  assignees: PersonId[];
};

const emptyDraft = (): Draft => ({
  label: '',
  hint: '',
  category: 'health',
  kind: 'checkbox',
  weeklyGoal: 2,
  waterGoal: 8,
  assignees: ['chaithu', 'sujesh'],
});

function assigneeLabel(task: RoutineTask) {
  if (task.assignees.length === 2) return 'Both';
  if (task.assignees.includes('chaithu')) return 'Chaithu';
  if (task.assignees.includes('sujesh')) return 'Sujesh';
  return '—';
}

export default function AdminPanel({ tasks, onSave, saving }: Props) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(ADMIN_KEY) === '1'
  );
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        if (a.kind === 'weekly' && b.kind !== 'weekly') return 1;
        if (a.kind !== 'weekly' && b.kind === 'weekly') return -1;
        return a.label.localeCompare(b.label);
      }),
    [tasks]
  );

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pin.trim() === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_KEY, '1');
      setUnlocked(true);
      setOpen(true);
      setPinError('');
      setPin('');
    } else {
      setPinError('Wrong PIN');
    }
  }

  function lock() {
    sessionStorage.removeItem(ADMIN_KEY);
    setUnlocked(false);
    setOpen(false);
  }

  function startEdit(task: RoutineTask) {
    setEditingId(task.id);
    setDraft({
      id: task.id,
      label: task.label,
      hint: task.hint || '',
      category: task.category,
      kind: task.kind,
      weeklyGoal: task.weeklyGoal ?? 2,
      waterGoal: task.waterGoal ?? 8,
      assignees: [...task.assignees],
    });
  }

  function startAdd() {
    setEditingId(null);
    setDraft(emptyDraft());
  }

  async function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.label.trim()) return;

    const task = normalizeTask({
      id: editingId || newTaskId(),
      label: draft.label,
      hint: draft.hint,
      category: draft.category,
      kind: draft.kind,
      weeklyGoal: draft.weeklyGoal,
      waterGoal: draft.waterGoal,
      assignees: draft.assignees.length ? draft.assignees : ['chaithu', 'sujesh'],
    });

    const next = editingId
      ? tasks.map((t) => (t.id === editingId ? task : t))
      : [...tasks, task];

    await onSave(next);
    setMessage(editingId ? 'Task updated' : 'Task added');
    startAdd();
    setTimeout(() => setMessage(null), 2000);
  }

  async function removeTask(id: string) {
    if (!confirm('Remove this task for everyone?')) return;
    await onSave(tasks.filter((t) => t.id !== id));
    if (editingId === id) startAdd();
    setMessage('Task removed');
    setTimeout(() => setMessage(null), 2000);
  }

  function toggleAssignee(id: PersonId) {
    setDraft((d) => {
      const has = d.assignees.includes(id);
      const assignees = has ? d.assignees.filter((x) => x !== id) : [...d.assignees, id];
      return { ...d, assignees };
    });
  }

  if (!unlocked) {
    return (
      <details className="mb-6 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
        <summary className="cursor-pointer font-display text-sm font-semibold text-ink/70">
          Admin — manage tasks
        </summary>
        <form onSubmit={tryUnlock} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="text-xs text-ink/50">
            PIN
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 block w-36 rounded-xl border border-ink/15 px-3 py-2 text-sm"
              placeholder="••••"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            Unlock
          </button>
          {pinError && <span className="text-xs text-red-600">{pinError}</span>}
        </form>
      </details>
    );
  }

  return (
    <section className="mb-6 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Admin — tasks</h2>
          <p className="text-xs text-ink/50">
            Add / edit / remove routines for Chaithu, Sujesh, or both. Synced live.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-xl bg-mist px-3 py-2 text-xs font-semibold text-ink"
          >
            {open ? 'Hide panel' : 'Show panel'}
          </button>
          <button
            type="button"
            onClick={lock}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-ink/50"
          >
            Lock
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <form onSubmit={(e) => void saveDraft(e)} className="space-y-3 rounded-xl bg-mist/60 p-4">
            <h3 className="font-display text-sm font-semibold">
              {editingId ? 'Update task' : 'Add task'}
            </h3>
            <label className="block text-xs text-ink/55">
              Title
              <input
                required
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs text-ink/55">
              Hint (optional)
              <input
                value={draft.hint}
                onChange={(e) => setDraft({ ...draft, hint: e.target.value })}
                className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs text-ink/55">
                Category
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value as TaskCategory })
                  }
                  className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
                >
                  <option value="health">Health</option>
                  <option value="career">Career</option>
                </select>
              </label>
              <label className="block text-xs text-ink/55">
                Type
                <select
                  value={draft.kind}
                  onChange={(e) => setDraft({ ...draft, kind: e.target.value as TaskKind })}
                  className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
                >
                  <option value="checkbox">Daily checkbox</option>
                  <option value="weekly">Weekly count</option>
                  <option value="water">Daily water glasses</option>
                  <option value="meals">Daily meals</option>
                </select>
              </label>
            </div>
            {draft.kind === 'weekly' && (
              <label className="block text-xs text-ink/55">
                Times per week
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={draft.weeklyGoal}
                  onChange={(e) =>
                    setDraft({ ...draft, weeklyGoal: Number(e.target.value) || 1 })
                  }
                  className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
                />
              </label>
            )}
            {draft.kind === 'water' && (
              <label className="block text-xs text-ink/55">
                Glasses goal
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={draft.waterGoal}
                  onChange={(e) =>
                    setDraft({ ...draft, waterGoal: Number(e.target.value) || 8 })
                  }
                  className="mt-1 w-full rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm"
                />
              </label>
            )}
            <fieldset className="text-xs text-ink/55">
              <legend className="mb-1">Assign to</legend>
              <div className="flex flex-wrap gap-2">
                {PEOPLE.map((p) => {
                  const on = draft.assignees.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleAssignee(p.id)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        on ? 'text-white' : 'bg-white text-ink/60 ring-1 ring-ink/10'
                      }`}
                      style={on ? { backgroundColor: p.color } : undefined}
                    >
                      {p.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() =>
                    setDraft({ ...draft, assignees: ['chaithu', 'sujesh'] })
                  }
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink/60 ring-1 ring-ink/10"
                >
                  Both
                </button>
              </div>
            </fieldset>
            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={saving || !draft.assignees.length}
                className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink/60 ring-1 ring-ink/10"
                >
                  Cancel
                </button>
              )}
            </div>
            {message && <p className="text-xs text-mint">{message}</p>}
          </form>

          <div className="max-h-[28rem] space-y-2 overflow-y-auto">
            {sorted.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-2 rounded-xl border border-ink/5 bg-mist/40 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold text-ink">{task.label}</p>
                  <p className="text-[11px] text-ink/45">
                    {task.category} · {task.kind}
                    {task.kind === 'weekly' ? ` · ${task.weeklyGoal}×/week` : ''}
                    {task.kind === 'water' ? ` · ${task.waterGoal} glasses` : ''}
                    {' · '}
                    {assigneeLabel(task)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-ink ring-1 ring-ink/10"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeTask(task.id)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
