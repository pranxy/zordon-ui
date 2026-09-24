import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdBadgeColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type ZdBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdBadgeVariant = 'outline' | 'dash' | 'soft' | 'ghost';

@Directive({
  selector: '[zdBadge]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdBadge {
  readonly color = input<ZdBadgeColor | undefined, ZdBadgeColor | undefined>(undefined, {
    transform: resolveBadgeColor,
  });
  readonly size = input<ZdBadgeSize | undefined, ZdBadgeSize | undefined>(undefined, {
    transform: resolveBadgeSize,
  });
  readonly variant = input<ZdBadgeVariant | undefined, ZdBadgeVariant | undefined>(undefined, {
    transform: resolveBadgeVariant,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('badge'),
      this.color() === undefined ? undefined : this.classNames.daisyUi(`badge-${this.color()}`),
      this.variant() === undefined ? undefined : this.classNames.daisyUi(`badge-${this.variant()}`),
      this.size() === undefined ? undefined : this.classNames.daisyUi(`badge-${this.size()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

export function resolveBadgeColor(value: unknown): ZdBadgeColor | undefined {
  if (value === undefined) return undefined;
  if (
    value === 'neutral' ||
    value === 'primary' ||
    value === 'secondary' ||
    value === 'accent' ||
    value === 'info' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'error'
  ) {
    return value;
  }
  throw new RangeError(
    `Zordon UI Badge color must be neutral, primary, secondary, accent, info, success, warning, error, or undefined; received ${String(value)}.`,
  );
}

export function resolveBadgeSize(value: unknown): ZdBadgeSize | undefined {
  if (value === undefined) return undefined;
  if (value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') {
    return value;
  }
  throw new RangeError(
    `Zordon UI Badge size must be xs, sm, md, lg, xl, or undefined; received ${String(value)}.`,
  );
}

export function resolveBadgeVariant(value: unknown): ZdBadgeVariant | undefined {
  if (value === undefined) return undefined;
  if (value === 'outline' || value === 'dash' || value === 'soft' || value === 'ghost') {
    return value;
  }
  throw new RangeError(
    `Zordon UI Badge variant must be outline, dash, soft, ghost, or undefined; received ${String(value)}.`,
  );
}
