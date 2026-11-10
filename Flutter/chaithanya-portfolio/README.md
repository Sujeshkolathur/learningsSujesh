# Chaithanya — BIM Designer Portfolio

Static portfolio site with project showcase and consultation booking.

## Open locally

```powershell
cd c:\learning\Flutter\chaithanya-portfolio
python -m http.server 8080
```

Open `http://localhost:8080` or double-click `index.html`.

## Features

- **Portfolio** — 6 sample BIM projects with category filters (Commercial, Residential, Healthcare)
- **Services** — Modeling, coordination, documentation, consultation
- **Booking** — Date, time slot, service selection, and project details form

## Booking (static demo)

Submissions are saved in the browser (`localStorage` key: `chaithanya-bookings`) and shown in a confirmation dialog.

For production, connect one of:

1. **[Formspree](https://formspree.io)** — add `action="https://formspree.io/f/YOUR_ID"` and `method="POST"` to the form
2. **[Calendly](https://calendly.com)** — embed a scheduling widget in the booking section
3. **Email** — use a serverless function (Netlify/Vercel) to send booking emails

## Customize

- Replace sample projects in `index.html` with real project names, images, and descriptions
- Update email and LinkedIn in the footer
- Add project images: place files in an `images/` folder and use `<img>` in `.project-visual`
