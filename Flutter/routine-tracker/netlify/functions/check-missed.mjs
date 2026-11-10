/**
 * Scheduled evening check — notifies partner on WhatsApp for incomplete routines.
 * Cron: 30 15 * * *  → 15:30 UTC = 9:00 PM IST
 * Loads task catalog from Firestore when available.
 */

import { initializeApp, getApps } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const DEFAULT_TASKS = [
  { id: 'wake_water', label: 'Drink water when you wake up', kind: 'checkbox', assignees: ['chaithu', 'sujesh'] },
  {
    id: 'meals',
    label: 'Have food on time',
    kind: 'meals',
    meals: [{ id: 'breakfast' }, { id: 'lunch' }, { id: 'dinner' }],
    assignees: ['chaithu', 'sujesh'],
  },
  { id: 'water_intake', label: 'Drink enough water', kind: 'water', waterGoal: 8, assignees: ['chaithu', 'sujesh'] },
  { id: 'upskill', label: 'Learn something new — 30 minutes', kind: 'checkbox', assignees: ['chaithu', 'sujesh'] },
  { id: 'skin_care', label: 'Skin care', kind: 'weekly', weeklyGoal: 2, assignees: ['chaithu', 'sujesh'] },
  { id: 'hair_care', label: 'Hair care', kind: 'weekly', weeklyGoal: 2, assignees: ['chaithu', 'sujesh'] },
  { id: 'gym', label: 'Gym', kind: 'weekly', weeklyGoal: 6, assignees: ['chaithu', 'sujesh'] },
  { id: 'cardio', label: 'Cardio', kind: 'weekly', weeklyGoal: 1, assignees: ['chaithu', 'sujesh'] },
];

const PARTNERS = {
  chaithu: {
    name: 'Chaithu',
    phone: process.env.CHAITHU_WHATSAPP || process.env.VITE_CHAITHU_WHATSAPP || '919744415022',
    apikey: process.env.CHAITHU_CALLMEBOT_APIKEY || '',
  },
  sujesh: {
    name: 'Sujesh',
    phone: process.env.SUJESH_WHATSAPP || process.env.VITE_SUJESH_WHATSAPP || '919526494378',
    apikey: process.env.SUJESH_CALLMEBOT_APIKEY || '',
  },
};

function todayKeyIST() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function weekStartKey(dateKey) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(new Date(`${dateKey}T12:00:00+05:30`));
  const map = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  const offset = map[weekday] ?? 0;
  const monday = new Date(`${dateKey}T12:00:00+05:30`);
  monday.setDate(monday.getDate() - offset);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(monday);
}

function daysLeftInWeek(dateKey) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
  }).format(new Date(`${dateKey}T12:00:00+05:30`));
  const map = { Mon: 7, Tue: 6, Wed: 5, Thu: 4, Fri: 3, Sat: 2, Sun: 1 };
  return map[weekday] ?? 1;
}

function appliesTo(task, person) {
  if (!task.assignees?.length) return true;
  return task.assignees.includes(person);
}

function dailyComplete(task, progress) {
  if (!progress) return false;
  if (task.kind === 'checkbox') return Boolean(progress.done?.[task.id]);
  if (task.kind === 'water') return (progress.water || 0) >= (task.waterGoal || 8);
  if (task.kind === 'meals') {
    return (task.meals || []).every((m) => progress.meals?.[m.id]);
  }
  return false;
}

function missedLabels(dayProgress, weekProgress, dateKey, tasks, person) {
  const daily = tasks
    .filter((t) => t.kind !== 'weekly' && appliesTo(t, person) && !dailyComplete(t, dayProgress))
    .map((t) => t.label);

  const logs = weekProgress?.logs || {};
  const left = daysLeftInWeek(dateKey);
  const isSun = left === 1;
  const weekly = [];
  for (const task of tasks.filter((t) => t.kind === 'weekly' && appliesTo(t, person))) {
    const count = (logs[task.id] || []).length;
    const goal = task.weeklyGoal || 1;
    if (count >= goal) continue;
    const need = goal - count;
    const doneToday = (logs[task.id] || []).includes(dateKey);
    const available = doneToday ? left - 1 : left;
    if (isSun || need > available) {
      weekly.push(`${task.label} (${count}/${goal} this week)`);
    }
  }
  return [...daily, ...weekly];
}

function partnerOf(id) {
  return id === 'sujesh' ? 'chaithu' : 'sujesh';
}

async function sendCallMeBot(phone, apikey, text) {
  const digits = String(phone).replace(/\D/g, '');
  if (!digits || !apikey) return { ok: false, error: 'not_configured' };
  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${digits}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url);
  const body = await res.text();
  return res.ok ? { ok: true, body } : { ok: false, error: body };
}

function getDb() {
  const config = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  };
  if (!config.apiKey || !config.projectId) return null;
  if (!getApps().length) initializeApp(config);
  return getFirestore();
}

export default async () => {
  const date = todayKeyIST();
  const wKey = `w-${weekStartKey(date)}`;
  const household = process.env.VITE_HOUSEHOLD_ID || process.env.HOUSEHOLD_ID || 'chaithu-sujesh';
  const results = [];

  const db = getDb();
  let day = null;
  let week = null;
  let tasks = DEFAULT_TASKS;

  if (db) {
    try {
      const daySnap = await getDoc(doc(db, 'households', household, 'days', date));
      if (daySnap.exists()) day = daySnap.data();
      const weekSnap = await getDoc(doc(db, 'households', household, 'weeks', wKey));
      if (weekSnap.exists()) week = weekSnap.data();
      const taskSnap = await getDoc(doc(db, 'households', household, 'config', 'tasks'));
      if (taskSnap.exists() && Array.isArray(taskSnap.data().tasks) && taskSnap.data().tasks.length) {
        tasks = taskSnap.data().tasks;
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  if (!day?.people) {
    return new Response(
      JSON.stringify({ ok: true, date, message: 'No day data yet — nothing to notify' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  for (const whoMissed of ['chaithu', 'sujesh']) {
    const missed = missedLabels(day.people[whoMissed], week?.people?.[whoMissed], date, tasks, whoMissed);
    if (!missed.length) {
      results.push({ whoMissed, skipped: 'complete' });
      continue;
    }

    const recipientId = partnerOf(whoMissed);
    const recipient = PARTNERS[recipientId];
    const who = PARTNERS[whoMissed];
    const lines = missed.map((m, i) => `${i + 1}. ${m}`).join('\n');
    const text =
      `Hey 👋 Evening reminder from Our Daily Routine\n\n` +
      `*${who.name}* still has incomplete items for *${date}*:\n\n` +
      `${lines}\n\n` +
      `Gentle nudge — finish them when you can 💪❤️`;

    const sent = await sendCallMeBot(recipient.phone, recipient.apikey, text);
    results.push({ whoMissed, notified: recipient.name, missed, ...sent });
  }

  return new Response(JSON.stringify({ ok: true, date, weekKey: wKey, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const config = {
  schedule: '30 15 * * *',
};
