import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdStatsOrientation = 'horizontal' | 'vertical';

@Directive({ selector: '[zdStats]', host: { '[class]': 'hostClasses()' } })
export class ZdStats {
  readonly orientation = input<ZdStatsOrientation | undefined, ZdStatsOrientation | undefined>(
    undefined,
    { transform: resolveStatsOrientation },
  );

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('stats'),
      this.orientation() === undefined
        ? undefined
        : this.classNames.daisyUi(`stats-${this.orientation()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

@Directive({ selector: '[zdStat]', host: { '[class]': 'hostClass' } })
export class ZdStat {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('stat');
}

@Directive({ selector: '[zdStatTitle]', host: { '[class]': 'hostClass' } })
export class ZdStatTitle {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('stat-title');
}

@Directive({ selector: '[zdStatValue]', host: { '[class]': 'hostClass' } })
export class ZdStatValue {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('stat-value');
}

@Directive({ selector: '[zdStatDesc]', host: { '[class]': 'hostClass' } })
export class ZdStatDesc {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('stat-desc');
}

@Directive({ selector: '[zdStatFigure]', host: { '[class]': 'hostClass' } })
export class ZdStatFigure {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('stat-figure');
}

@Directive({ selector: '[zdStatActions]', host: { '[class]': 'hostClass' } })
export class ZdStatActions {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('stat-actions');
}

export function resolveStatsOrientation(value: unknown): ZdStatsOrientation | undefined {
  if (value === undefined || value === 'horizontal' || value === 'vertical') return value;
  throw new RangeError(
    `Zordon UI Stats orientation must be horizontal, vertical, or undefined; received ${String(value)}.`,
  );
}
