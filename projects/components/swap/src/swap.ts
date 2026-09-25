import {
  afterRenderEffect,
  booleanAttribute,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdSwapEffect = 'fade' | 'rotate' | 'flip' | 'custom';

/** Native checkbox presentation, controlled toggle button, or manual visual state. */
@Directive({
  selector: 'label[zdSwap],button[zdSwap],div[zdSwap],span[zdSwap]',
  host: {
    '[class]': 'classes()',
    'data-zd-swap': '',
    '[attr.data-zd-swap-state]':
      'swapIndeterminate() ? "indeterminate" : swapActive() ? "on" : "off"',
    '[attr.data-zd-swap-effect]': 'swapEffect()',
    '[attr.aria-pressed]': 'isButton ? (swapIndeterminate() ? "mixed" : swapActive()) : null',
    '[attr.aria-disabled]': 'isButton && swapReadOnly() ? "true" : null',
    '(click)': 'activate()',
  },
})
export class ZdSwap {
  readonly swapActive = input(false, { transform: booleanAttribute });
  readonly swapIndeterminate = input(false, { transform: booleanAttribute });
  readonly swapEffect = input<ZdSwapEffect>('fade');
  readonly swapReadOnly = input(false, { transform: booleanAttribute });
  /** Toggle-button request only. The consumer accepts by updating swapActive. */
  readonly swapActiveChange = output<boolean>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly isButton = this.element.tagName === 'BUTTON';
  private readonly names = inject(ZdClassNames);
  protected readonly classes = computed(() =>
    [
      this.names.daisyUi('swap'),
      this.swapActive() && this.names.daisyUi('swap-active'),
      (this.swapEffect() === 'rotate' || this.swapEffect() === 'flip') &&
        this.names.daisyUi(`swap-${this.swapEffect()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
  private readonly guard = afterRenderEffect(onCleanup => {
    const preventReadOnly = (event: MouseEvent) => {
      if (this.swapReadOnly()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    this.element.addEventListener('click', preventReadOnly, true);
    onCleanup(() => this.element.removeEventListener('click', preventReadOnly, true));
  });
  protected activate(): void {
    if (this.isButton && !this.swapReadOnly() && !(this.element as HTMLButtonElement).disabled)
      this.swapActiveChange.emit(!this.swapActive());
  }
}

/** Keep checked, indeterminate, disabled, validation and Forms on the native input. */
@Directive({
  selector: 'input[type="checkbox"][zdSwapInput]',
  host: { '[attr.aria-readonly]': 'root.swapReadOnly() ? "true" : null' },
})
export class ZdSwapInput {
  protected readonly root = inject(ZdSwap);
}

/** Decorative states require a stable accessible name on the native control. */
@Directive({
  selector: '[zdSwapOn]',
  host: { '[class]': 'classes', 'data-zd-swap-part': 'on', 'aria-hidden': 'true', 'inert': '' },
})
export class ZdSwapOn {
  protected readonly classes = inject(ZdClassNames).daisyUi('swap-on');
}
@Directive({
  selector: '[zdSwapOff]',
  host: { '[class]': 'classes', 'data-zd-swap-part': 'off', 'aria-hidden': 'true', 'inert': '' },
})
export class ZdSwapOff {
  protected readonly classes = inject(ZdClassNames).daisyUi('swap-off');
}
@Directive({
  selector: '[zdSwapIndeterminate]',
  host: {
    '[class]': 'classes',
    'data-zd-swap-part': 'indeterminate',
    'aria-hidden': 'true',
    'inert': '',
  },
})
export class ZdSwapIndeterminate {
  protected readonly classes = inject(ZdClassNames).daisyUi('swap-indeterminate');
}
