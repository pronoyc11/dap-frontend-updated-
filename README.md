# Atlas DAP frontend

Atlas DAP is a role-based developer assessment platform frontend. Administrators manage the platform, recruiters author assessments and review candidates, and candidates complete assessments and view results.

This README is a complete implementation tutorial. It explains how to run this repository and how to recreate the same architecture from an empty Next.js project.

The frontend is separate from the backend. The backend owns the database, authentication cookies, authorization, evaluation, file storage, payments, and email delivery. This project owns the browser experience, forms, caching, loading states, navigation, and presentation.

## 1. Product and user flows

| Role | Features |
| --- | --- |
| Candidate | Profile, invitations, invitation acceptance/rejection, timed attempts, answer submission, results |
| Recruiter | Company profile, problem bank, assessments, assessment items, invitations, candidate review, written-answer evaluation |
| Admin | Dashboard statistics, user management, recruiter approvals, audit logs, profile |

Public pages include home, services, pricing, about, contact, login, registration, email verification, forgotten password, and password reset.

The primary flow is:

~~~text
Recruiter creates problems
  -> creates an assessment and attaches problems
  -> marks it ready and completes payment
  -> invites a candidate
  -> candidate accepts and starts an attempt
  -> candidate submits answers
  -> backend evaluates objective answers; recruiter evaluates written answers
  -> candidate views the result
~~~

## 2. Stack and important decisions

- Next.js 16 App Router and React 19
- TypeScript with strict checking
- Tailwind CSS 4 through PostCSS
- TanStack Query for server state and cache invalidation
- Zustand for a small client-side user snapshot
- TanStack Form and Zod for complex forms and validation
- next-themes for dark/light themes
- Sonner for notifications
- Lucide React for icons
- Stripe redirect/result pages; payment creation is performed by the backend
- Biome and ESLint for quality checks

The backend sets an HttpOnly access-token cookie. The frontend sends credentialed requests and does not put access tokens in local storage or Zustand.

## 3. Prerequisites and local setup

Install Node.js compatible with Next.js 16, npm, Git, and the companion DAP backend.

The original setup expects the backend at http://localhost:5000 with routes below /api/v1. Older notes call the backend ../Assingment6; the directory name contains that historical spelling. Any backend is acceptable if it implements the API contract in this document.

### Run this repository

~~~bash
git clone <repository-url>
cd dap-frontend
npm install
~~~

Create .env.local:

~~~powershell
Copy-Item .env.example .env.local
~~~

On macOS or Linux:

~~~bash
cp .env.example .env.local
~~~

Set:

~~~dotenv
API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
~~~

API_BASE_URL is server-side and is used by the Next.js rewrite. NEXT_PUBLIC_APP_URL is the metadata base URL. Leave the Google client ID empty unless Google sign-in is configured.

Start the application:

~~~bash
npm run dev
~~~

Open http://localhost:3000.

The seeded local accounts are:

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@example.com | AdminPass123! |
| Recruiter | recruiter@example.com | RecruiterPass123! |
| Candidate | candidate@example.com | CandidatePass123! |

Use only non-production credentials locally.

## 4. Recreate the project from an empty directory

### Step 1: Create the application

~~~bash
npx create-next-app@latest dap-frontend --typescript --eslint --app --src-dir --use-npm
cd dap-frontend
npm install @tanstack/react-form @tanstack/react-query class-variance-authority clsx lucide-react next-themes sonner stripe tailwind-merge zod zustand
npm install -D @biomejs/biome @tailwindcss/postcss @types/node @types/react @types/react-dom postcss tailwindcss typescript
~~~

