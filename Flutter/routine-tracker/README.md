# Daily Routine Tracker — Chaithu & Sujesh

Shared Health + Career checklist. What one updates, the other sees live.

**Stack:** React + Vite + Tailwind · **Sync:** Firebase Firestore (free) · **Host:** Netlify (free)

## Routines

### 1. Health — daily
- Drink water when you wake up
- Have food on time (Breakfast / Lunch / Dinner)
- Drink enough water (8 glasses)

### Health — weekly (Mon–Sun)
- **Skin care** — 2× / week
- **Hair care** — 2× / week
- **Gym** — 6× / week
- **Cardio** — 1× / week

Tap **Mark done for today** on weekly items; progress resets each Monday.

### 2. Career — daily
- Learn something new — 30 minutes (upskill)

## Person login (Chaithu / Sujesh PIN)

1. Tap **I am Chaithu** or **I am Sujesh**
2. **First time:** set a 4–8 digit PIN (confirm once)
3. **Next times:** enter that PIN to unlock
4. Use **Change my PIN** or **Lock / switch** when unlocked

PINs are stored hashed in Firestore (`config/pins`) so both devices share the same login for each person.

## Admin — add / edit / remove tasks

1. Unlock as yourself first
2. Expand **Admin — manage tasks**
3. Enter admin PIN (default **`2468`**, set `VITE_ADMIN_PIN` in `.env`)
4. Add, edit, or remove tasks; assign to Chaithu, Sujesh, or Both

Task catalog syncs via Firestore (`households/.../config/tasks`).

## Run locally

```powershell
cd c:\learning\Flutter\routine-tracker
npm install
npm run dev
```

Without Firebase env vars it works in **local-only** mode (same browser).  
For phone ↔ phone / Chaithu ↔ Sujesh sync, set up Firebase (below).

## Free sync (Firebase Spark)

1. Go to [Firebase Console](https://console.firebase.google.com/) → Create project (free).
2. Add a **Web app** → copy config.
3. Enable **Firestore** (start in test mode, then paste rules from `firestore.rules`).
4. Copy `.env.example` → `.env` and fill values:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_HOUSEHOLD_ID=chaithu-sujesh
```

5. Restart `npm run dev`. Banner should say **Live sync on**.

## Deploy to Netlify (free)

```powershell
npm run build
```

1. Push repo to GitHub **or** drag `dist/` into Netlify.
2. Build command: `npm run build` · Publish: `dist`
3. Site settings → **Environment variables** — add the same `VITE_*` keys as `.env`.
4. Redeploy.

Share the Netlify URL with Chaithu. Each person taps **I am Chaithu** or **I am Sujesh**.

## How sharing works

- One shared household document per day in Firestore.
- You only edit your column; the other column updates live.
- Same `VITE_HOUSEHOLD_ID` for both of you.

## WhatsApp if someone misses tasks (free)

Two layers (both free):

### 1. One-tap WhatsApp (always works)
Add phone numbers to `.env` / Netlify env:

```
VITE_CHAITHU_WHATSAPP=9198XXXXXXXX
VITE_SUJESH_WHATSAPP=9198XXXXXXXX
VITE_REMINDER_HOUR_IST=21
```

After 9 PM IST (configurable), incomplete tasks show an alert with **WhatsApp** buttons that open a pre-filled nudge to the partner.

### 2. Auto WhatsApp send (CallMeBot — free)
1. Open [CallMeBot WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/).
2. Each of you activates the bot and gets an **apikey**.
3. In **Netlify → Environment variables** set:

```
CHAITHU_WHATSAPP=9198XXXXXXXX
SUJESH_WHATSAPP=9198XXXXXXXX
CHAITHU_CALLMEBOT_APIKEY=...
SUJESH_CALLMEBOT_APIKEY=...
```

(plus the same Firebase `VITE_*` vars)

4. Redeploy.

**What happens**
- **Scheduled job** (`check-missed`) runs daily at **9:00 PM IST** and WhatsApps the partner if anything is incomplete.
- Opening the app after reminder hour also tries auto-notify once per day (and falls back to the WhatsApp button).

Example: Sujesh misses Gym → Chaithu gets a WhatsApp listing missed items (and vice versa).

## Cost

- Netlify free static hosting + scheduled function: ₹0  
- Firebase Spark (free quota): enough for 2 people daily checklists  
- CallMeBot personal WhatsApp API: free  
- No paid server required
