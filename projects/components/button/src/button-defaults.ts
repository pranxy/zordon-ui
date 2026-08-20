import { InjectionToken, makeEnvironmentProviders } from '@angular/core';

import type { ZdColor, ZdFeature, ZdSize } from '@pranxy/zordon-ui';

const BUTTON_COLORS = [
  'neutral',
  'primary',
  'secondary',
  'accent',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies readonly ZdColor[];

const BUTTON_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies readonly ZdSize[];

export type ZdButtonVariant = 'outline' | 'dash' | 'soft' | 'ghost' | 'link';

export type ZdButtonLayout = 'wide' | 'block' | 'square' | 'circle';

const BUTTON_VARIANTS = ['outline', 'dash', 'soft', 'ghost', 'link'] as const satisfies readonly ZdButtonVariant[];

const BUTTON_LAYOUTS = ['wide', 'block', 'square', 'circle'] as const satisfies readonly ZdButtonLayout[];

export interface ZdButtonDefaults {
  readonly color?: ZdColor;
  readonly variant?: ZdButtonVariant;
  readonly size?: ZdSize;
  readonly layout?: ZdButtonLayout;
}

export const ZD_BUTTON_DEFAULTS = new InjectionToken<Readonly<ZdButtonDefaults>>(
  'Zordon UI Button defaults',
  {
    providedIn: 'root',
    factory: () => EMPTY_BUTTON_DEFAULTS,
  },
);

const EMPTY_BUTTON_DEFAULTS: Readonly<ZdButtonDefaults> = Object.freeze({});

/** Configures immutable application defaults for native `[zdButton]` instances. */
export function withButtonDefaults(defaults: ZdButtonDefaults): ZdFeature {
  const resolvedDefaults = resolveButtonDefaults(defaults);

  return {
    key: 'button-defaults',
    providers: makeEnvironmentProviders([
      {
        provide: ZD_BUTTON_DEFAULTS,
        useValue: resolvedDefaults,
      },
    ]),
  };
}

export function resolveButtonColor(value: unknown): ZdColor | undefined {
  return resolveOptionalValue(value, BUTTON_COLORS, 'color');
}

export function resolveButtonVariant(value: unknown): ZdButtonVariant | undefined {
  return resolveOptionalValue(value, BUTTON_VARIANTS, 'variant');
}

export function resolveButtonSize(value: unknown): ZdSize | undefined {
  return resolveOptionalValue(value, BUTTON_SIZES, 'size');
}

export function resolveButtonLayout(value: unknown): ZdButtonLayout | undefined {
  return resolveOptionalValue(value, BUTTON_LAYOUTS, 'layout');
}

function resolveButtonDefaults(defaults: ZdButtonDefaults): Readonly<ZdButtonDefaults> {
  if (defaults === null || typeof defaults !== 'object' || Array.isArray(defaults)) {
    throw new TypeError('Zordon UI Button defaults must be an object.');
  }

  const allowedKeys = new Set<keyof ZdButtonDefaults>(['color', 'variant', 'size', 'layout']);
  for (const key of Object.keys(defaults)) {
    if (!allowedKeys.has(key as keyof ZdButtonDefaults)) {
      throw new RangeError(`Zordon UI Button defaults do not support "${key}".`);
    }
  }

  const color = resolveButtonColor(defaults.color);
  const variant = resolveButtonVariant(defaults.variant);
  const size = resolveButtonSize(defaults.size);
  const layout = resolveButtonLayout(defaults.layout);

  return Object.freeze({
    ...(color === undefined ? {} : { color }),
    ...(variant === undefined ? {} : { variant }),
    ...(size === undefined ? {} : { size }),
    ...(layout === undefined ? {} : { layout }),
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
    `Zordon UI Button ${name} must be one of ${allowedValues.join(', ')} or undefined; received ${String(value)}.`,
  );
}
