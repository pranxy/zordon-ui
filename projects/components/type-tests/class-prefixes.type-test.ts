import {
  provideZordonUi,
  ZdClassNames,
  type ZdClassPrefixConfig,
  type ZdConfig,
} from '../src/public-api';

export const prefixConfig = {
  classPrefixes: {
    daisyUi: 'd-',
    tailwind: 'tw',
  },
} satisfies ZdConfig;

export const prefixProviders = provideZordonUi(prefixConfig);
export const explicitPrefixes: ZdClassPrefixConfig = { daisyUi: '', tailwind: '' };
export declare const classNames: ZdClassNames;
export const generatedClass: string = classNames.daisyUi('btn');

// @ts-expect-error Prefix values are strings, not numeric configuration.
provideZordonUi({ classPrefixes: { tailwind: 1 } });
// @ts-expect-error Prefix options are nested under classPrefixes.
provideZordonUi({ tailwindPrefix: 'tw' });
// @ts-expect-error Unknown prefix keys are rejected by the public configuration type.
export const invalidPrefixes: ZdClassPrefixConfig = { daisy: 'd-' };
