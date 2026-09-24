import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdCardSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdCardVariant = 'border' | 'dash';

@Directive({
  selector: '[zdCard]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdCard {
  readonly imageFull = input(false, { transform: booleanAttribute });
  readonly side = input(false, { transform: booleanAttribute });
  readonly size = input<ZdCardSize | undefined, ZdCardSize | undefined>(undefined, {
    transform: resolveCardSize,
  });
  readonly variant = input<ZdCardVariant | undefined, ZdCardVariant | undefined>(undefined, {
    transform: resolveCardVariant,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('card'),
      this.variant() === undefined ? undefined : this.classNames.daisyUi(`card-${this.variant()}`),
      this.size() === undefined ? undefined : this.classNames.daisyUi(`card-${this.size()}`),
      this.side() ? this.classNames.daisyUi('card-side') : undefined,
      this.imageFull() ? this.classNames.daisyUi('image-full') : undefined,
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

@Directive({ selector: '[zdCardBody]', host: { '[class]': 'hostClass' } })
export class ZdCardBody {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('card-body');
}

@Directive({ selector: '[zdCardTitle]', host: { '[class]': 'hostClass' } })
export class ZdCardTitle {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('card-title');
}

@Directive({ selector: '[zdCardActions]', host: { '[class]': 'hostClass' } })
export class ZdCardActions {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('card-actions');
}

export function resolveCardSize(value: unknown): ZdCardSize | undefined {
  if (value === undefined) return undefined;
  if (value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') {
    return value;
  }
  throw new RangeError(
    `Zordon UI Card size must be xs, sm, md, lg, xl, or undefined; received ${String(value)}.`,
  );
}

export function resolveCardVariant(value: unknown): ZdCardVariant | undefined {
  if (value === undefined) return undefined;
  if (value === 'border' || value === 'dash') return value;
  throw new RangeError(
    `Zordon UI Card variant must be border, dash, or undefined; received ${String(value)}.`,
  );
}
