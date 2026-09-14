import { Menu, MenuItem } from '@angular/aria/menu';
import {
  Component,
  ChangeDetectionStrategy,
  Directive,
  inject,
  DestroyRef,
  afterEveryRender,
  afterRenderEffect,
  ElementRef,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';
import { ZdDropdown } from './dropdown';

@Component({
  selector: 'zd-dropdown-menu',
  hostDirectives: [{ directive: Menu, inputs: ['id', 'wrap', 'typeaheadDelay'] }],
  host: { '[class]': 'classes' },
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: `
    zd-dropdown-menu {
      display: flex;
      flex-direction: column;
      min-inline-size: 10rem;
      max-inline-size: min(24rem, calc(100vw - 16px));
      max-block-size: calc(100vh - 16px);
      overflow: auto;
      padding: 0.375rem;
      border: 1px solid var(--color-base-300);
      border-radius: var(--radius-box, 0.5rem);
      background: var(--color-base-100);
      color: var(--color-base-content);
      box-shadow: 0 4px 16px #0002;
    }
    zd-dropdown-menu [zdDropdownItem] {
      inline-size: 100%;
      justify-content: start;
      text-align: start;
      white-space: normal;
    }
    zd-dropdown-menu [zdDropdownItem]:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }
    @media (prefers-reduced-motion: reduce) {
      zd-dropdown-menu [zdDropdownItem] {
        transition: none;
        animation: none;
        transform: none;
        scale: 1;
      }
    }
    @media (forced-colors: active) {
      zd-dropdown-menu {
        border-color: CanvasText;
      }
      zd-dropdown-menu [zdDropdownItem]:focus-visible {
        outline: 2px solid Highlight;
        outline-offset: -2px;
      }
    }
  `,
})
export class ZdDropdownMenu {
  protected readonly classes = inject(ZdClassNames).daisyUi('menu');
  private readonly root = inject(ZdDropdown);
  private readonly menu = inject<Menu<unknown>>(Menu);
  private readonly subscription = this.menu.itemSelected.subscribe(value =>
    this.root.choose(value),
  );
  private readonly cleanup = inject(DestroyRef).onDestroy(() => this.subscription.unsubscribe());
}

@Directive({
  selector: 'button[zdDropdownItem],a[zdDropdownItem]',
  hostDirectives: [{ directive: MenuItem, inputs: ['value', 'disabled'] }],
  host: { '[class]': 'classes', 'style': 'text-align: start; white-space: normal;' },
})
export class ZdDropdownItem {
  readonly searchTerm = input<string>();
  protected readonly classes =
    inject(ZdClassNames).daisyUi('btn') + ' ' + inject(ZdClassNames).daisyUi('btn-ghost');
  private readonly item = inject<MenuItem<unknown>>(MenuItem);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly label = afterEveryRender(() =>
    this.item.searchTerm.set(this.searchTerm() ?? this.element.textContent!.trim()),
  );
  private readonly disabledClick = afterRenderEffect(onCleanup => {
    const click = (event: MouseEvent) => {
      if (this.item.disabled()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    this.element.addEventListener('click', click, true);
    onCleanup(() => this.element.removeEventListener('click', click, true));
  });
}
