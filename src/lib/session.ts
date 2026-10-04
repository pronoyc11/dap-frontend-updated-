export const SESSION_HINT = "dap_session";

export function markSession() {
  if (typeof document !== "undefined") document.cookie = `${SESSION_HINT}=1; Path=/; Max-Age=604800; SameSite=Lax`;
}

export function clearSession() {
  if (typeof document !== "undefined") document.cookie = `${SESSION_HINT}=; Path=/; Max-Age=0; SameSite=Lax`;
}
