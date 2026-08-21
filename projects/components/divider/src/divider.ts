import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames, type ZdColor } from '@pranxy/zordon-ui';

import {
  resolveDividerColor,
  resolveDividerOrientation,
  resolveDividerPlacement,
  type ZdDividerOrientation,
  type ZdDividerPlacement,
  ZD_DIVIDER_DEFAULTS,
} from './divider-defaults';

@Directive({
  selector: '[zdDivider]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ZdDivider {
  readonly color = input<ZdColor | undefined, ZdColor | undefined>(undefined, {
    transform: resolveDividerColor,
  });
  readonly orientation = input<ZdDividerOrientation | undefined, ZdDividerOrientation | undefined>(
    undefined,
    { transform: resolveDividerOrientation },
  );
  readonly placement = input<ZdDividerPlacement | undefined, ZdDividerPlacement | undefined>(
    undefined,
    { transform: resolveDividerPlacement },
  );

  private readonly classNames = inject(ZdClassNames);
  private readonly defaults = inject(ZD_DIVIDER_DEFAULTS);

  protected readonly hostClasses = computed(() => {
    const color = this.effectiveColor();
    const orientation = this.effectiveOrientation();
    const placement = this.effectivePlacement();

    return joinDividerClasses(
      this.classNames.daisyUi('divider'),
      color === undefined ? undefined : this.classNames.daisyUi(`divider-${color}`),
      orientation === undefined ? undefined : this.classNames.daisyUi(`divider-${orientation}`),
      placement === undefined || placement === 'center'
        ? undefined
        : this.classNames.daisyUi(`divider-${placement}`),
    );
  });

  private effectiveColor(): ZdColor | undefined {
    return this.color() === undefined ? this.defaults.color : this.color();
  }

  private effectiveOrientation(): ZdDividerOrientation | undefined {
    return this.orientation() === undefined ? this.defaults.orientation : this.orientation();
  }

  private effectivePlacement(): ZdDividerPlacement | undefined {
    return this.placement() === undefined ? this.defaults.placement : this.placement();
  }
}

function joinDividerClasses(...tokens: readonly (string | undefined)[]): string {
  return tokens.filter((token): token is string => typeof token === 'string').join(' ');
}
