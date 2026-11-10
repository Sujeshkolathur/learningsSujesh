# iStay Frontend (sample)

React + Vite app: search availability, book/cancel, and list reservations against the sample backend.

## Run

Start Postgres + backend first, then:

```bash
npm install
npm run dev
```

Open http://localhost:5173

Demo login: `front_desk` / `password` (book) or `revenue` / `password` (read-only).

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`/`master`:

```bash
npm ci
npm run build
```
