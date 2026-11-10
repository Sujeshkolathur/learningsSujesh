# Deploy & go live

## Can I use Netlify?

**No.** [Netlify](https://www.netlify.com/) is for **static sites** and short **serverless functions**. This project is a **Spring Boot JVM app** with long-running logic and scheduled reminders. Netlify cannot host it.

Use one of the options below instead.

---

## Recommended: **Render.com** (free) + **GitHub Actions** (free cron)

Best balance for your stack: **$0**, Telegram/Gemini free tiers, reliable IST schedules.

### Architecture

```text
GitHub Actions (cron, IST)  →  HTTPS  →  Render Web Service (Docker)
                                              ↓
                                    Gemini (AI) + Telegram (messages)
```

Render’s free web service **sleeps when idle**, so in-app `@Scheduled` jobs are **disabled** in prod (`application-prod.yml`). **GitHub Actions** calls your API on a schedule instead.

### Step 1 — Push code to GitHub

```bash
cd interview-prep-reminder
git init
git add .
git commit -m "Interview prep reminder app"
git remote add origin https://github.com/YOUR_USER/interview-prep-reminder.git
git push -u origin main
```

### Step 2 — Deploy on Render

1. Sign up at [render.com](https://render.com) (free).
2. **New → Blueprint** or **New → Web Service** → connect your GitHub repo.
3. Use **Docker** (repo includes `Dockerfile` and `render.yaml`).
4. Set environment variables:

| Variable | Example |
|----------|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `PREP_API_SECRET` | long random string (you choose) |
| `GEMINI_API_KEY` | from [Google AI Studio](https://aistudio.google.com/apikey) |
| `TELEGRAM_BOT_TOKEN` | from @BotFather |
| `TELEGRAM_CHAT_ID` | from @userinfobot |
| `AI_PROVIDER` | not needed if `application-prod.yml` sets `gemini` |

5. Deploy. Note your URL, e.g. `https://interview-prep-reminder.onrender.com`.

6. Test: `https://YOUR_APP.onrender.com/health` → `{"status":"UP"}`

### Step 3 — GitHub Actions secrets

In GitHub repo → **Settings → Secrets and variables → Actions**:

| Secret | Value |
|--------|--------|
| `APP_BASE_URL` | `https://YOUR_APP.onrender.com` (no trailing slash) |
| `PREP_API_SECRET` | same as Render `PREP_API_SECRET` |

Workflow file: `.github/workflows/reminders-cron.yml` (already in repo).

Manual test: **Actions → Interview prep reminders → Run workflow**.

### Step 4 — Go live checklist

- [ ] `prep.dry-run=false` (set in `application-prod.yml`)
- [ ] `notification.provider=telegram` (or `callmebot` for WhatsApp)
- [ ] `ai.provider=gemini` or `groq` (not `ollama` — Ollama is local only)
- [ ] `/api/reminders/hourly/send?key=YOUR_SECRET` works once
- [ ] GitHub Action ran successfully

---

## Other hosting options

| Platform | Good for | Free tier | Schedulers |
|----------|----------|-----------|------------|
| **[Render](https://render.com)** | Docker Spring Boot | Yes (sleeps) | Use GitHub Actions |
| **[Railway](https://railway.app)** | Docker / JAR | Limited credits | External cron or always-on paid |
| **[Fly.io](https://fly.io)** | Docker | Small free allowance | Can run 24/7 with limits |
| **[Oracle Cloud](https://www.oracle.com/cloud/free/)** | Always-free VM | Yes | Run JAR + internal `@Scheduled` |
| **[Google Cloud Run](https://cloud.google.com/run)** | Container | Generous free requests | Cloud Scheduler → HTTP `/send` |
| **Your laptop + Ollama** | Dev only | Free | Not “live” 24/7 |

**Avoid for this app:** Netlify, Vercel (frontend/serverless only), GitHub Pages.

---

## Always-on free (internal cron, no GitHub Actions)

1. Create an **Oracle Cloud Always Free** ARM VM (Ubuntu).
2. Install Java 17, build JAR: `mvn -DskipTests package`.
3. Run: `java -jar target/interview-prep-reminder-1.0.0.jar`
4. Set `prep.schedule.internal-enabled=true` and use `gemini` + `telegram`.

Use `systemd` to keep the JAR running after reboot.

---

## Security when public

- Set **`PREP_API_SECRET`** — required for `/api/reminders/send` and `/hourly/send` when configured.
- Do **not** commit API keys; use platform env vars only.
- Preview endpoints (`/preview`) stay open for debugging; disable or protect if needed.

---

## Quick test URLs (after deploy)

```text
GET https://YOUR_APP/health
GET https://YOUR_APP/api/reminders/hourly/preview
GET https://YOUR_APP/api/reminders/hourly/send?key=YOUR_SECRET
```
