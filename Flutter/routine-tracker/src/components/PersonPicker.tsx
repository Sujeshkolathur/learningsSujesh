import { PEOPLE, type PersonId } from '../data/routines';

interface Props {
  value: PersonId | null;
  authenticated: PersonId | null;
  onSelect: (id: PersonId) => void;
  onLogout: () => void;
  onChangePin: () => void;
}

export default function PersonPicker({
  value,
  authenticated,
  onSelect,
  onLogout,
  onChangePin,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-black/5">
        {PEOPLE.map((p) => {
          const active = value === p.id && authenticated === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p.id)}
              className={`flex-1 rounded-xl px-4 py-2.5 font-display text-sm font-semibold transition ${
                active ? 'text-white shadow-md' : 'text-ink/60 hover:bg-mist'
              }`}
              style={active ? { backgroundColor: p.color } : undefined}
            >
              I am {p.name}
            </button>
          );
        })}
      </div>
      {authenticated && (
        <div className="flex flex-wrap gap-2 px-1">
          <button
            type="button"
            onClick={onChangePin}
            className="text-xs font-medium text-ink/45 underline-offset-2 hover:underline"
          >
            Change my PIN
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="text-xs font-medium text-ink/45 underline-offset-2 hover:underline"
          >
            Lock / switch
          </button>
        </div>
      )}
    </div>
  );
}
