/**
 * Per-viewer preferences (theme, package manager). Browser storage can be missing or throw
 * (private windows, blocked site data), so every access is guarded and callers must render
 * correctly without a stored value. Only call these after hydration.
 */
export function readPreference(document: Document, key: string): string | null {
  try {
    return document.defaultView?.localStorage.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writePreference(document: Document, key: string, value: string): void {
  try {
    document.defaultView?.localStorage.setItem(key, value);
  } catch {
    // The choice simply is not remembered.
  }
}
