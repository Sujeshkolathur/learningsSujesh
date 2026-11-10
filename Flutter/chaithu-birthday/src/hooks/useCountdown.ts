import { useEffect, useState } from 'react';
import { ENGAGEMENT_DATE } from '../data/story';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

function calc(target: Date): Countdown {
  const now = Date.now();
  const diff = target.getTime() - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, finished: false };
}

export function useCountdown(dateStr = ENGAGEMENT_DATE) {
  const target = new Date(dateStr);
  const [countdown, setCountdown] = useState(() => calc(target));

  useEffect(() => {
    const id = setInterval(() => setCountdown(calc(target)), 1000);
    return () => clearInterval(id);
  }, [dateStr]);

  return countdown;
}
