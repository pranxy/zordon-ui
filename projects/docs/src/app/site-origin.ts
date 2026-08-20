import { InjectionToken } from '@angular/core';

export const DOCS_CANONICAL_ORIGIN = new InjectionToken<string | undefined>(
  'DOCS_CANONICAL_ORIGIN',
  { factory: () => undefined },
);

export function normalizeCanonicalOrigin(value: string | undefined): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    const hasOriginOnly =
      url.protocol === 'https:' &&
      url.username === '' &&
      url.password === '' &&
      url.pathname === '/' &&
      url.search === '' &&
      url.hash === '';

    return hasOriginOnly ? url.origin : undefined;
  } catch {
    return undefined;
  }
}
