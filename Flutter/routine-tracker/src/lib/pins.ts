/** SHA-256 hash of PIN + household salt (not plaintext in storage) */

export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}::${pin.trim()}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPin(pin: string, salt: string, expectedHash: string): Promise<boolean> {
  const got = await hashPin(pin, salt);
  return got === expectedHash;
}

export function isValidPin(pin: string) {
  return /^\d{4,8}$/.test(pin.trim());
}
