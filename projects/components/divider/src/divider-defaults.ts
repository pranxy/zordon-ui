import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { type ZdColor, type ZdFeature } from '@pranxy/zordon-ui';

const DIVIDER_COLORS = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies readonly ZdColor[];

export type ZdDividerOrientation = 'vertical' | 'horizontal';
export type ZdDividerPlacement = 'start' | 'center' | 'end';

const DIVIDER_ORIENTATIONS: readonly ZdDividerOrientation[] = ['vertical', 'horizontal'];
const DIVIDER_PLACEMENTS: readonly ZdDividerPlacement[] = ['start', 'center', 'end'];

export interface ZdDividerDefaults {
  readonly color?: ZdColor;
  readonly orientation?: ZdDividerOrientation;
  readonly placement?: ZdDividerPlacement;
}

export const ZD_DIVIDER_DEFAULTS = new InjectionToken<Readonly<ZdDividerDefaults>>(
  'Zordon UI Divider defaults',
  {
    providedIn: 'root',
    factory: () => EMPTY_DIVIDER_DEFAULTS,
  },
);

const EMPTY_DIVIDER_DEFAULTS: Readonly<ZdDividerDefaults> = Object.freeze({});

/** Configures immutable application defaults for native `[zdDivider]` instances. */
export function withDividerDefaults(defaults: ZdDividerDefaults): ZdFeature {
  const resolvedDefaults = resolveDividerDefaults(defaults);

  return {
    key: 'divider-defaults',
    providers: makeEnvironmentProviders([
      {
        provide: ZD_DIVIDER_DEFAULTS,
        useValue: resolvedDefaults,
      },
    ]),
  };
}

export function resolveDividerColor(value: unknown): ZdColor | undefined {
  return resolveOptionalValue(value, DIVIDER_COLORS, 'color');
}

export function resolveDividerOrientation(value: unknown): ZdDividerOrientation | undefined {
  return resolveOptionalValue(value, DIVIDER_ORIENTATIONS, 'orientation');
}

export function resolveDividerPlacement(value: unknown): ZdDividerPlacement | undefined {
  return resolveOptionalValue(value, DIVIDER_PLACEMENTS, 'placement');
}

function resolveDividerDefaults(defaults: ZdDividerDefaults): Readonly<ZdDividerDefaults> {
  if (defaults === null || typeof defaults !== 'object' || Array.isArray(defaults)) {
    throw new TypeError('Zordon UI Divider defaults must be an object.');
  }

  const allowedKeys = new Set<keyof ZdDividerDefaults>(['color', 'orientation', 'placement']);
  for (const key of Object.keys(defaults)) {
    if (!allowedKeys.has(key as keyof ZdDividerDefaults)) {
      throw new RangeError(`Zordon UI Divider defaults do not support "${key}".`);
    }
  }

  const color = resolveDividerColor(defaults.color);
  const orientation = resolveDividerOrientation(defaults.orientation);
  const placement = resolveDividerPlacement(defaults.placement);

  return Object.freeze({
    ...(color === undefined ? {} : { color }),
    ...(orientation === undefined ? {} : { orientation }),
    ...(placement === undefined ? {} : { placement }),
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
    `Zordon UI Divider ${name} must be one of ${allowedValues.join(', ')} or undefined; received ${String(value)}.`,
  );
}
