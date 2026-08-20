import {
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';

/** A component-owned, application-level configuration feature accepted by `provideZordonUi`. */
export interface ZdFeature {
  /** Stable component-specific feature key, used to reject duplicate configuration. */
  readonly key: string;
  /** Providers owned by the component feature. */
  readonly providers: EnvironmentProviders;
}

/** Class prefixes that must match the consuming application's Tailwind and daisyUI CSS setup. */
export interface ZdClassPrefixConfig {
  /** Exact daisyUI prefix string, including any separator, such as `d-`. */
  readonly daisyUi?: string;
  /** Tailwind v4 prefix identifier without the generated colon, such as `tw`. */
  readonly tailwind?: string;
}

/** Application-level Zordon UI configuration. */
export interface ZdConfig {
  readonly classPrefixes?: ZdClassPrefixConfig;
}

interface ZdResolvedClassPrefixes {
  readonly daisyUi: string;
  readonly tailwind: string;
}

const DAISY_UI_PREFIX_PATTERN = /^[a-z][A-Za-z0-9_-]*$/;
const TAILWIND_PREFIX_PATTERN = /^[a-z]+$/;
const DAISY_UI_CLASS_PATTERN = /^[a-z][a-z0-9-]*$/;
const THEME_CONTROLLER_CLASS = 'theme-controller';
const FEATURE_KEY_PATTERN = /^[a-z][a-z0-9-]*$/;

const DEFAULT_CLASS_PREFIXES: ZdResolvedClassPrefixes = Object.freeze({
  daisyUi: '',
  tailwind: '',
});

const ZD_CLASS_PREFIXES = new InjectionToken<ZdResolvedClassPrefixes>('Zordon UI class prefixes', {
  providedIn: 'root',
  factory: () => DEFAULT_CLASS_PREFIXES,
});

function resolveDaisyUiPrefix(prefix: unknown): string {
  if (prefix === undefined || prefix === '') return '';
  if (typeof prefix !== 'string' || !DAISY_UI_PREFIX_PATTERN.test(prefix)) {
    throw new RangeError(
      `Zordon UI daisyUI class prefix must be empty or start with a lowercase letter followed by ASCII letters, digits, underscores, or hyphens; received ${String(prefix)}.`,
    );
  }
  return prefix;
}

function resolveTailwindPrefix(prefix: unknown): string {
  if (prefix === undefined || prefix === '') return '';
  if (typeof prefix !== 'string' || !TAILWIND_PREFIX_PATTERN.test(prefix)) {
    throw new RangeError(
      `Zordon UI Tailwind class prefix must be empty or lowercase ASCII letters (a-z); received ${String(prefix)}.`,
    );
  }
  return prefix;
}

/**
 * Configures Zordon UI once at application bootstrap.
 *
 * Prefixes must match the consuming application's build-time Tailwind and daisyUI configuration.
 */
export function provideZordonUi(
  config: ZdConfig = {},
  ...features: readonly ZdFeature[]
): EnvironmentProviders {
  const classPrefixes = Object.freeze({
    daisyUi: resolveDaisyUiPrefix(config.classPrefixes?.daisyUi),
    tailwind: resolveTailwindPrefix(config.classPrefixes?.tailwind),
  });

  return makeEnvironmentProviders([
    { provide: ZD_CLASS_PREFIXES, useValue: classPrefixes },
    ...resolveFeatures(features),
  ]);
}

function resolveFeatures(features: readonly ZdFeature[]): readonly EnvironmentProviders[] {
  const keys = new Set<string>();

  return features.map(feature => {
    if (
      feature === null ||
      typeof feature !== 'object' ||
      typeof feature.key !== 'string' ||
      !FEATURE_KEY_PATTERN.test(feature.key) ||
      feature.providers === undefined
    ) {
      throw new TypeError('Zordon UI features must have a lowercase component key.');
    }
    if (keys.has(feature.key)) {
      throw new RangeError(`Zordon UI feature "${feature.key}" can only be configured once.`);
    }
    keys.add(feature.key);
    return feature.providers;
  });
}

/** Generates complete daisyUI class tokens using the configured build-time prefixes. */
@Injectable({ providedIn: 'root' })
export class ZdClassNames {
  private readonly prefixes = inject(ZD_CLASS_PREFIXES);

  daisyUi(className: string): string {
    if (!DAISY_UI_CLASS_PATTERN.test(className)) {
      throw new RangeError(
        `Zordon UI daisyUI class name must be one unprefixed lowercase token; received ${String(className)}.`,
      );
    }

    const daisyUiClass = `${this.prefixes.daisyUi}${className}`;
    return this.prefixes.tailwind && className !== THEME_CONTROLLER_CLASS
      ? `${this.prefixes.tailwind}:${daisyUiClass}`
      : daisyUiClass;
  }
}
