import { useEffect, useState } from 'react';
import AdminPanel from './components/AdminPanel';
import MissedAlert from './components/MissedAlert';
import PersonAuthModal from './components/PersonAuthModal';
import PersonColumn from './components/PersonColumn';
import PersonPicker from './components/PersonPicker';
import { PEOPLE, formatDisplayDate, type PersonId } from './data/routines';
import { usePins } from './hooks/usePins';
import { useRoutineDay } from './hooks/useRoutineDay';
import { useTasks } from './hooks/useTasks';
import { HOUSEHOLD_ID, isFirebaseConfigured, todayKey } from './lib/storage';

const WHO_KEY = 'routine_who_am_i';
const AUTH_KEY = 'routine_person_auth';

function readAuth(): PersonId | null {
  const v = sessionStorage.getItem(AUTH_KEY);
  return v === 'chaithu' || v === 'sujesh' ? v : null;
}

export default function App() {
  const [who, setWho] = useState<PersonId | null>(() => readAuth());
  const [authPerson, setAuthPerson] = useState<PersonId | null>(() => readAuth());
  const [pendingPerson, setPendingPerson] = useState<PersonId | null>(null);
  const [authMode, setAuthMode] = useState<'create' | 'unlock' | 'change'>('unlock');

  const date = todayKey();
  const { day, week, loading, error, saving, updateDay, updateWeek } = useRoutineDay(date);
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    saving: tasksSaving,
    replaceTasks,
  } = useTasks();
  const { loading: pinsLoading, hasPin, createPin, checkPin } = usePins();
  const synced = isFirebaseConfigured();

  useEffect(() => {
    if (who) localStorage.setItem(WHO_KEY, who);
  }, [who]);

  function unlock(person: PersonId) {
    sessionStorage.setItem(AUTH_KEY, person);
    setAuthPerson(person);
    setWho(person);
    setPendingPerson(null);
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthPerson(null);
    setWho(null);
    setPendingPerson(null);
  }

  function requestPerson(id: PersonId) {
    if (authPerson === id) {
      setWho(id);
      return;
    }
    setPendingPerson(id);
    setAuthMode(hasPin(id) ? 'unlock' : 'create');
  }

  function requestChangePin() {
    if (!authPerson) return;
    setPendingPerson(authPerson);
    setAuthMode('change');
  }

  const other: PersonId | null =
    who === 'sujesh' ? 'chaithu' : who === 'chaithu' ? 'sujesh' : null;
  const busy = loading || tasksLoading || pinsLoading;
  const authenticated = Boolean(authPerson && who === authPerson);

  return (
    <div className="min-h-dvh bg-mist">
      <header className="border-b border-black/5 bg-white/90 px-4 py-5 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40">
            Chaithu & Sujesh
          </p>
          <h1 className="font-display mt-1 text-2xl font-bold text-ink sm:text-3xl">
            Daily Routine Tracker
          </h1>
          <p className="mt-1 text-sm text-ink/55">{formatDisplayDate(date)}</p>

          <div className="mt-4">
            <PersonPicker
              value={who}
              authenticated={authPerson}
              onSelect={requestPerson}
              onLogout={logout}
              onChangePin={requestChangePin}
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${
                synced ? 'bg-mint/15 text-mint' : 'bg-amber/15 text-amber'
              }`}
            >
              {synced ? '● Live sync on' : '○ Local only — add Firebase for share'}
            </span>
            {authenticated && (
              <span className="rounded-full bg-ink/5 px-2.5 py-1 font-medium text-ink/60">
                Unlocked as {PEOPLE.find((p) => p.id === authPerson)?.name}
              </span>
            )}
            {(saving || tasksSaving) && <span className="text-ink/40">Saving…</span>}
            {(error || tasksError) && (
              <span className="text-red-600">{error || tasksError}</span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {busy ? (
          <p className="py-16 text-center text-ink/50">Loading…</p>
        ) : !authenticated || !who || !other ? (
          <div className="rounded-2xl border border-dashed border-ink/15 bg-white/70 px-6 py-16 text-center">
            <p className="font-display text-xl font-semibold text-ink">Who are you?</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">
              Tap <strong>I am Chaithu</strong> or <strong>I am Sujesh</strong>. First time you set a
              PIN; next times you enter that PIN to unlock and update your routines.
            </p>
          </div>
        ) : (
          <>
            <AdminPanel tasks={tasks} onSave={replaceTasks} saving={tasksSaving} />
            <MissedAlert day={day} week={week} tasks={tasks} who={who} />
            <div className="grid gap-8 lg:grid-cols-2">
              <PersonColumn
                personId={who}
                tasks={tasks}
                progress={day.people[who]}
                weekProgress={week.people[who]}
                weekLabel={week.label}
                isYou
                onDayChange={(next) => void updateDay(who, next)}
                onWeekChange={(next) => void updateWeek(who, next)}
              />
              <PersonColumn
                personId={other}
                tasks={tasks}
                progress={day.people[other]}
                weekProgress={week.people[other]}
                weekLabel={week.label}
                isYou={false}
                onDayChange={() => {}}
                onWeekChange={() => {}}
              />
            </div>
          </>
        )}

        <footer className="mt-10 rounded-2xl border border-dashed border-ink/10 bg-white/60 p-4 text-center text-xs text-ink/45">
          Household: <code className="text-ink/60">{HOUSEHOLD_ID}</code>
          <br />
          Each person has their own PIN. Admin PIN manages the shared task list.
        </footer>
      </main>

      {pendingPerson && (
        <PersonAuthModal
          personId={pendingPerson}
          mode={authMode}
          onCancel={() => setPendingPerson(null)}
          onCreate={async (pin) => {
            await createPin(pendingPerson, pin);
          }}
          onVerify={async (pin) => checkPin(pendingPerson, pin)}
          onSuccess={() => unlock(pendingPerson)}
        />
      )}
    </div>
  );
}
