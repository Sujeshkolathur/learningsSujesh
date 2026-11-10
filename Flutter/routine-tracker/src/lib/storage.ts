import {
  doc,
  onSnapshot,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  DEFAULT_TASKS,
  emptyProgress,
  emptyWeekProgress,
  normalizeTask,
  stripUndefined,
  todayKey,
  weekKey,
  weekLabel,
  type DayProgress,
  type PersonId,
  type RoutineTask,
  type SharedDay,
  type SharedWeek,
  type TaskCatalog,
  type WeekProgress,
} from '../data/routines';
import { getDb, HOUSEHOLD_ID, isFirebaseConfigured } from './firebase';
import { hashPin } from './pins';

const LOCAL_DAY = 'routine_day_';
const LOCAL_WEEK = 'routine_week_';
const LOCAL_TASKS = 'routine_tasks_';
const LOCAL_PINS = 'routine_pins_';

export interface PersonPinRecord {
  hash: string;
  setAt: string;
}

export interface PinsDoc {
  chaithu: PersonPinRecord | null;
  sujesh: PersonPinRecord | null;
  updatedAt: string;
}

function dayLocalKey(date: string) {
  return `${LOCAL_DAY}${HOUSEHOLD_ID}_${date}`;
}

function weekLocalKey(key: string) {
  return `${LOCAL_WEEK}${HOUSEHOLD_ID}_${key}`;
}

function emptyDay(date: string): SharedDay {
  return {
    date,
    people: {
      chaithu: emptyProgress(),
      sujesh: emptyProgress(),
    },
  };
}

function emptyWeek(key: string, dateHint = todayKey()): SharedWeek {
  return {
    weekKey: key,
    label: weekLabel(dateHint),
    people: {
      chaithu: emptyWeekProgress(),
      sujesh: emptyWeekProgress(),
    },
  };
}

function readLocalDay(date: string): SharedDay {
  try {
    const raw = localStorage.getItem(dayLocalKey(date));
    if (raw) return JSON.parse(raw) as SharedDay;
  } catch {
    /* ignore */
  }
  return emptyDay(date);
}

function writeLocalDay(day: SharedDay) {
  localStorage.setItem(dayLocalKey(day.date), JSON.stringify(day));
}

function readLocalWeek(key: string): SharedWeek {
  try {
    const raw = localStorage.getItem(weekLocalKey(key));
    if (raw) return JSON.parse(raw) as SharedWeek;
  } catch {
    /* ignore */
  }
  return emptyWeek(key);
}

function writeLocalWeek(week: SharedWeek) {
  localStorage.setItem(weekLocalKey(week.weekKey), JSON.stringify(week));
}

