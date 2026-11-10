export type PersonId = 'chaithu' | 'sujesh';

export interface Person {
  id: PersonId;
  name: string;
  color: string;
  accent: string;
}

export const PEOPLE: Person[] = [
  { id: 'chaithu', name: 'Chaithu', color: '#9b8ab8', accent: 'bg-chaithu' },
  { id: 'sujesh', name: 'Sujesh', color: '#1e3a5f', accent: 'bg-sujesh' },
];

export type TaskKind = 'checkbox' | 'water' | 'meals' | 'weekly';
export type TaskCategory = 'health' | 'career';

export interface RoutineTask {
  id: string;
  category: TaskCategory;
  label: string;
  hint?: string;
  kind: TaskKind;
  waterGoal?: number;
  weeklyGoal?: number;
  meals?: { id: string; label: string; timeHint: string }[];
  /** Who this task applies to — both by default */
  assignees: PersonId[];
}

export function appliesTo(task: RoutineTask, person: PersonId): boolean {
  if (!task.assignees?.length) return true;
  return task.assignees.includes(person);
}

export function dailyTasksOf(tasks: RoutineTask[], person?: PersonId) {
  return tasks.filter(
    (t) => t.kind !== 'weekly' && (person ? appliesTo(t, person) : true)
  );
}

export function weeklyTasksOf(tasks: RoutineTask[], person?: PersonId) {
  return tasks.filter(
    (t) => t.kind === 'weekly' && (person ? appliesTo(t, person) : true)
  );
}

/** Default catalog — seeded into Firebase / local when empty */
export const DEFAULT_TASKS: RoutineTask[] = [
  {
    id: 'wake_water',
    category: 'health',
    label: 'Drink water when you wake up',
    hint: 'First glass after waking',
    kind: 'checkbox',
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'meals',
    category: 'health',
    label: 'Have food on time',
    hint: 'Tick each meal as you eat',
    kind: 'meals',
    meals: [
      { id: 'breakfast', label: 'Breakfast', timeHint: 'Morning' },
      { id: 'lunch', label: 'Lunch', timeHint: 'Afternoon' },
      { id: 'dinner', label: 'Dinner', timeHint: 'Evening' },
    ],
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'water_intake',
    category: 'health',
    label: 'Drink enough water',
    hint: 'Goal: 8 glasses today',
    kind: 'water',
    waterGoal: 8,
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'upskill',
    category: 'career',
    label: 'Learn something new — 30 minutes',
    hint: 'Upskill daily',
    kind: 'checkbox',
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'skin_care',
    category: 'health',
    label: 'Skin care',
    hint: 'Twice a week',
    kind: 'weekly',
    weeklyGoal: 2,
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'hair_care',
    category: 'health',
    label: 'Hair care',
    hint: 'Twice a week',
    kind: 'weekly',
    weeklyGoal: 2,
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'gym',
    category: 'health',
    label: 'Gym',
    hint: '6 days a week',
    kind: 'weekly',
    weeklyGoal: 6,
    assignees: ['chaithu', 'sujesh'],
  },
  {
    id: 'cardio',
    category: 'health',
    label: 'Cardio',
    hint: 'Once a week',
    kind: 'weekly',
    weeklyGoal: 1,
    assignees: ['chaithu', 'sujesh'],
  },
];

/** @deprecated use DEFAULT_TASKS + dailyTasksOf */
export const DAILY_TASKS = dailyTasksOf(DEFAULT_TASKS);
/** @deprecated use DEFAULT_TASKS + weeklyTasksOf */
export const WEEKLY_TASKS = weeklyTasksOf(DEFAULT_TASKS);
export const ROUTINE_TASKS = DEFAULT_TASKS;

export interface DayProgress {
  done: Record<string, boolean>;
  water: number;
  meals: Record<string, boolean>;
  updatedAt: string;
  updatedBy: PersonId | null;
}

export function emptyProgress(): DayProgress {
  return {
    done: {},
    water: 0,
    meals: {},
    updatedAt: new Date().toISOString(),
    updatedBy: null,
  };
}

export interface SharedDay {
  date: string;
  people: Record<PersonId, DayProgress>;
}

export interface WeekProgress {
  logs: Record<string, string[]>;
  updatedAt: string;
  updatedBy: PersonId | null;
}

export function emptyWeekProgress(): WeekProgress {
  return {
    logs: {},
    updatedAt: new Date().toISOString(),
    updatedBy: null,
  };
}

export interface SharedWeek {
  weekKey: string;
  label: string;
  people: Record<PersonId, WeekProgress>;
}

export interface TaskCatalog {
  tasks: RoutineTask[];
  updatedAt: string;
}

export function todayKey(d = new Date()) {
  return formatYmdInTz(d, 'Asia/Kolkata');
}

