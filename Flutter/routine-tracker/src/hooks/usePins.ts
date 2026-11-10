import { useEffect, useState } from 'react';
import { type PersonId } from '../data/routines';
import {
  subscribePins,
  setPersonPin,
  type PinsDoc,
  type PersonPinRecord,
} from '../lib/storage';
import { verifyPin } from '../lib/pins';
import { HOUSEHOLD_ID } from '../lib/firebase';

export function usePins() {
  const [pins, setPins] = useState<PinsDoc>({
    chaithu: null,
    sujesh: null,
    updatedAt: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribePins((data) => {
      setPins(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  function hasPin(person: PersonId) {
    return Boolean(pins[person]?.hash);
  }

  async function createPin(person: PersonId, pin: string) {
    const next = await setPersonPin(person, pin, pins);
    setPins(next);
  }

  async function checkPin(person: PersonId, pin: string) {
    const record: PersonPinRecord | null = pins[person];
    if (!record?.hash) return false;
    return verifyPin(pin, HOUSEHOLD_ID, record.hash);
  }

  return { pins, loading, hasPin, createPin, checkPin };
}
