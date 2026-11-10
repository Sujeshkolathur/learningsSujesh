export function parseGoogleCredential(credential) {
  if (!credential) return null;

  try {
    const base64 = credential.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(json);

    if (!payload.email) return null;

    return {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture || null,
      provider: 'google',
      googleId: payload.sub,
    };
  } catch {
    return null;
  }
}

export function isGoogleConfigured() {
  const id = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
  if (!id) return false;
  if (id.includes('your-client-id') || id.includes('xxx')) return false;
  return id.endsWith('.apps.googleusercontent.com');
}
