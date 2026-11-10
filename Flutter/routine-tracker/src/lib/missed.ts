import {
  PEOPLE,
  appliesTo,
  dailyTaskComplete,
  dailyTasksOf,
  isSunday,
  weeklyAtRisk,
  weeklyGoalMet,
  weeklyTasksOf,
  type DayProgress,
  type PersonId,
  type RoutineTask,
  type SharedDay,
  type SharedWeek,
  type WeekProgress,
} from '../data/routines';

export function getMissedDailyLabels(
  progress: DayProgress,
  tasks: RoutineTask[],
  person: PersonId
): string[] {
  return dailyTasksOf(tasks, person)
    .filter((task) => !dailyTaskComplete(task, progress))
    .map((t) => t.label);
}

export function getWeeklyAlertLabels(
  week: WeekProgress,
  tasks: RoutineTask[],
  person: PersonId,
  date?: string
): string[] {
  return weeklyTasksOf(tasks, person)
    .filter((task) => {
      if (weeklyGoalMet(task, week)) return false;
      if (isSunday(date)) return true;
      return weeklyAtRisk(task, week, date);
    })
    .map((t) => {
      const count = week.logs[t.id]?.length ?? 0;
      return `${t.label} (${count}/${t.weeklyGoal} this week)`;
    });
}

export function getMissedLabels(
  progress: DayProgress,
  week: WeekProgress | undefined,
  tasks: RoutineTask[],
  person: PersonId,
  date?: string
): string[] {
  const daily = getMissedDailyLabels(progress, tasks, person);
  const weekly = week ? getWeeklyAlertLabels(week, tasks, person, date) : [];
  return [...daily, ...weekly];
}

export function buildMissedWhatsAppMessage(
  whoMissed: PersonId,
  progress: DayProgress,
  dateLabel: string,
  tasks: RoutineTask[],
  week?: WeekProgress,
  dateKey?: string
) {
  const person = PEOPLE.find((p) => p.id === whoMissed)!;
  const missed = getMissedLabels(progress, week, tasks, whoMissed, dateKey);
  if (!missed.length) return null;

  const lines = missed.map((m, i) => `${i + 1}. ${m}`).join('\n');
  return (
    `Hey 👋 Reminder from Our Daily Routine\n\n` +
    `*${person.name}* still has incomplete items for *${dateLabel}*:\n\n` +
    `${lines}\n\n` +
    `Gentle nudge — finish them when you can 💪❤️`
  );
}

export function partnerOf(id: PersonId): PersonId {
  return id === 'sujesh' ? 'chaithu' : 'sujesh';
}

export function reminderHour() {
  const n = Number(import.meta.env.VITE_REMINDER_HOUR_IST ?? '21');
  return Number.isFinite(n) ? n : 21;
}

export function isPastReminderHour(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    }).format(now)
  );
  return hour >= reminderHour();
}

export function peopleWithMisses(day: SharedDay, tasks: RoutineTask[], week?: SharedWeek) {
  return (['chaithu', 'sujesh'] as PersonId[])
    .map((id) => ({
      id,
      name: PEOPLE.find((p) => p.id === id)!.name,
      missed: getMissedLabels(day.people[id], week?.people[id], tasks, id, day.date),
    }))
    .filter((p) => p.missed.length > 0);
}

export function waMeLink(phoneE164: string, text: string) {
  const digits = phoneE164.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export { appliesTo };
