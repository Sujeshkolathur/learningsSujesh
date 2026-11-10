# FurniHub — Furniture E-commerce Demo (React + Vite)

Frontend-only demo with **localStorage persistence** — no backend required for testing.

## Run locally

```powershell
cd c:\learning\Flutter\furniture-store
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

## Demo logins

| Role | Email | Password |
|------|-------|----------|
| Customer | sujeshkolathur@gmail.com | demo123 |
| Admin | admin@furniture.com | admin123 |

## Features implemented

### Customer
- Home, categories, search & filters
- Product details with multiple images
- Add to cart, buy now, wishlist
- Checkout (Razorpay demo, UPI QR demo, COD)
- Order confirmation with email preview
- Share on WhatsApp (free manual share)
- Order history
- Login / register / forgot password

### Admin
- Dashboard (products, orders today, revenue, pending, out of stock)
- Product CRUD with stock quantity
- Order management with status updates
- **Auto stock reduction** when customer places order

## Persistence

All data stored in browser `localStorage`:
- Users, products, orders, carts, wishlists, notifications

Clear site data in browser DevTools to reset.

## Next steps (production)

1. **Backend:** Spring Boot 3 + JWT + Spring Security
2. **Database:** PostgreSQL (Supabase / Neon)
3. **Images:** Cloudinary
4. **Payments:** Razorpay live keys
5. **Email:** Brevo / Resend
6. **Hosting:** Vercel (frontend) + Render (backend)

## Build for deploy

```powershell
npm run build
```

Deploy `dist/` folder to Netlify, Vercel, or GitHub Pages.
