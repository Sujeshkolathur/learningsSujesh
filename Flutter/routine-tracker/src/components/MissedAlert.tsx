import { useEffect, useState } from 'react';
import { PARTNER_WHATSAPP, hasWhatsAppNumber } from '../data/partners';
import {
  PEOPLE,
  formatDisplayDate,
  type PersonId,
  type RoutineTask,
  type SharedDay,
  type SharedWeek,
} from '../data/routines';
import {
  buildMissedWhatsAppMessage,
  getMissedLabels,
  isPastReminderHour,
  partnerOf,
  peopleWithMisses,
  waMeLink,
} from '../lib/missed';

interface Props {
  day: SharedDay;
  week: SharedWeek;
  tasks: RoutineTask[];
  who: PersonId;
}

export default function MissedAlert({ day, week, tasks, who }: Props) {
  const [status, setStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const pastCutoff = isPastReminderHour();
  const missers = peopleWithMisses(day, tasks, week);

  const youMissed = getMissedLabels(day.people[who], week.people[who], tasks, who, day.date);
  const partnerId = partnerOf(who);
  const partnerMissed = getMissedLabels(
    day.people[partnerId],
    week.people[partnerId],
    tasks,
    partnerId,
    day.date
  );
  const partnerName = PEOPLE.find((p) => p.id === partnerId)!.name;
  const yourName = PEOPLE.find((p) => p.id === who)!.name;

  useEffect(() => {
    if (!pastCutoff || !youMissed.length) return;

    const flag = `routine_auto_wa_${day.date}_${who}`;
    if (localStorage.getItem(flag)) return;

    void (async () => {
      setSending(true);
      try {
        const res = await fetch('/.netlify/functions/notify-partner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            whoMissed: who,
            date: day.date,
            missed: youMissed,
          }),
        });
        if (res.ok) {
          localStorage.setItem(flag, '1');
          setStatus(`WhatsApp reminder sent to ${partnerName}`);
        } else {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          if (res.status === 501 || data.error === 'not_configured') {
            setStatus('Tap below to notify on WhatsApp (auto-send not configured yet)');
          } else {
            setStatus(data.error || 'Could not auto-send — use WhatsApp button');
          }
        }
      } catch {
        setStatus('Offline / function unavailable — use WhatsApp button');
      } finally {
        setSending(false);
      }
    })();
  }, [pastCutoff, youMissed.length, day.date, who, partnerName]);

  if (!missers.length) return null;

  function openWhatsAppToPartnerAboutYou() {
    const msg = buildMissedWhatsAppMessage(
      who,
      day.people[who],
      formatDisplayDate(day.date),
      tasks,
      week.people[who],
      day.date
    );
    const phone = PARTNER_WHATSAPP[partnerId];
    if (!msg || !phone) return;
    window.open(waMeLink(phone, msg), '_blank', 'noopener,noreferrer');
  }

  function openWhatsAppToPartnerAboutThem() {
    const msg = buildMissedWhatsAppMessage(
      partnerId,
      day.people[partnerId],
      formatDisplayDate(day.date),
      tasks,
      week.people[partnerId],
      day.date
    );
    const phone = PARTNER_WHATSAPP[partnerId];
    if (!msg || !phone) return;
    window.open(waMeLink(phone, msg), '_blank', 'noopener,noreferrer');
  }

  return (
    <aside className="mb-6 rounded-2xl border border-amber/30 bg-amber/10 p-4 sm:p-5">
      <h2 className="font-display text-lg font-bold text-ink">
        {pastCutoff ? 'Evening check-in' : 'Needs attention'}
      </h2>
      <p className="mt-1 text-sm text-ink/60">
        Daily misses + weekly goals behind schedule can nudge your partner on WhatsApp.
      </p>

      <ul className="mt-3 space-y-2 text-sm">
        {missers.map((m) => (
          <li key={m.id} className="rounded-xl bg-white/80 px-3 py-2">
            <strong style={{ color: PEOPLE.find((p) => p.id === m.id)?.color }}>{m.name}</strong>
            <span className="text-ink/50"> — </span>
            {m.missed.join(' · ')}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {youMissed.length > 0 && hasWhatsAppNumber(partnerId) && (
          <button
            type="button"
            onClick={openWhatsAppToPartnerAboutYou}
            className="rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            WhatsApp {partnerName}: I still have tasks
          </button>
        )}
        {partnerMissed.length > 0 && hasWhatsAppNumber(partnerId) && (
          <button
            type="button"
            onClick={openWhatsAppToPartnerAboutThem}
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Nudge {partnerName} on WhatsApp
          </button>
        )}
      </div>

      {(sending || status) && (
        <p className="mt-3 text-xs text-ink/55">
          {sending ? `Notifying ${partnerName}…` : status}
          {youMissed.length > 0 && pastCutoff
            ? ` (${yourName}'s misses → ${partnerName}'s WhatsApp)`
            : ''}
        </p>
      )}
    </aside>
  );
}
