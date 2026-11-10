import type { DayProgress, RoutineTask, WeekProgress } from '../data/routines';
import {
  dailyTaskComplete,
  weeklyCount,
  weeklyDoneToday,
  weeklyGoalMet,
} from '../data/routines';

interface Props {
  task: RoutineTask;
  progress: DayProgress;
  weekProgress?: WeekProgress;
  editable: boolean;
  accent: string;
  onToggle: () => void;
  onWater: (delta: number) => void;
  onMeal: (mealId: string) => void;
  onWeeklyToggle?: () => void;
}

export default function TaskCard({
  task,
  progress,
  weekProgress,
  editable,
  accent,
  onToggle,
  onWater,
  onMeal,
  onWeeklyToggle,
}: Props) {
  const isWeekly = task.kind === 'weekly';
  const count = weekProgress ? weeklyCount(task.id, weekProgress) : 0;
  const goal = task.weeklyGoal ?? 0;
  const doneToday = weekProgress ? weeklyDoneToday(task.id, weekProgress) : false;
  const goalMet = weekProgress ? weeklyGoalMet(task, weekProgress) : false;
  const done = isWeekly ? goalMet : dailyTaskComplete(task, progress);

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition ${
        done ? 'border-mint/40 bg-mint/5' : 'border-black/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {task.kind === 'checkbox' && (
          <button
            type="button"
            disabled={!editable}
            onClick={onToggle}
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition ${
              done ? 'border-mint bg-mint text-white' : 'border-ink/20'
            } ${editable ? 'cursor-pointer' : 'cursor-default opacity-80'}`}
            aria-pressed={done}
            aria-label={task.label}
          >
            {done ? '✓' : ''}
          </button>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base font-semibold text-ink">{task.label}</h3>
              {task.hint && <p className="mt-0.5 text-sm text-ink/50">{task.hint}</p>}
            </div>
            {isWeekly && (
              <span className="shrink-0 rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-ink/70">
                {count}/{goal} this week
              </span>
            )}
          </div>

          {task.kind === 'water' && (
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-sky">
                  {progress.water} / {task.waterGoal ?? 8} glasses
                </span>
                {done && <span className="text-mint">Goal met ✓</span>}
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-sky transition-all"
                  style={{
                    width: `${Math.min(100, (progress.water / (task.waterGoal ?? 8)) * 100)}%`,
                  }}
                />
              </div>
              {editable && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onWater(-1)}
                    disabled={progress.water <= 0}
                    className="rounded-xl bg-mist px-4 py-2 text-sm font-semibold text-ink disabled:opacity-40"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => onWater(1)}
                    className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    + Add glass
                  </button>
                </div>
              )}
            </div>
          )}

          {task.kind === 'meals' && (
            <div className="mt-3 grid gap-2">
              {(task.meals ?? []).map((meal) => {
                const checked = Boolean(progress.meals[meal.id]);
                return (
                  <button
                    key={meal.id}
                    type="button"
                    disabled={!editable}
                    onClick={() => onMeal(meal.id)}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                      checked
                        ? 'border-mint/40 bg-mint/10 text-ink'
                        : 'border-black/8 bg-mist/60 text-ink/80'
                    } ${editable ? '' : 'cursor-default'}`}
                  >
                    <span>
                      <strong className="font-semibold">{meal.label}</strong>
                      <span className="ml-2 text-ink/45">{meal.timeHint}</span>
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md text-xs ${
                        checked ? 'bg-mint text-white' : 'bg-white text-ink/30 ring-1 ring-ink/15'
                      }`}
                    >
                      {checked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {isWeekly && (
            <div className="mt-3">
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (count / Math.max(goal, 1)) * 100)}%`,
                    backgroundColor: accent,
                  }}
                />
              </div>
              {editable && (
                <button
                  type="button"
                  onClick={onWeeklyToggle}
                  disabled={!doneToday && goalMet}
                  className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-40 ${
                    doneToday
                      ? 'bg-mint/15 text-mint ring-1 ring-mint/30'
                      : 'text-white'
                  }`}
                  style={!doneToday ? { backgroundColor: accent } : undefined}
                >
                  {doneToday
                    ? '✓ Done today — tap to undo'
                    : goalMet
                      ? 'Weekly goal complete'
                      : 'Mark done for today'}
                </button>
              )}
              {!editable && doneToday && (
                <p className="text-xs font-medium text-mint">Done today ✓</p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
