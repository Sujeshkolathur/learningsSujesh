import {
  PEOPLE,
  dailyTasksOf,
  personDailyScore,
  personWeeklyScore,
  toggleWeeklyToday,
  weeklyTasksOf,
  type DayProgress,
  type PersonId,
  type RoutineTask,
  type WeekProgress,
} from '../data/routines';
import TaskCard from './TaskCard';

interface Props {
  personId: PersonId;
  tasks: RoutineTask[];
  progress: DayProgress;
  weekProgress: WeekProgress;
  weekLabel: string;
  isYou: boolean;
  onDayChange: (next: DayProgress) => void;
  onWeekChange: (next: WeekProgress) => void;
}

export default function PersonColumn({
  personId,
  tasks,
  progress,
  weekProgress,
  weekLabel,
  isYou,
  onDayChange,
  onWeekChange,
}: Props) {
  const person = PEOPLE.find((p) => p.id === personId)!;
  const daily = personDailyScore(progress, tasks, personId);
  const weekly = personWeeklyScore(weekProgress, tasks, personId);
  const dailyPct = daily.total ? Math.round((daily.done / daily.total) * 100) : 0;

  const healthDaily = dailyTasksOf(tasks, personId).filter((t) => t.category === 'health');
  const careerDaily = dailyTasksOf(tasks, personId).filter((t) => t.category === 'career');
  const weeklyList = weeklyTasksOf(tasks, personId);

  function patchDay(partial: Partial<DayProgress>) {
    onDayChange({ ...progress, ...partial });
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-ink/40">
              {isYou ? 'Your day' : 'Their day'}
            </p>
            <h2 className="font-display text-xl font-bold" style={{ color: person.color }}>
              {person.name}
            </h2>
          </div>
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-ink">
              {daily.done}/{daily.total}
            </p>
            <p className="text-xs text-ink/45">daily · {dailyPct}%</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${dailyPct}%`, backgroundColor: person.color }}
          />
        </div>
        <p className="mt-2 text-xs text-ink/45">
          Weekly goals: {weekly.done}/{weekly.total} · {weekLabel}
        </p>
        {!isYou && (
          <p className="mt-1 text-xs text-ink/40">View only — switch to {person.name} to edit</p>
        )}
      </header>

      {healthDaily.length > 0 && (
        <div>
          <h3 className="mb-2 px-1 font-display text-sm font-semibold uppercase tracking-wide text-mint">
            1. Health — daily
          </h3>
          <div className="flex flex-col gap-3">
            {healthDaily.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                progress={progress}
                editable={isYou}
                accent={person.color}
                onToggle={() =>
                  patchDay({
                    done: { ...progress.done, [task.id]: !progress.done[task.id] },
                  })
                }
                onWater={(delta) =>
                  patchDay({ water: Math.max(0, Math.min(20, progress.water + delta)) })
                }
                onMeal={(mealId) =>
                  patchDay({
                    meals: { ...progress.meals, [mealId]: !progress.meals[mealId] },
                  })
                }
              />
            ))}
          </div>
        </div>
      )}

      {weeklyList.length > 0 && (
        <div>
          <h3 className="mb-2 px-1 font-display text-sm font-semibold uppercase tracking-wide text-sky">
            Health — this week
          </h3>
          <div className="flex flex-col gap-3">
            {weeklyList.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                progress={progress}
                weekProgress={weekProgress}
                editable={isYou}
                accent={person.color}
                onToggle={() => {}}
                onWater={() => {}}
                onMeal={() => {}}
                onWeeklyToggle={() =>
                  onWeekChange(
                    toggleWeeklyToday(weekProgress, task.id, undefined, task.weeklyGoal ?? 99)
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {careerDaily.length > 0 && (
        <div>
          <h3 className="mb-2 px-1 font-display text-sm font-semibold uppercase tracking-wide text-amber">
            2. Career — daily
          </h3>
          <div className="flex flex-col gap-3">
            {careerDaily.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                progress={progress}
                editable={isYou}
                accent={person.color}
                onToggle={() =>
                  patchDay({
                    done: { ...progress.done, [task.id]: !progress.done[task.id] },
                  })
                }
                onWater={() => {}}
                onMeal={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {!healthDaily.length && !weeklyList.length && !careerDaily.length && (
        <p className="rounded-2xl bg-white p-4 text-sm text-ink/50 shadow-sm">
          No tasks assigned to {person.name} yet. Admin can add some.
        </p>
      )}
    </section>
  );
}
