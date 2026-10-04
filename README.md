# Atlas DAP frontend

Industry-standard Next.js App Router frontend for the Developer Assessment Platform backend in `../Assingment6`.

## Local setup

1. Start the backend on `http://localhost:5000`.
2. Copy `.env.example` to `.env.local`.
3. Install and run:

```bash
npm install
npm run dev
```

The backend seed credentials are wired into the one-click demo buttons:

- Admin: `admin@example.com` / `AdminPass123!`
- Recruiter: `recruiter@example.com` / `RecruiterPass123!`
- Candidate: `candidate@example.com` / `CandidatePass123!`

The frontend uses credentialed HttpOnly-cookie requests against the backend API. It includes App Router layouts, middleware protection, TanStack Query, Zustand, TanStack Form + Zod forms, Tailwind v4, Stripe redirect pages, URL-synced filters, loading/error/empty states, and role-specific navigation.
