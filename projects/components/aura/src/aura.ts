import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdAuraSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdAuraVariant = 'dual' | 'rainbow' | 'holo' | 'gold' | 'silver' | 'glow';

@Directive({
  selector: '[zdAura]',
  host: {
    '[attr.data-zd-aura]': 'true',
    '[class]': 'hostClasses()',
  },
})
export class ZdAura {
  readonly size = input<ZdAuraSize | undefined, ZdAuraSize | undefined>(undefined, {
    transform: resolveAuraSize,
  });
  readonly variant = input<ZdAuraVariant | undefined, ZdAuraVariant | undefined>(undefined, {
    transform: resolveAuraVariant,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('aura'),
      this.variant() === undefined ? undefined : this.classNames.daisyUi(`aura-${this.variant()}`),
      this.size() === undefined ? undefined : this.classNames.daisyUi(`aura-${this.size()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

export function resolveAuraSize(value: unknown): ZdAuraSize | undefined {
  if (value === undefined) return undefined;
  if (value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') {
    return value;
  }
  throw new RangeError(
    `Zordon UI Aura size must be xs, sm, md, lg, xl, or undefined; received ${String(value)}.`,
  );
}

export function resolveAuraVariant(value: unknown): ZdAuraVariant | undefined {
  if (value === undefined) return undefined;
  if (
    value === 'dual' ||
    value === 'rainbow' ||
    value === 'holo' ||
    value === 'gold' ||
    value === 'silver' ||
    value === 'glow'
  ) {
    return value;
  }
  throw new RangeError(
    `Zordon UI Aura variant must be dual, rainbow, holo, gold, silver, glow, or undefined; received ${String(value)}.`,
  );
}
