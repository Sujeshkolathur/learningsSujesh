import type { PersonId } from './routines';

/**
 * Partner WhatsApp numbers (country code, no +).
 * Used for wa.me one-tap alerts. Safe to put in frontend env.
 *
 * Example India: 919876543210
 */
export const PARTNER_WHATSAPP: Record<PersonId, string> = {
  chaithu: (import.meta.env.VITE_CHAITHU_WHATSAPP as string) || '919744415022',
  sujesh: (import.meta.env.VITE_SUJESH_WHATSAPP as string) || '919526494378',
};

export function hasWhatsAppNumber(id: PersonId) {
  return Boolean(PARTNER_WHATSAPP[id]?.replace(/\D/g, '').length);
}