Configure the @/* alias to point to src/*. Use strict TypeScript, moduleResolution bundler, and noEmit.

### Step 2: Configure Tailwind 4

Create postcss.config.mjs:

~~~js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
~~~

At the top of src/app/globals.css add:

~~~css
@import "tailwindcss";
~~~

Keep global CSS limited to design tokens and accessibility defaults: dark-first colors, light-theme overrides, visible focus rings, mobile typography, and reduced-motion rules. Keep component layout styles beside their components.

### Step 3: Add the root layout and providers

Keep src/app/layout.tsx as a Server Component. It should set metadata and render a client-only Providers component:

~~~tsx
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Atlas DAP", template: "%s · Atlas DAP" },
  description: "A modern developer assessment workspace.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
~~~

Providers is a Client Component because TanStack Query, next-themes, and Sonner use browser state. Create one QueryClient per browser session:

~~~tsx
"use client";

const [client] = useState(
  () => new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } }),
);
~~~

Wrap children with ThemeProvider, QueryClientProvider, and Toaster.

### Step 4: Add the backend proxy

Client requests use a same-origin URL while server requests use the private API URL. In next.config.ts:

~~~ts
const backend = process.env.API_BASE_URL ?? "http://localhost:5000/api/v1";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return [{ source: "/api/backend/:path*", destination: backend + "/:path*" }];
  },
};

export default nextConfig;
~~~

This gives browser components a stable /api/backend path and avoids hard-coding a cross-origin URL.

### Step 5: Build one API client

Do not write fetch calls independently in every page. In src/lib/api.ts:

1. Use API_BASE_URL on the server and /api/backend in the browser.
2. Always send credentials: include.
3. Set application/json for JSON requests.
4. Do not set Content-Type for FormData; the browser adds its multipart boundary.
5. Use no-store for authenticated requests.
6. Return payload.data when the backend uses its standard envelope.
7. Throw an ApiError with the HTTP status and backend message.

Core implementation:

~~~ts
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = typeof window === "undefined" ? API_URL : "/api/backend";
  const response = await fetch(baseUrl + path, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, payload.message ?? "Request failed");
  return (payload.data ?? payload) as T;
}
~~~

Expose api.get, api.post, api.patch, api.del, and api.form. Put mutation routes in an endpoints object and read adapters in queries.ts. A backend path change should then require editing one layer.

### Step 6: Define domain types

Create src/lib/types.ts with:

- Role: ADMIN, RECRUITER, or CANDIDATE
- Status: ACTIVE, BLOCKED, or SUSPENDED
- User, Problem, Assessment, and AssessmentItem
- Attempt states: NOT_STARTED, IN_PROGRESS, SUBMITTED, EVALUATED, CANCELLED
- Pagination and Paginated<T>
- the common success/message/data API envelope

Make fields optional where endpoints return different projections of the same entity.

### Step 7: Authentication and route protection

The backend cookie is the source of truth. Zustand stores only a client snapshot for navigation:

~~~ts
interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}
~~~

After login, update the store and write a short-lived, non-sensitive sessionRole hint cookie. Never store the access token in Zustand or local storage. Clear the hint on logout.

Create src/proxy.ts with route groups:

~~~ts
const routeGroups = {
  admin: ["/admin"],
  recruiter: ["/recruiter"],
  candidate: ["/dashboard", "/attempt"],
} as const;
~~~

The proxy should redirect authenticated users away from /login and /register, and redirect users without an accessToken cookie to /login?next=... for protected routes. This is only an early navigation guard; every backend endpoint must still enforce authorization.

The client shell should call /users/me on mount, reconcile the Zustand store, and send the user to login when the session expires.

### Step 8: Build the application shell

Create reusable primitives in src/components/ui.tsx: buttons, cards, badges, skeletons, empty states, error states, pagination, and field styles.

AppShell should provide:

- desktop sidebar navigation;
- a dedicated mobile-friendly navigation treatment;
- role-dependent links and current-route highlighting;
- profile and logout controls;
- theme toggle;
- a spacious content container.

Use app/admin/layout.tsx, app/recruiter/layout.tsx, and app/dashboard/layout.tsx for role layouts. Keep marketing routes outside the authenticated shell.

### Step 9: Implement routes and features

Keep route files small and put behavior in feature components:

~~~tsx
import { RecruiterAssessments } from "@/components/recruiter-pages";

export default function Page() {
  return <RecruiterAssessments />;
}
~~~

Route structure:

~~~text
src/app/
├── page.tsx                         public home
├── about, contact, pricing, services public marketing pages
├── login, register                  authentication
├── verify-email                     email verification
├── forgot-password, reset-password  password recovery
├── admin/                           administration
├── recruiter/                       authoring and review
├── dashboard/                       candidate workspace
├── invitations/[token]/             invitation acceptance
├── attempt/[id]/                    timed attempt
├── payment/success, payment/cancel  payment returns
└── assessments/[id]/payment/...     assessment payment returns
~~~

Every data page should support loading, loaded, empty, and error-with-retry states.

Use query keys containing every filter:

~~~tsx
const result = useQuery({
  queryKey: ["admin-users", page, search],
  queryFn: () => queries.adminUsers(
    "?page=" + page + "&limit=15&search=" + encodeURIComponent(search),
  ),
});
~~~

After mutations, invalidate affected queries:

~~~ts
await endpoints.updateUserStatus(id, body);
await queryClient.invalidateQueries({ queryKey: ["admin-users"] });
~~~

Use useTransition for non-urgent navigation/filter updates and a debounced value for search. Keep filters and pagination in the URL so refresh and back/forward navigation work.

### Step 10: Assessment workflow

Recruiter screens should support:

1. Create, edit, and delete problems.
2. Create an assessment with title, description, duration, and passing score.
3. Add individual or bulk-selected problems.
4. Reorder or remove assessment items.
5. Mark the assessment ready.
6. Start payment and handle success/cancel returns.
7. Invite candidates.
8. Review candidates, attended attempts, passed candidates, and submissions.
9. Evaluate written submissions.

The backend owns valid status transitions. The UI may disable obviously invalid actions, but must display backend errors when a stale page or race makes an action invalid.

### Step 11: Candidate attempt

The attempt page is a Client Component because it needs browser state, answer input, countdown behavior, and navigation. Load the attempt by ID, display its items, keep answers in component state, and submit through endpoints.submitAttempt.

The backend must enforce the deadline. The client timer is only a user-experience aid and can drift when a tab sleeps or the clock changes. Never trust browser-provided scores, pass flags, or remaining time.

Disable duplicate submissions and show pending states for accepting, rejecting, starting, and submitting.

### Step 12: Forms and uploads

For an avatar or company logo:

~~~ts
const body = new FormData();
body.append("avatar", file);
await api.form("/users/me/avatar", body, "PATCH");
~~~

Never manually set Content-Type for FormData. Invalidate the profile query after upload so the new image appears immediately.

Use Zod before structured mutations. Show field-level validation, actionable request errors, and a disabled/loading submit button. TanStack Form is useful for complex authoring forms; native forms are sufficient for small profile forms.

## 5. API integration

All paths below are relative to /api/v1. Authenticated routes use the backend cookie.

### Authentication and account

~~~text
GET    /health
POST   /auth/register
POST   /auth/verify-email
POST   /auth/resend-verification
POST   /auth/forgot-password
POST   /auth/reset-password
POST   /auth/login
POST   /auth/google
POST   /auth/refresh
POST   /auth/logout
GET    /auth-test/me
GET    /users/me
PATCH  /users/me
PATCH  /users/me/password
PATCH  /users/me/avatar        multipart form
~~~

### Recruiters, problems, and assessments

~~~text
GET    /recruiters/me/profile
PATCH  /recruiters/me/profile
PATCH  /recruiters/me/profile/logo multipart form
GET    /problems
GET    /problems/:id
POST   /problems
PATCH  /problems/:id
DELETE /problems/:id
GET    /assessments
GET    /assessments/:id
POST   /assessments
PATCH  /assessments/:id
DELETE /assessments/:id
POST   /assessments/:id/items
POST   /assessments/:id/items/bulk
PATCH  /assessments/:id/items/reorder
PATCH  /assessments/:id/items/:itemId
DELETE /assessments/:id/items/:itemId
POST   /assessments/:id/ready
POST   /assessments/:id/payment
~~~

### Invitations, attempts, and submissions

~~~text
POST   /assessments/:id/invitations
GET    /assessments/:id/invitations
GET    /assessments/:id/submissions
GET    /assessments/:id/candidates
GET    /invitations/:id
POST   /invitations/:token/accept
POST   /invitations/id/:id/reject
POST   /invitations/:token/start
DELETE /invitations/:id
GET    /invitations/candidate-invitations
GET    /attempts
GET    /attempts/:id
POST   /attempts/:id/submit
PATCH  /submissions/:id/evaluate
~~~

### Administration

~~~text
GET    /admin/dashboard
GET    /admin/users
GET    /admin/users/:id
PATCH  /admin/users/:id/status
GET    /admin/audit-logs
GET    /admin/audit-logs/:id
GET    /admin/recruiter-applications
PATCH  /admin/recruiter-applications/:id/approve
~~~

List responses may use different collection keys such as users, problems, assessments, or items. Normalize them in src/lib/queries.ts to:

~~~ts
{ items: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } }
~~~

This keeps table and pagination components independent of backend naming.

## 6. Source layout

~~~text
src/
├── app/                 URL routes, layouts, loading/error/not-found boundaries
├── components/          reusable UI and role feature components
├── features/auth/       auth-specific reusable UI
├── hooks/               browser hooks such as debounced values
├── lib/api.ts            transport and endpoint map
├── lib/queries.ts        typed read/query adapters
├── lib/session.ts        non-sensitive session hint cookie
├── lib/types.ts          domain types
├── lib/utils.ts          shared formatting/class helpers
├── store/auth.ts         Zustand user snapshot
└── proxy.ts              early route guard
~~~

Keep route files as Next.js default exports and prefer named imports elsewhere. Avoid a large barrel file that evaluates unrelated modules.

## 7. UX, accessibility, and responsive behavior

Every asynchronous operation needs visible feedback:

- skeletons for initial loads;
- disabled buttons with progress labels during mutations;
- useful empty states;
- inline role=alert messages for form errors;
- retry actions for failed queries;
- toast notifications for completed mutations.

Use semantic headings, real links, labels for inputs, meaningful alt text, and visible keyboard focus rings. Keep dark mode as the default, provide a light option, and honor prefers-reduced-motion.

Check approximately 375x812, 768x1024, and 1440x900 after UI changes. Do not merely stack every desktop column on mobile; use cards or scroll regions for tables, keep primary actions reachable, and prevent overflow.

## 8. Validation and manual smoke test

Run:

~~~bash
npm run typecheck
npm run lint
npm run check:ci
npm run build
~~~

For production mode:

~~~bash
npm run build
npm run start
~~~

Manually verify:

1. Public pages load without a session.
2. Unauthenticated admin, recruiter, dashboard, and attempt routes redirect to login.
3. Each seeded role lands in its correct workspace.
4. Refreshing an authenticated page preserves the session.
5. Loading, empty, error, and retry states render.
6. A recruiter can create a problem, assessment, attached item, and invitation.
7. A candidate can accept, start, and submit an attempt.
8. A recruiter can evaluate a written submission.
9. A candidate can view an evaluated result.
10. Logout clears the session and protected routes redirect.

## 9. Common problems

### Cannot reach the API

Confirm the backend is running on port 5000, .env.local has the correct API_BASE_URL, and /api/v1/health responds. Restart Next.js after changing environment variables.

### Login succeeds but protected navigation returns to login

Inspect response cookies. The backend must set an accessToken cookie accepted by the frontend origin. Check SameSite, Secure, domain, CORS, and credentials: include.

### A list is empty even though the backend returns records

Check the collection key and adapt it in listQuery; do not scatter response-shape conditionals across components. Also inspect page, limit, and search parameters.

### Images do not update after upload

Invalidate the relevant profile query after the multipart request. If image URLs are cached, return a versioned URL from the backend.

### Google login is unavailable

Set NEXT_PUBLIC_GOOGLE_CLIENT_ID, configure the Google allowed origin and redirect URI, and ensure the backend accepts the credential at POST /auth/google. Password login does not depend on Google.

### The timer disagrees with the backend

Treat the backend deadline as authoritative. Reload the attempt and submit through the backend; never calculate score or validity in the browser.

## 10. Production notes

Set production API_BASE_URL and NEXT_PUBLIC_APP_URL, then run npm run build and npm run start. Configure the reverse proxy so frontend and backend cookie policies are compatible and use HTTPS for secure cookies.

Never expose private backend secrets through NEXT_PUBLIC_* variables. Keep payment secrets, database credentials, signing keys, and service-account credentials in the backend. Review server-side authorization for every role-sensitive endpoint; hiding a link or relying on the Next.js proxy is not security.

Before deployment, verify email delivery, password-reset expiry, upload size/type limits, Stripe webhook handling, audit-log persistence, rate limiting, and safe error responses.

## 11. Definition of done

A reproduction is complete when it installs from a clean checkout, passes strict TypeScript/lint/format checks, builds and starts in production mode, connects through the configured proxy, uses credentialed HttpOnly-cookie requests, supports all three role workspaces and the complete assessment journey, has loading/empty/error states, works on desktop and mobile, and stores no access token or private secret in browser storage.
