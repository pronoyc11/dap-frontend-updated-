# Level 1.5 architecture alignment

## Reference observations

The reference repository separates route composition from domain code. Its App Router contains grouped route folders, while `features/<domain>` owns domain API modules, components, hooks, schemas, types, and utilities. Shared API/config/types/utilities live outside features, and providers/stores are kept at application scope.

The useful principle for Atlas DAP is separation by ownership, not copying the reference application's domain code.

## Target Atlas DAP structure

```text
src/
  app/                         # thin App Router route entry points
    (public)/                  # marketing and public pages
    (auth)/                     # future login/register/verification routes
    (protected)/                # future authenticated route groups
      admin/
      recruiter/
      candidate/
    api/                        # only if Next route handlers are needed
    error.tsx
    loading.tsx
    layout.tsx
  components/                  # shared composition and providers
    ui/                         # reusable shadcn-style primitives
    providers.tsx
  features/
    auth/{api,components,hooks,schemas,types}
    admin/{api,components,hooks,types}
    recruiter/{api,components,hooks,schemas,types}
    candidate/{api,components,hooks,schemas,types}
    assessments/{api,components,hooks,schemas,types}
    problems/{api,components,hooks,schemas,types}
    invitations/{api,components,hooks,types}
    attempts/{api,components,hooks,schemas,types}
    payments/{api,components,hooks,types}
  hooks/                       # genuinely cross-feature client hooks
  lib/
    api.ts                     # shared request transport
    errors.ts
    query-client.ts
    query-hydration.tsx
    query-keys.ts
  providers/                   # future provider composition if it grows
  stores/                      # client-only Zustand stores
  types/                       # only cross-feature contract types
  utils/                       # pure cross-feature utilities
  server/                      # server-only modules; never imported by clients
  client/                      # browser-only modules when needed
  proxy.ts                     # Next.js 16 request boundary
```

The current project is not being blindly moved into this tree. Existing feature pages remain compatible with the current `app` and `components` layout until their corresponding Level 2 work is intentionally rebuilt.

## Boundary rules

- App Router pages and layouts stay thin and server-first.
- Feature components own interactivity, mutations, schemas, and feature hooks.
- `lib/api.ts` owns transport and cookie handling; feature API modules only define typed endpoint calls.
- TanStack Query owns server state; Zustand owns client-only UI/session cache state.
- Access and refresh tokens remain HttpOnly cookies. No token is copied to localStorage or decoded in the browser.
- `proxy.ts` only performs an inexpensive cookie-presence redirect. Backend authorization remains authoritative.
