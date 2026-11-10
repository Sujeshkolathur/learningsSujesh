# MAY.BE — React Clone (No Database)

Minimal drop-style e-commerce inspired by [maybeconcepts.com](https://maybeconcepts.com/).

## Run

```powershell
cd c:\learning\Flutter\maybe-concepts
npm install
npm run dev
```

Open `http://localhost:5173`

## Site analysis (original)

| Element | Implementation |
|---------|----------------|
| Brand | MAY.BE — utility/drop culture |
| Nav | Home, UTILITY PRIME, CONNECT |
| Hero | "SEE WHAT WE MADE > TRANSMISSION 26.07" |
| Product | UTILITY PRIME — CARRY SYSTEM, Drop 001 |
| Pricing | ₹1,999 (was ₹2,499), sale badge |
| Cart | Drawer on add-to-cart |
| Email | "ENTER THE SYSTEM." signup |
| Footer | Instagram, payment badges, policies |
| Platform | Original uses Shopify — this is a React demo |

## Features (no backend)

- Single product with image gallery
- Add to cart, cart page, checkout (demo)
- **Google sign-in** (Gmail) + demo email/password login (localStorage)
- Order history on account page
- Email subscribe + contact form (localStorage)
- Share product link / WhatsApp after order
- Mobile responsive, minimalist UI

## Google sign-in setup

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (application type: **Web application**).
3. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (local dev)
   - Your production URL (e.g. `https://your-site.netlify.app`)
4. Copy the Client ID and create a `.env` file from the example:

```powershell
copy .env.example .env
```

5. Set your client ID in `.env`:

```
VITE_GOOGLE_CLIENT_ID=123456789-xxxx.apps.googleusercontent.com
```

6. Restart the dev server (`npm run dev`).

Without a Client ID, the login page shows setup instructions and the demo email login still works.

## Deploy free

```powershell
npm run build
```

Deploy `dist/` to Netlify or Vercel.

## Data storage (browser)

- `maybe_be_cart` — cart
- `maybe_be_user` — login
- `maybe_be_orders` — orders
- `maybe_be_subscribers` — email list
- `maybe_be_messages` — contact form

Clear site data in DevTools to reset.
