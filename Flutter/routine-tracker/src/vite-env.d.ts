/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_HOUSEHOLD_ID: string;
  readonly VITE_CHAITHU_WHATSAPP: string;
  readonly VITE_SUJESH_WHATSAPP: string;
  readonly VITE_REMINDER_HOUR_IST: string;
  readonly VITE_ADMIN_PIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
