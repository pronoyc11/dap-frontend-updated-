# Assignment 6 backend contract

This document records the contract read from `../Assingment6`, which is the source of truth for the frontend.

## Transport and base path

- The API is mounted at `/api/v1`.
- Local development uses `http://localhost:5000/api/v1`.
- The deployed backend is configured through `API_BASE_URL`; the frontend does not hardcode it.
- CORS allows credentials. Browser requests therefore use `credentials: "include"`.

## Response envelopes

Successful responses are `{ success: true, message: string, data: T }`.
Errors are `{ success: false, message: string, errors: unknown[] }`.
Validation errors contain `{ field, message }` entries in `errors`.

## Authentication

- Login: `POST /auth/login` with `{ email, password }`.
- A successful login returns `{ user, accessToken, refreshToken }` in `data` and sets HttpOnly `accessToken` and `refreshToken` cookies.
- Access tokens expire in 15 minutes by default; refresh tokens expire in 7 days by default.
- Protected endpoints accept the access token from either the `Authorization: Bearer ...` header or the `accessToken` cookie. The frontend uses cookies.
- Refresh: `POST /auth/refresh`; the refresh token may be supplied in the body or `refreshToken` cookie. The endpoint rotates both tokens and sets replacement cookies.
- Logout: `POST /auth/logout`; the refresh token may be supplied in the body or cookie. The backend revokes it and clears both cookies.
- The client retries one 401 response after refresh and never refreshes auth endpoints, preventing an infinite refresh loop.

## User and roles

Roles are `CANDIDATE`, `RECRUITER`, and `ADMIN`.

Authenticated users contain `id`, `email`, `name`, `role`, `emailVerified`, and optional `recruiterStatus`. User profiles additionally contain `status`, `avatarUrl`, `authProvider`, `createdAt`, and `updatedAt`.

`UserStatus` values are `ACTIVE`, `BLOCKED`, and `SUSPENDED`. `RecruiterStatus` values are `NOT_REQUESTED`, `PENDING`, and `APPROVED`.

## Relevant routes

- Health: `GET /health`
- Authenticated identity: `GET /auth-test/me`
- Profile: `GET /users/me`
- Role-protected resources are mounted under `/admin`, `/problems`, `/assessments`, `/invitations`, `/attempts`, `/submissions`, and `/recruiters`.

## Google authentication finding

Assignment 6 does support Google sign-in, but it is not an OAuth redirect/callback flow. `POST /auth/google` accepts either `{ idToken }` or `{ credential }`. The backend verifies the Google ID token with `GOOGLE_CLIENT_ID`, creates or updates a Google-backed user, then sets the same HttpOnly access and refresh cookies used by password login. There is no Google callback route in `src/modules/auth`.

The frontend must therefore use a Google Identity Services client to obtain an ID token/credential and send it to `/auth/google`. It must not send the Google client secret, manufacture a session, or treat the provider response as the application's authentication state. Google support should be implemented in the later authentication level after configuring the backend's `GOOGLE_CLIENT_ID` and the provider's authorized JavaScript origins.
