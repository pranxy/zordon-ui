import { booleanAttribute, computed, Directive, ElementRef, inject, input } from '@angular/core';

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
    'button[zdButton], a[href][zdButton], input[type="button"][zdButton], input[type="submit"][zdButton], input[type="reset"][zdButton]',
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-pressed]': 'ariaPressed()',
    '[attr.aria-disabled]': 'ariaDisabled()',
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
  readonly zdDisabled = input(false, { transform: booleanAttribute });

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly classNames = inject(ZdClassNames);
  private readonly defaults = inject(ZD_BUTTON_DEFAULTS);
  private readonly isLinkHost = this.host.nativeElement.tagName.toLowerCase() === 'a';

  protected readonly hostClasses = computed(() => {
    this.assertStateConfiguration();
    return joinButtonClasses(
      this.classNames.daisyUi('btn'),
      this.modifierClass(this.effectiveColor()),
      this.modifierClass(this.effectiveVariant()),
      this.modifierClass(this.effectiveSize()),
      this.modifierClass(this.effectiveLayout()),
      this.active() && this.classNames.daisyUi('btn-active'),
      this.isActivationGuarded() && this.classNames.daisyUi('btn-disabled'),
    );
  });

  protected readonly ariaPressed = computed(() => this.pressed() ?? null);
  protected readonly ariaDisabled = computed(() =>
    this.isActivationGuarded() ? 'true' : null,
  );

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
    return this.loading() || (this.isLinkHost && this.zdDisabled());
  }

  private modifierClass(modifier: string | undefined): string | undefined {
    return modifier === undefined ? undefined : this.classNames.daisyUi(`btn-${modifier}`);
  }

  private assertStateConfiguration(): void {
    if (this.zdDisabled() && !this.isLinkHost) {
      throw new TypeError('zdDisabled is supported only on a[href][zdButton]; use native disabled otherwise.');
    }
  }
}

function joinButtonClasses(...tokens: readonly (string | false | undefined)[]): string {
  return tokens.filter((token): token is string => typeof token === 'string').join(' ');
}
