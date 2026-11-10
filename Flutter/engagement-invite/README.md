# Engagement Invitation — Chathanya & Sujesh

Lavender & navy themed static engagement invitation with animated countdown and couple figures.

## Run

```powershell
cd c:\learning\Flutter\engagement-invite
npm install
npm run dev
```

Open `http://localhost:5173`

## Personalize

Edit **`src/data/invitation.ts`**:

| Field | What to change |
|-------|----------------|
| `ENGAGEMENT_DATE` | Sept 6, 2026 date/time |
| `VENUE.name`, `address` | Your venue details |
| `VENUE.mapUrl` | Google Maps link to venue |
| `JOURNEY_START` | Start date for “figures getting closer” animation |

## Features

- Lavender floral theme (her: lavender, him: navy blue)
- Animated flip countdown (days, hours, minutes, seconds)
- Two figures move closer as the engagement approaches
- Venue section + embedded map + “Open in Google Maps” button
- Mobile-first, deploy-ready static site

## Deploy

```powershell
npm run build
```

Deploy `dist/` to **Netlify** or **Vercel** (free).

## Theme

- **Lavender** `#9b8ab8` — Chathanya
- **Navy** `#1e3a5f` — Sujesh