export function subscribeDay(
  date: string,
  onData: (day: SharedDay) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const db = getDb();

  if (!db) {
    onData(readLocalDay(date));
    const handler = (e: StorageEvent) => {
      if (e.key === dayLocalKey(date) && e.newValue) {
        try {
          onData(JSON.parse(e.newValue) as SharedDay);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const ref = doc(db, 'households', HOUSEHOLD_ID, 'days', date);
  return onSnapshot(
    ref,
    (snap) => {
      onData(snap.exists() ? (snap.data() as SharedDay) : emptyDay(date));
    },
    (err) => {
      onError?.(err.message);
      onData(readLocalDay(date));
    }
  );
}

export function subscribeWeek(
  key: string,
  onData: (week: SharedWeek) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const db = getDb();

  if (!db) {
    onData(readLocalWeek(key));
    const handler = (e: StorageEvent) => {
      if (e.key === weekLocalKey(key) && e.newValue) {
        try {
          onData(JSON.parse(e.newValue) as SharedWeek);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const ref = doc(db, 'households', HOUSEHOLD_ID, 'weeks', key);
  return onSnapshot(
    ref,
    (snap) => {
      onData(snap.exists() ? (snap.data() as SharedWeek) : emptyWeek(key));
    },
    (err) => {
      onError?.(err.message);
      onData(readLocalWeek(key));
    }
  );
}

export async function savePersonProgress(
  date: string,
  person: PersonId,
  progress: DayProgress,
  current: SharedDay
): Promise<SharedDay> {
  const next: SharedDay = {
    date,
    people: {
      ...current.people,
      [person]: {
        ...progress,
        updatedAt: new Date().toISOString(),
        updatedBy: person,
      },
    },
  };

  writeLocalDay(next);

  const db = getDb();
  if (db) {
    await setDoc(doc(db, 'households', HOUSEHOLD_ID, 'days', date), next, { merge: true });
  }

  return next;
}

export async function savePersonWeek(
  key: string,
  person: PersonId,
  progress: WeekProgress,
  current: SharedWeek
): Promise<SharedWeek> {
  const next: SharedWeek = {
    weekKey: key,
    label: current.label || weekLabel(),
    people: {
      ...current.people,
      [person]: {
        ...progress,
        updatedAt: new Date().toISOString(),
        updatedBy: person,
      },
    },
  };

  writeLocalWeek(next);

  const db = getDb();
  if (db) {
    await setDoc(doc(db, 'households', HOUSEHOLD_ID, 'weeks', key), next, { merge: true });
  }

  return next;
}

function tasksLocalKey() {
  return `${LOCAL_TASKS}${HOUSEHOLD_ID}`;
}

function readLocalTasks(): RoutineTask[] {
  try {
    const raw = localStorage.getItem(tasksLocalKey());
    if (raw) {
      const parsed = JSON.parse(raw) as TaskCatalog;
      if (Array.isArray(parsed.tasks) && parsed.tasks.length) {
        return parsed.tasks.map((t) => normalizeTask(t));
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_TASKS.map((t) => ({ ...t }));
}

function writeLocalTasks(tasks: RoutineTask[]) {
  const catalog: TaskCatalog = { tasks, updatedAt: new Date().toISOString() };
  localStorage.setItem(tasksLocalKey(), JSON.stringify(catalog));
}

export function subscribeTasks(
  onData: (tasks: RoutineTask[]) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const db = getDb();

  if (!db) {
    onData(readLocalTasks());
    const handler = (e: StorageEvent) => {
      if (e.key === tasksLocalKey() && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as TaskCatalog;
          onData((parsed.tasks ?? []).map((t) => normalizeTask(t)));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const ref = doc(db, 'households', HOUSEHOLD_ID, 'config', 'tasks');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as TaskCatalog;
        const list = (data.tasks ?? []).map((t) => normalizeTask(t));
        onData(list.length ? list : DEFAULT_TASKS.map((t) => ({ ...t })));
      } else {
        onData(DEFAULT_TASKS.map((t) => ({ ...t })));
      }
    },
    (err) => {
      onError?.(err.message);
      onData(readLocalTasks());
    }
  );
}

export async function saveTasks(tasks: RoutineTask[]): Promise<RoutineTask[]> {
  const normalized = tasks.map((t) => normalizeTask(t));
  writeLocalTasks(normalized);

  const catalog = stripUndefined({
    tasks: normalized,
    updatedAt: new Date().toISOString(),
  } satisfies TaskCatalog);

  const db = getDb();
  if (db) {
    await setDoc(doc(db, 'households', HOUSEHOLD_ID, 'config', 'tasks'), catalog);
  }

  return normalized;
}

function emptyPins(): PinsDoc {
  return {
    chaithu: null,
    sujesh: null,
    updatedAt: new Date().toISOString(),
  };
}

function pinsLocalKey() {
  return `${LOCAL_PINS}${HOUSEHOLD_ID}`;
}

function readLocalPins(): PinsDoc {
  try {
    const raw = localStorage.getItem(pinsLocalKey());
    if (raw) return JSON.parse(raw) as PinsDoc;
  } catch {
    /* ignore */
  }
  return emptyPins();
}

function writeLocalPins(pins: PinsDoc) {
  localStorage.setItem(pinsLocalKey(), JSON.stringify(pins));
}

export function subscribePins(
  onData: (pins: PinsDoc) => void,
  onError?: (message: string) => void
): Unsubscribe {
  const db = getDb();

  if (!db) {
    onData(readLocalPins());
    const handler = (e: StorageEvent) => {
      if (e.key === pinsLocalKey() && e.newValue) {
        try {
          onData(JSON.parse(e.newValue) as PinsDoc);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  const ref = doc(db, 'households', HOUSEHOLD_ID, 'config', 'pins');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as PinsDoc;
        onData({
          chaithu: data.chaithu ?? null,
          sujesh: data.sujesh ?? null,
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      } else {
        onData(emptyPins());
      }
    },
    (err) => {
      onError?.(err.message);
      onData(readLocalPins());
    }
  );
}

export async function setPersonPin(
  person: PersonId,
  pin: string,
  currentPins?: PinsDoc
): Promise<PinsDoc> {
  const hash = await hashPin(pin, HOUSEHOLD_ID);
  const base = currentPins ?? readLocalPins();
  const next: PinsDoc = {
    chaithu: base.chaithu,
    sujesh: base.sujesh,
    [person]: { hash, setAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  };

  const db = getDb();
  if (db) {
    const ref = doc(db, 'households', HOUSEHOLD_ID, 'config', 'pins');
    await setDoc(
      ref,
      {
        [person]: next[person],
        updatedAt: next.updatedAt,
      },
      { merge: true }
    );
  }

  writeLocalPins(next);
  return next;
}

export { todayKey, weekKey, isFirebaseConfigured, HOUSEHOLD_ID };