function formatYmdInTz(d: Date, timeZone: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function weekStartKey(dateKey = todayKey()) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(new Date(`${dateKey}T12:00:00+05:30`));
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  const offset = map[weekday] ?? 0;
  const monday = new Date(`${dateKey}T12:00:00+05:30`);
  monday.setDate(monday.getDate() - offset);
  return formatYmdInTz(monday, 'Asia/Kolkata');
}

export function weekKey(dateKey = todayKey()) {
  return `w-${weekStartKey(dateKey)}`;
}

export function weekLabel(dateKey = todayKey()) {
  const start = weekStartKey(dateKey);
  const [y, m, d] = start.split('-').map(Number);
  const mon = new Date(y, m - 1, d);
  const sun = new Date(y, m - 1, d + 6);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return `${fmt(mon)} – ${fmt(sun)}`;
}

export function daysLeftInWeek(dateKey = todayKey()) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(new Date(`${dateKey}T12:00:00+05:30`));
  const map: Record<string, number> = { Mon: 7, Tue: 6, Wed: 5, Thu: 4, Fri: 3, Sat: 2, Sun: 1 };
  return map[weekday] ?? 1;
}

export function isSunday(dateKey = todayKey()) {
  return daysLeftInWeek(dateKey) === 1;
}

export function formatDisplayDate(key: string) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function dailyTaskComplete(task: RoutineTask, progress: DayProgress): boolean {
  if (task.kind === 'checkbox') return Boolean(progress.done[task.id]);
  if (task.kind === 'water') return progress.water >= (task.waterGoal ?? 8);
  if (task.kind === 'meals') {
    return (task.meals ?? []).every((meal) => progress.meals[meal.id]);
  }
  return false;
}

export function weeklyCount(taskId: string, week: WeekProgress): number {
  return week.logs[taskId]?.length ?? 0;
}

export function weeklyDoneToday(taskId: string, week: WeekProgress, date = todayKey()): boolean {
  return (week.logs[taskId] ?? []).includes(date);
}

export function weeklyGoalMet(task: RoutineTask, week: WeekProgress): boolean {
  return weeklyCount(task.id, week) >= (task.weeklyGoal ?? 0);
}

export function taskComplete(task: RoutineTask, progress: DayProgress): boolean {
  if (task.kind === 'weekly') return false;
  return dailyTaskComplete(task, progress);
}

export function personDailyScore(
  progress: DayProgress,
  tasks: RoutineTask[],
  person: PersonId
): { done: number; total: number } {
  const list = dailyTasksOf(tasks, person);
  let done = 0;
  for (const task of list) {
    if (dailyTaskComplete(task, progress)) done += 1;
  }
  return { done, total: list.length };
}

export function personWeeklyScore(
  week: WeekProgress,
  tasks: RoutineTask[],
  person: PersonId
): { done: number; total: number } {
  const list = weeklyTasksOf(tasks, person);
  let done = 0;
  for (const task of list) {
    if (weeklyGoalMet(task, week)) done += 1;
  }
  return { done, total: list.length };
}

export function toggleWeeklyToday(
  week: WeekProgress,
  taskId: string,
  date = todayKey(),
  goal = 99
): WeekProgress {
  const current = [...(week.logs[taskId] ?? [])];
  const idx = current.indexOf(date);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else if (current.length < goal) {
    current.push(date);
    current.sort();
  }
  return {
    ...week,
    logs: { ...week.logs, [taskId]: current },
  };
}

export function weeklyAtRisk(task: RoutineTask, week: WeekProgress, date = todayKey()): boolean {
  const goal = task.weeklyGoal ?? 0;
  const count = weeklyCount(task.id, week);
  if (count >= goal) return false;
  const need = goal - count;
  const left = daysLeftInWeek(date);
  const doneToday = weeklyDoneToday(task.id, week, date);
  const available = doneToday ? left - 1 : left;
  return need > available;
}

export function newTaskId() {
  return `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeTask(raw: Partial<RoutineTask> & { id: string; label: string }): RoutineTask {
  const kind = raw.kind ?? 'checkbox';
  const assignees =
    raw.assignees?.length ? raw.assignees : (['chaithu', 'sujesh'] as PersonId[]);

  const task: RoutineTask = {
    id: raw.id,
    category: raw.category ?? 'health',
    label: raw.label.trim(),
    kind,
    assignees,
  };

  const hint = raw.hint?.trim();
  if (hint) task.hint = hint;

  if (kind === 'water') task.waterGoal = raw.waterGoal ?? 8;
  if (kind === 'weekly') task.weeklyGoal = raw.weeklyGoal ?? 1;
  if (kind === 'meals') {
    task.meals =
      raw.meals ??
      [
        { id: 'breakfast', label: 'Breakfast', timeHint: 'Morning' },
        { id: 'lunch', label: 'Lunch', timeHint: 'Afternoon' },
        { id: 'dinner', label: 'Dinner', timeHint: 'Evening' },
      ];
  }

  return task;
}

/** Firestore rejects `undefined` — strip before write */
export function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
