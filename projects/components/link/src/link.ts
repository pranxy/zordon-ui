import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames, type ZdColor } from '@pranxy/zordon-ui';

import { coerceLinkHover, resolveLinkColor, ZD_LINK_DEFAULTS } from './link-defaults';

@Directive({
  selector: 'a[zdLink]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'ariaDisabled()',
    '(click)': 'guardNavigation($event)',
  },
})
export class ZdLink {
  readonly color = input<ZdColor | undefined, ZdColor | undefined>(undefined, {
    transform: resolveLinkColor,
  });
  readonly hover = input<boolean | undefined, boolean | '' | undefined>(undefined, {
    transform: coerceLinkHover,
  });
  readonly zdDisabled = input(false, { transform: booleanAttribute });

  private readonly classNames = inject(ZdClassNames);
  private readonly defaults = inject(ZD_LINK_DEFAULTS);

  protected readonly hostClasses = computed(() => {
    const color = this.effectiveColor();

    return joinLinkClasses(
      this.classNames.daisyUi('link'),
      color === undefined ? undefined : this.classNames.daisyUi(`link-${color}`),
      this.effectiveHover() && this.classNames.daisyUi('link-hover'),
    );
  });

  protected readonly ariaDisabled = computed(() => (this.zdDisabled() ? 'true' : null));

  protected guardNavigation(event: Event): void {
    if (this.zdDisabled()) event.preventDefault();
  }

  private effectiveColor(): ZdColor | undefined {
    return this.color() === undefined ? this.defaults.color : this.color();
  }

  private effectiveHover(): boolean {
    const hover = this.hover();
    return hover === undefined ? (this.defaults.hover ?? false) : hover;
  }
}

function joinLinkClasses(...tokens: readonly (string | false | undefined)[]): string {
  return tokens.filter((token): token is string => typeof token === 'string').join(' ');
}
