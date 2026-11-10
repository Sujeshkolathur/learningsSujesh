import { useCallback, useEffect, useState } from 'react';
import {
  emptyProgress,
  emptyWeekProgress,
  weekKey,
  weekLabel,
  type DayProgress,
  type PersonId,
  type SharedDay,
  type SharedWeek,
  type WeekProgress,
} from '../data/routines';
import {
  savePersonProgress,
  savePersonWeek,
  subscribeDay,
  subscribeWeek,
  todayKey,
} from '../lib/storage';

export function useRoutineDay(date = todayKey()) {
  const wKey = weekKey(date);
  const [day, setDay] = useState<SharedDay>({
    date,
    people: {
      chaithu: emptyProgress(),
      sujesh: emptyProgress(),
    },
  });
  const [week, setWeek] = useState<SharedWeek>({
    weekKey: wKey,
    label: weekLabel(date),
    people: {
      chaithu: emptyWeekProgress(),
      sujesh: emptyWeekProgress(),
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dayReady, setDayReady] = useState(false);
  const [weekReady, setWeekReady] = useState(false);

  useEffect(() => {
    setLoading(true);
    setDayReady(false);
    setWeekReady(false);

    const unsubDay = subscribeDay(
      date,
      (data) => {
        setDay(data);
        setDayReady(true);
      },
      (msg) => setError(msg)
    );
    const unsubWeek = subscribeWeek(
      wKey,
      (data) => {
        setWeek(data);
        setWeekReady(true);
      },
      (msg) => setError(msg)
    );

    return () => {
      unsubDay();
      unsubWeek();
    };
  }, [date, wKey]);

  useEffect(() => {
    if (dayReady && weekReady) setLoading(false);
  }, [dayReady, weekReady]);

  const updateDay = useCallback(
    async (person: PersonId, progress: DayProgress) => {
      setSaving(true);
      setError(null);
      try {
        const next = await savePersonProgress(date, person, progress, day);
        setDay(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save');
      } finally {
        setSaving(false);
      }
    },
    [date, day]
  );

  const updateWeek = useCallback(
    async (person: PersonId, progress: WeekProgress) => {
      setSaving(true);
      setError(null);
      try {
        const next = await savePersonWeek(wKey, person, progress, week);
        setWeek(next);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not save week');
      } finally {
        setSaving(false);
      }
    },
    [wKey, week]
  );

  return { day, week, loading, error, saving, updateDay, updateWeek };
}
