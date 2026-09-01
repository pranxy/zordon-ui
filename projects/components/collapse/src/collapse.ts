import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdCollapseForcedState = 'open' | 'close';
export type ZdCollapseIndicator = 'arrow' | 'plus';

@Directive({
  selector: '[zdCollapse]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdCollapse {
  readonly indicator = input<ZdCollapseIndicator | undefined, ZdCollapseIndicator | undefined>(
    undefined,
    { transform: resolveCollapseIndicator },
  );
  readonly forcedState = input<
    ZdCollapseForcedState | undefined,
    ZdCollapseForcedState | undefined
  >(undefined, { transform: resolveCollapseForcedState });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('collapse'),
      this.indicator() === undefined
        ? undefined
        : this.classNames.daisyUi(`collapse-${this.indicator()}`),
      this.forcedState() === undefined
        ? undefined
        : this.classNames.daisyUi(`collapse-${this.forcedState()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

@Directive({ selector: '[zdCollapseTitle]', host: { '[class]': 'hostClass' } })
export class ZdCollapseTitle {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('collapse-title');
}

@Directive({ selector: '[zdCollapseContent]', host: { '[class]': 'hostClass' } })
export class ZdCollapseContent {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('collapse-content');
}

export function resolveCollapseIndicator(value: unknown): ZdCollapseIndicator | undefined {
  if (value === undefined || value === 'arrow' || value === 'plus') return value;
  throw new RangeError(
    `Zordon UI Collapse indicator must be arrow, plus, or undefined; received ${String(value)}.`,
  );
}

export function resolveCollapseForcedState(value: unknown): ZdCollapseForcedState | undefined {
  if (value === undefined || value === 'open' || value === 'close') return value;
  throw new RangeError(
    `Zordon UI Collapse forcedState must be open, close, or undefined; received ${String(value)}.`,
  );
}
