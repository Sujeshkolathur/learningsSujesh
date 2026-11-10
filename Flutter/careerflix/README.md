# Careerflix

Netflix-style career profiles with **role-based access**:

| Role | Can do |
|------|--------|
| **Candidate** | Sign up, create/edit **own** profile only (no talent list) |
| **Hiring manager** | See **all profiles** list, view-only |
| **Admin** | All profiles list + Admin panel (change user roles) |

## Run

```powershell
cd c:\learning\Flutter\careerflix
npm install
npm run dev
```

Open http://localhost:5173

## Firebase setup

1. Console → **Authentication** → enable **Email/Password**.
2. Deploy rules:

```powershell
firebase deploy --only firestore:rules --project cs-tracker-bfee7
```

3. In `.env`:

```env
VITE_ADMIN_EMAILS=you@example.com
VITE_HIRING_MANAGER_EMAILS=hm@example.com
```

4. **Bootstrap:** sign up once with an admin email from `VITE_ADMIN_EMAILS`. That creates `careerConfig/roles` and your admin user.
5. Hiring-manager emails must be listed in that config (copied from env on bootstrap, or edit in Admin / Firestore). Then those users can sign up as hiring managers.

## Collections

- `careerUsers/{uid}` — email, role, displayName
- `careerProfiles/{id}` — resume data + `ownerUid`
- `careerConfig/roles` — `admins[]`, `hiringManagers[]`
