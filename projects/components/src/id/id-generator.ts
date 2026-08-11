import { APP_ID, inject, Injectable } from '@angular/core';

const ID_SCOPE_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function encodeAppId(appId: unknown): string {
  if (typeof appId !== 'string' || appId.length === 0) {
    throw new RangeError(
      `Angular APP_ID must be a non-empty string when generating Zordon UI IDs; received ${String(appId)}.`,
    );
  }

  return Array.from(appId, character => character.codePointAt(0)!.toString(16)).join('_');
}

/**
 * Generates deterministic, application-scoped IDs for accessible element relationships.
 *
 * Server and client allocations within a scope must occur in the same order. Use an explicit ID
 * across independently triggered incremental-hydration boundaries. Generated text is not a stable
 * customization contract.
 */
@Injectable({ providedIn: 'root' })
export class ZdIdGenerator {
  private readonly applicationNamespace = encodeAppId(inject(APP_ID));
  private readonly counters = new Map<string, number>();

  /** Returns the next ID in a lowercase ASCII kebab-case, component-owned scope. */
  next(scope: string): string {
    if (typeof scope !== 'string' || !ID_SCOPE_PATTERN.test(scope)) {
      throw new RangeError(
        `Zordon UI ID scope must be one lowercase ASCII kebab-case token; received ${String(scope)}.`,
      );
    }

    const index = this.counters.get(scope) ?? 0;
    this.counters.set(scope, index + 1);
    return `zd-${scope}-${this.applicationNamespace}-${index}`;
  }
}
