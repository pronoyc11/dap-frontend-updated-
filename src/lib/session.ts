import type { Role } from "./types";

// This hint is only for instant navigation rendering. The backend HttpOnly
// cookie remains the source of truth for authentication and authorization.
export function markSession(role?: Role) {
  if (typeof document !== "undefined" && role)
    document.cookie = `sessionRole=${role}; path=/; max-age=86400; samesite=lax`;
}

export function clearSessionHint() {
  if (typeof document !== "undefined")
    document.cookie = "sessionRole=; path=/; max-age=0; samesite=lax";
}
