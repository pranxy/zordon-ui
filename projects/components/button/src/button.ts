import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
} from '@angular/core';

import { ZdClassNames, type ZdColor, type ZdSize } from '@pranxy/zordon-ui';

import {
  resolveButtonColor,
  resolveButtonLayout,
  resolveButtonSize,
  resolveButtonVariant,
  ZD_BUTTON_DEFAULTS,
  type ZdButtonLayout,
  type ZdButtonVariant,
} from './button-defaults';

@Directive({
  selector:
    'button[zdButton], a[zdButton], input[type="button"][zdButton], input[type="submit"][zdButton], input[type="reset"][zdButton]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-pressed]': 'ariaPressed()',
    '[attr.aria-disabled]': 'ariaDisabled()',
    '[attr.disabled]': 'nativeDisabled()',
    '(click)': 'guardActivation($event)',
  },
})
export class ZdButton {
  readonly color = input<ZdColor | undefined, ZdColor | undefined>(undefined, {
    transform: resolveButtonColor,
  });
  readonly variant = input<ZdButtonVariant | undefined, ZdButtonVariant | undefined>(undefined, {
    transform: resolveButtonVariant,
  });
  readonly size = input<ZdSize | undefined, ZdSize | undefined>(undefined, {
    transform: resolveButtonSize,
  });
  readonly layout = input<ZdButtonLayout | undefined, ZdButtonLayout | undefined>(undefined, {
    transform: resolveButtonLayout,
  });
  readonly active = input(false, { transform: booleanAttribute });
  readonly pressed = input<boolean | null | undefined>();
  readonly loading = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly classNames = inject(ZdClassNames);
  private readonly defaults = inject(ZD_BUTTON_DEFAULTS);
  private readonly isLinkHost = this.host.nativeElement.tagName.toLowerCase() === 'a';

  protected readonly hostClasses = computed(() =>
    joinButtonClasses(
      this.classNames.daisyUi('btn'),
      this.modifierClass(this.effectiveColor()),
      this.modifierClass(this.effectiveVariant()),
      this.modifierClass(this.effectiveSize()),
      this.modifierClass(this.effectiveLayout()),
      this.active() && this.classNames.daisyUi('btn-active'),
      this.isActivationGuarded() && this.classNames.daisyUi('btn-disabled'),
    ),
  );

  protected readonly ariaPressed = computed(() => this.pressed() ?? null);
  protected readonly ariaDisabled = computed(() =>
    this.isActivationGuarded() ? 'true' : null,
  );

  /** On buttons and inputs, `disabled` is the native attribute; links have none. */
  protected readonly nativeDisabled = computed(() =>
    !this.isLinkHost && this.disabled() ? '' : null,
  );

  constructor() {
    if (this.isLinkHost) guardUnavailableLink(this.host.nativeElement, () => this.disabled());
  }

  protected guardActivation(event: Event): void {
    if (this.isActivationGuarded()) event.preventDefault();
  }

  private effectiveColor(): ZdColor | undefined {
    return this.color() === undefined ? this.defaults.color : this.color();
  }

  private effectiveVariant(): ZdButtonVariant | undefined {
    return this.variant() === undefined ? this.defaults.variant : this.variant();
  }

  private effectiveSize(): ZdSize | undefined {
    return this.size() === undefined ? this.defaults.size : this.size();
  }

  private effectiveLayout(): ZdButtonLayout | undefined {
    return this.layout() === undefined ? this.defaults.layout : this.layout();
  }

  private isActivationGuarded(): boolean {
    return this.loading() || (this.isLinkHost && this.disabled());
  }

  private modifierClass(modifier: string | undefined): string | undefined {
    return modifier === undefined ? undefined : this.classNames.daisyUi(`btn-${modifier}`);
  }
}

function joinButtonClasses(...tokens: readonly (string | false | undefined)[]): string {
  return tokens.filter((token): token is string => typeof token === 'string').join(' ');
}

/**
 * Stops activation of a disabled link before anything else sees it. Capture listeners on the target
 * run before its bubbling ones, so RouterLink and consumer click handlers never receive the event
 * and neither native nor Router navigation happens.
 */
function guardUnavailableLink(host: HTMLElement, unavailable: () => boolean): void {
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
