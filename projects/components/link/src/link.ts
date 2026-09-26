import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { ZdClassNames, type ZdColor } from '@pranxy/zordon-ui';

import { coerceLinkHover, resolveLinkColor, ZD_LINK_DEFAULTS } from './link-defaults';

@Directive({
  selector: 'a[zdLink]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'ariaDisabled()',
  },
})
export class ZdLink {
  readonly color = input<ZdColor | undefined, ZdColor | undefined>(undefined, {
    transform: resolveLinkColor,
  });
  readonly hover = input<boolean | undefined, boolean | '' | undefined>(undefined, {
    transform: coerceLinkHover,
  });
  readonly disabled = input(false, { transform: booleanAttribute });

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

  protected readonly ariaDisabled = computed(() => (this.disabled() ? 'true' : null));

  constructor() {
    guardUnavailableActivation(inject(ElementRef<HTMLAnchorElement>).nativeElement, () =>
      this.disabled(),
    );
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

/**
 * Stops activation of an unavailable anchor before anything else sees it. Capture listeners on the
 * target run before its bubbling ones, so RouterLink and consumer click handlers never receive the
 * event and neither native nor Router navigation happens.
 */
function guardUnavailableActivation(host: HTMLElement, unavailable: () => boolean): void {
  const guard = (event: Event): void => {
    if (!unavailable()) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  const options = { capture: true };
  host.addEventListener('click', guard, options);
  host.addEventListener('auxclick', guard, options);
  inject(DestroyRef).onDestroy(() => {
    host.removeEventListener('click', guard, options);
    host.removeEventListener('auxclick', guard, options);
  });
}
