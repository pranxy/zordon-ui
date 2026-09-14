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
    '[attr.data-zd-swap-state]': 'indeterminate() ? "indeterminate" : active() ? "on" : "off"',
    '[attr.data-zd-swap-effect]': 'effect()',
    '[attr.aria-pressed]': 'isButton ? (indeterminate() ? "mixed" : active()) : null',
    '[attr.aria-disabled]': 'isButton && readOnly() ? "true" : null',
    '(click)': 'activate()',
  },
})
export class ZdSwap {
  readonly active = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly effect = input<ZdSwapEffect>('fade');
  readonly readOnly = input(false, { transform: booleanAttribute });
  /** Toggle-button request only. The consumer accepts by updating active. */
  readonly activeChange = output<boolean>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  protected readonly isButton = this.element.tagName === 'BUTTON';
  private readonly names = inject(ZdClassNames);
  protected readonly classes = computed(() =>
    [
      this.names.daisyUi('swap'),
      this.active() && this.names.daisyUi('swap-active'),
      (this.effect() === 'rotate' || this.effect() === 'flip') &&
        this.names.daisyUi(`swap-${this.effect()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
  private readonly guard = afterRenderEffect(onCleanup => {
    const preventReadOnly = (event: MouseEvent) => {
      if (this.readOnly()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    this.element.addEventListener('click', preventReadOnly, true);
    onCleanup(() => this.element.removeEventListener('click', preventReadOnly, true));
  });
  protected activate(): void {
    if (this.isButton && !this.readOnly() && !(this.element as HTMLButtonElement).disabled)
      this.activeChange.emit(!this.active());
  }
}

/** Keep checked, indeterminate, disabled, validation and Forms on the native input. */
@Directive({
  selector: 'input[type="checkbox"][zdSwapInput]',
  host: { '[attr.aria-readonly]': 'root.readOnly() ? "true" : null' },
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
