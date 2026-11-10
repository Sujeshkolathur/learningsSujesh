import { useEffect, useState } from 'react';
import { ENGAGEMENT_DATE, JOURNEY_START } from '../data/invitation';

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
  totalMs: number;
  progress: number;
}

function calc(): Countdown {
  const target = new Date(ENGAGEMENT_DATE).getTime();
  const start = new Date(JOURNEY_START).getTime();
  const now = Date.now();
  const diff = target - now;
  const totalSpan = Math.max(target - start, 1);

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: true,
      totalMs: 0,
      progress: 1,
    };
  }

  const elapsed = Math.min(Math.max(now - start, 0), totalSpan);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    finished: false,
    totalMs: diff,
    progress: elapsed / totalSpan,
  };
}

export function useCountdown() {
  const [countdown, setCountdown] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setCountdown(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return countdown;
}

/** How close the two figures are (0 = far apart, 1 = together) */
export function useFigureProximity(countdown: Countdown) {
  return countdown.progress;
}
