# CommCoach

An executive communication coaching app that helps professionals prepare for high-stakes scenarios — FAANG interviews, board presentations, and leadership conversations.

Built with Next.js 16, Prisma 7, Turso (libsql), NextAuth v5, and Tailwind CSS 4.

---

## Features

- **Communication Frameworks** — SCQA, STAR, Pyramid Principle, and more
- **Practice Scenarios** — 40+ realistic scenarios across 6 domains
- **Executive Interview Prep** — FAANG/MAANG company-specific coaching
- **Story Bank** — STAR format story library with strength scoring
- **12-Week Learning Path** — Structured curriculum with progress tracking
- **Progress Dashboard** — FAANG readiness gauge, streak tracking, badges
- **Quiz Mode** — Test communication knowledge
- **Google OAuth** — Sign in to persist progress across devices

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/<username>/commcoach.git
cd commcoach/app
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` — for local dev you only need to set `NEXTAUTH_SECRET`:

```bash
# Generate a secret:
openssl rand -base64 32
```

Leave `DATABASE_URL=file:./dev.db` as-is for local SQLite.

### 3. Set up database

```bash
npx prisma migrate dev
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Google sign-in requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Without them the app runs in read-only mode — all content is visible but progress is not saved.

---

## Production Deployment (Vercel + Turso)

### Step 1 — Create a Turso database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

turso auth login
turso db create commcoach-prod
turso db show commcoach-prod          # copy the libsql:// URL
turso db tokens create commcoach-prod # copy the auth token

# Apply migration to Turso
turso db shell commcoach-prod < prisma/migrations/$(ls prisma/migrations)/migration.sql
```

### Step 2 — Set up Google OAuth

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → Create (or select) a project
2. **APIs & Services** → **OAuth consent screen** → External → fill in app name, support email
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID** → Web application
4. Add **Authorized JavaScript origins**:
   - `http://localhost:3000`
   - `https://your-app.vercel.app`
5. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/google`
6. Copy the **Client ID** and **Client Secret**

### Step 3 — Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repository
3. Add these **Environment Variables** in the Vercel dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `libsql://commcoach-prod-<username>.turso.io` |
| `TURSO_AUTH_TOKEN` | Your Turso auth token |
| `NEXTAUTH_SECRET` | Output of `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (update after first deploy) |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |

4. Click **Deploy**
5. After the first deploy succeeds, update `NEXTAUTH_URL` to your actual Vercel URL and redeploy
6. Update your Google OAuth redirect URIs to match the actual Vercel URL

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | SQLite locally / Turso (libsql) in production |
| ORM | Prisma 7 with `@prisma/adapter-libsql` |
| Auth | NextAuth v5 beta with Google OAuth + Prisma Adapter |
| Deployment | Vercel (serverless) |

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `file:./dev.db` locally, `libsql://...turso.io` in production |
| `TURSO_AUTH_TOKEN` | Production only | Turso database auth token |
| `NEXTAUTH_SECRET` | Yes | Random 32-byte base64 string |
| `NEXTAUTH_URL` | Yes | Full URL of your app (no trailing slash) |
| `GOOGLE_CLIENT_ID` | For sign-in | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | For sign-in | Google OAuth 2.0 client secret |

---

## Project Structure

```
app/
├── prisma/
│   ├── schema.prisma          # DB models (User, Progress, Story, LearningPath)
│   └── migrations/            # SQL migration history
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth handler
│   │   │   ├── progress/      # Progress tracking API
│   │   │   ├── stories/       # Story bank CRUD API
│   │   │   └── learning-path/ # Learning path API
│   │   ├── error.tsx          # Root error boundary
│   │   ├── loading.tsx        # Root loading spinner
│   │   └── page.tsx           # App shell + view routing
│   ├── components/            # All UI components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── data.ts            # Static scenarios, frameworks, principles
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── validate.ts        # Lightweight API input validation
│   │   └── useProgress.ts     # Client-side data hook
│   └── types/                 # Shared TypeScript types
├── .env.local.example         # Environment variable template
├── vercel.json                # Vercel deployment config
└── next.config.ts             # Next.js config + security headers
```
