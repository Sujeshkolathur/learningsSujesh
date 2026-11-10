import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_TASKS, type RoutineTask } from '../data/routines';
import { saveTasks, subscribeTasks } from '../lib/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<RoutineTask[]>(() => DEFAULT_TASKS.map((t) => ({ ...t })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeTasks(
      (list) => {
        setTasks(list);
        setLoading(false);
      },
      (msg) => {
        setError(msg);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const replaceTasks = useCallback(async (next: RoutineTask[]) => {
    setSaving(true);
    setError(null);
    try {
      const saved = await saveTasks(next);
      setTasks(saved);
      return saved;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save tasks');
      throw e;
    } finally {
      setSaving(false);
    }
  }, []);

  return { tasks, loading, error, saving, replaceTasks };
}
