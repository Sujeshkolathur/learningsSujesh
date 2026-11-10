# Happy Birthday, Chaithu ❤️

A romantic, emotional single-page love story — from her birthday and first Hello, to engagement and forever.

Built with **React + Vite + TypeScript + Tailwind CSS + Framer Motion**.

## Run locally

```powershell
cd c:\learning\Flutter\chaithu-birthday
npm install
npm run dev
```

Open `http://localhost:5173`

## Personalize

Edit **`src/data/story.ts`** — names, dates, messages, photo paths, and music path are all in one file.

Important dates to update:

```ts
export const ENGAGEMENT_DATE = '2026-09-05T10:00:00'; // ← change this
export const FIRST_CALL_DATE = '2025-08-26';
export const BIRTHDAY = '2026-08-26';
```

## Add photos & music (optional)

Drop files into `public/assets/`:

| File | Purpose |
|------|---------|
| `photo1.jpg` … `photo5.jpg` | Polaroid gallery (hidden if missing) |
| `our-song.mp3` | Background music (button hidden if missing) |

## Build for production

```powershell
npm run build
npm run preview
```

Output is in `dist/`.

## Deploy to Vercel

1. Push this folder to GitHub (or use Vercel CLI).
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import the repo — framework preset: **Vite**.
4. Build command: `npm run build` · Output: `dist`
5. Deploy.

Or with CLI:

```powershell
npm i -g vercel
vercel
```

## Deploy to Netlify

1. Push to GitHub.
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**.
3. Build command: `npm run build` · Publish directory: `dist`
4. Deploy.

Or drag-and-drop the `dist/` folder after `npm run build`.

## Sections

1. Hero — *It all started with a Hello*
2. The First Hello + milestone timeline
3. You Changed My Dreams
4. Our Journey (interactive timeline)
5. You Are My Happiness (tap-to-reveal)
6. I Can't Imagine Life Without You
7. Engagement countdown
8. Photo gallery (optional)
9. Birthday love letter
10. My Promise to You
11. Secret envelope surprise
12. Final screen

## Notes

- Mobile-first design
- Respects `prefers-reduced-motion`
- No backend — static deploy only
- Music does not autoplay (browser-friendly)

Made with love by Sujesh, for Chaithu. ❤️
