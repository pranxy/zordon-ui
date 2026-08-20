import { booleanAttribute, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { type ZdColor, type ZdFeature } from '@pranxy/zordon-ui';

const LINK_COLORS = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies readonly ZdColor[];

export interface ZdLinkDefaults {
  readonly color?: ZdColor;
  readonly hover?: boolean;
}

export const ZD_LINK_DEFAULTS = new InjectionToken<Readonly<ZdLinkDefaults>>(
  'Zordon UI Link defaults',
  {
    providedIn: 'root',
    factory: () => EMPTY_LINK_DEFAULTS,
  },
);

const EMPTY_LINK_DEFAULTS: Readonly<ZdLinkDefaults> = Object.freeze({});

/** Configures immutable application defaults for native `[zdLink]` instances. */
export function withLinkDefaults(defaults: ZdLinkDefaults): ZdFeature {
  const resolvedDefaults = resolveLinkDefaults(defaults);

  return {
    key: 'link-defaults',
    providers: makeEnvironmentProviders([
      {
        provide: ZD_LINK_DEFAULTS,
        useValue: resolvedDefaults,
      },
    ]),
  };
}

export function resolveLinkColor(value: unknown): ZdColor | undefined {
  return resolveOptionalValue(value, LINK_COLORS, 'color');
}

export function resolveLinkHover(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  throw new RangeError(
    `Zordon UI Link hover must be a boolean or undefined; received ${String(value)}.`,
  );
}

/** Preserves input omission while accepting Angular's native boolean-attribute forms. */
export function coerceLinkHover(value: unknown): boolean | undefined {
  return value === undefined ? undefined : booleanAttribute(value);
}

function resolveLinkDefaults(defaults: ZdLinkDefaults): Readonly<ZdLinkDefaults> {
  if (defaults === null || typeof defaults !== 'object' || Array.isArray(defaults)) {
    throw new TypeError('Zordon UI Link defaults must be an object.');
  }

  const allowedKeys = new Set<keyof ZdLinkDefaults>(['color', 'hover']);
  for (const key of Object.keys(defaults)) {
    if (!allowedKeys.has(key as keyof ZdLinkDefaults)) {
      throw new RangeError(`Zordon UI Link defaults do not support "${key}".`);
    }
  }

  const color = resolveLinkColor(defaults.color);
  const hover = resolveLinkHover(defaults.hover);

  return Object.freeze({
    ...(color === undefined ? {} : { color }),
    ...(hover === undefined ? {} : { hover }),
  });
}

function resolveOptionalValue<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  name: string,
): T | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'string' && allowedValues.includes(value as T)) return value as T;
  throw new RangeError(
    `Zordon UI Link ${name} must be one of ${allowedValues.join(', ')} or undefined; received ${String(value)}.`,
  );
}
