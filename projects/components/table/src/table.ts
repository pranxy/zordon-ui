import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdTableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({ selector: '[zdTable]', host: { '[class]': 'hostClasses()' } })
export class ZdTable {
  readonly size = input<ZdTableSize | undefined, ZdTableSize | undefined>(undefined, {
    transform: resolveTableSize,
  });
  readonly zebra = input(false, { transform: booleanAttribute });
  readonly pinRows = input(false, { transform: booleanAttribute });
  readonly pinCols = input(false, { transform: booleanAttribute });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('table'),
      this.size() === undefined ? undefined : this.classNames.daisyUi(`table-${this.size()}`),
      this.zebra() ? this.classNames.daisyUi('table-zebra') : undefined,
      this.pinRows() ? this.classNames.daisyUi('table-pin-rows') : undefined,
      this.pinCols() ? this.classNames.daisyUi('table-pin-cols') : undefined,
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

export function resolveTableSize(value: unknown): ZdTableSize | undefined {
  if (
    value === undefined ||
    value === 'xs' ||
    value === 'sm' ||
    value === 'md' ||
    value === 'lg' ||
    value === 'xl'
  )
    return value;
  throw new RangeError(
    `Zordon UI Table size must be xs, sm, md, lg, xl, or undefined; received ${String(value)}.`,
  );
}
