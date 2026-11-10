import { useState } from 'react';
import { PEOPLE, type PersonId } from '../data/routines';
import { isValidPin } from '../lib/pins';

interface Props {
  personId: PersonId;
  mode: 'create' | 'unlock' | 'change';
  onSuccess: () => void;
  onCancel: () => void;
  onCreate: (pin: string) => Promise<void>;
  onVerify: (pin: string) => Promise<boolean>;
}

export default function PersonAuthModal({
  personId,
  mode,
  onSuccess,
  onCancel,
  onCreate,
  onVerify,
}: Props) {
  const person = PEOPLE.find((p) => p.id === personId)!;
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isCreate = mode === 'create' || mode === 'change';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isValidPin(pin)) {
      setError('PIN must be 4–8 digits');
      return;
    }

    if (isCreate) {
      if (pin !== confirm) {
        setError('PINs do not match');
        return;
      }
      setBusy(true);
      try {
        await onCreate(pin);
        onSuccess();
      } catch {
        setError('Could not save PIN. Try again.');
      } finally {
        setBusy(false);
      }
      return;
    }

    setBusy(true);
    try {
      const ok = await onVerify(pin);
      if (ok) onSuccess();
      else setError('Incorrect PIN');
    } catch {
      setError('Could not verify. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => void submit(e)}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-ink/40">
          {mode === 'create' ? 'Set your PIN' : mode === 'change' ? 'Change PIN' : 'Enter PIN'}
        </p>
        <h2 className="font-display mt-1 text-xl font-bold" style={{ color: person.color }}>
          {person.name}
        </h2>
        <p className="mt-2 text-sm text-ink/55">
          {mode === 'create'
            ? 'First time — choose a 4–8 digit PIN. You’ll need it next time you select yourself.'
            : mode === 'change'
              ? 'Choose a new 4–8 digit PIN.'
              : 'Enter your PIN to continue as this person.'}
        </p>

        <label className="mt-4 block text-xs font-medium text-ink/50">
          PIN
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
            className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-center text-lg tracking-[0.35em]"
            placeholder="••••"
          />
        </label>

        {isCreate && (
          <label className="mt-3 block text-xs font-medium text-ink/50">
            Confirm PIN
            <input
              type="password"
              inputMode="numeric"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value.replace(/\D/g, '').slice(0, 8))}
              className="mt-1 w-full rounded-xl border border-ink/15 px-3 py-2.5 text-center text-lg tracking-[0.35em]"
              placeholder="••••"
            />
          </label>
        )}

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl bg-mist px-4 py-2.5 text-sm font-semibold text-ink/70"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: person.color }}
          >
            {busy ? '…' : mode === 'unlock' ? 'Unlock' : 'Save PIN'}
          </button>
        </div>
      </form>
    </div>
  );
}
