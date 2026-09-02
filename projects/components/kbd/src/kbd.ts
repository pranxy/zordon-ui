import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdKbdSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({
  selector: 'kbd[zdKbd]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdKbd {
  readonly size = input<ZdKbdSize | undefined, ZdKbdSize | undefined>(undefined, {
    transform: resolveKbdSize,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('kbd'),
      this.size() === undefined ? undefined : this.classNames.daisyUi(`kbd-${this.size()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

export function resolveKbdSize(value: unknown): ZdKbdSize | undefined {
  if (value === undefined) return undefined;
  if (value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') {
    return value;
  }
  throw new RangeError(
    `Zordon UI Kbd size must be xs, sm, md, lg, xl, or undefined; received ${String(value)}.`,
  );
}
