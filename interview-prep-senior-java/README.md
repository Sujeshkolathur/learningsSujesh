# Interview Prep Reminder (100% free stack)

Spring Boot app for interview preparation reminders — **no Twilio, no paid OpenAI required**.

Tailored for **Sujesh K R** (Senior Java Developer — Spring Boot, microservices, Azure/AWS, Kafka).

## What you get

- **Morning / evening checklists** — LeetCode, DSA, Naukri, Naukri Gulf, LinkedIn, Google prep
- **Hourly AI interview questions** — fresh question + deep explanation every trigger

## Free AI options (`ai.provider`)

| Provider | Cost | Setup |
|----------|------|--------|
| **ollama** (default) | Free, runs on your PC | Install [Ollama](https://ollama.com), run `ollama pull llama3.2` |
| **gemini** | Free tier (Google AI Studio) | Get key at [aistudio.google.com](https://aistudio.google.com/apikey) → `GEMINI_API_KEY` |
| **groq** | Free tier | Get key at [console.groq.com](https://console.groq.com) → `GROQ_API_KEY` |

```yaml
ai:
  provider: ollama   # or gemini, groq
```

```powershell
# Option A — fully local (no API key)
ollama pull llama3.2
# application.yml: ai.provider=ollama

# Option B — Gemini free cloud
$env:GEMINI_API_KEY="your-free-key"
# application.yml: ai.provider=gemini

# Option C — Groq free cloud
$env:GROQ_API_KEY="your-free-key"
# application.yml: ai.provider=groq
```

## Free notification options (`notification.provider`)

| Provider | Cost | Delivers to |
|----------|------|-------------|
| **console** | Free | App logs (default + `prep.dry-run`) |
| **telegram** | Free | Telegram app |
| **callmebot** | Free | WhatsApp |
| **ntfy** | Free | Phone push (ntfy app) |

### Telegram (recommended)

1. Message [@BotFather](https://t.me/BotFather) → `/newbot` → copy **bot token**
2. Message [@userinfobot](https://t.me/userinfobot) → copy **chat id**
3. Configure:

```yaml
prep:
  dry-run: false
notification:
  provider: telegram
  telegram:
    bot-token: your-token
    chat-id: your-chat-id
```

### WhatsApp via CallMeBot (free)

1. Follow [CallMeBot WhatsApp API](https://www.callmebot.com/blog/free-api-whatsapp-messages/) to get your **apikey**
2. Configure:

```yaml
prep:
  dry-run: false
notification:
  provider: callmebot
  callmebot:
    phone: 919526494378
    api-key: your-callmebot-key
```

### ntfy (free push)

1. Install ntfy app, pick a topic name
2. `notification.provider=ntfy`, `notification.ntfy.topic=your-unique-topic`

## Schedule (IST)

| Time | What |
|------|------|
| 7:00 AM | Morning checklist |
| 8:00 PM | Evening checklist |
| Every hour (7 AM–10 PM) | AI-generated interview Q&A |

## Run

```bash
cd interview-prep-reminder
mvn spring-boot:run
```

### API

```text
GET /api/reminders/preview?slot=MORNING
GET /api/reminders/hourly/preview
GET /api/reminders/hourly/send
```

With `prep.dry-run: true`, nothing is sent externally — only logs (good for testing).

## Suggested zero-cost setup

1. **Ollama** for AI (local)
2. **Telegram** for phone notifications
3. `prep.dry-run: false`

Total cost: **₹0 / $0**.

## Deploy & go live

**Netlify is not suitable** for this Spring Boot app. Use **Render + GitHub Actions** (free) or an always-free VM.

Full guide: **[DEPLOY.md](./DEPLOY.md)**

## Tech stack

- Java 17, Spring Boot 3.3
- RestClient → Ollama / Gemini / Groq (OpenAI-compatible APIs)
- RestClient → Telegram / CallMeBot / ntfy
- Docker + `render.yaml` for cloud deploy
