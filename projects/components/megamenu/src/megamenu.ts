import { MenuBar } from '@angular/aria/menu';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { ZdClassNames } from '@pranxy/zordon-ui';
import { ZdDropdown, type ZdDropdownCloseReason } from '@pranxy/zordon-ui/dropdown';

/** A wide navigation disclosure composed with the shared Dropdown runtime. */
@Directive({
  selector: '[zdMegamenu]',
  exportAs: 'zdMegamenu',
  hostDirectives: [
    {
      directive: ZdDropdown,
      inputs: [
        'open',
        'disabled',
        'mode',
        'trigger',
        'side',
        'align',
        'gap',
        'autoFlip',
        'closeOnSelection',
        'closeOnEscape',
        'closeOnOutside',
        'closeOnFocus',
        'restoreFocus',
        'initialFocus',
        'hoverDelay',
        'panelClass',
      ],
      outputs: ['openChange', 'closed', 'selected'],
    },
  ],
})
export class ZdMegamenu {
  readonly closeOnNavigation = input(true, { transform: booleanAttribute });
  private readonly dropdown = inject(ZdDropdown);
  readonly expanded = this.dropdown.expanded;
  private readonly navigation = inject(Router, { optional: true })
    ?.events.pipe(takeUntilDestroyed())
    .subscribe(event => {
      if (event instanceof NavigationEnd && this.closeOnNavigation()) this.close('navigation');
    });
  show(): void {
    this.dropdown.show();
  }
  close(reason: ZdDropdownCloseReason = 'programmatic'): void {
    this.dropdown.close(reason);
  }
}

/** Layout surface for native links, forms, or separately named command menus. */
@Component({
  selector: 'zd-megamenu-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-width]': 'width()', '[style.--zd-megamenu-columns]': 'columns()' },
  template: '<ng-content />',
  styles: `
    :host {
      box-sizing: border-box;
      display: grid;
      grid-template-columns: repeat(var(--zd-megamenu-columns), minmax(0, 1fr));
      gap: 1.5rem;
      inline-size: min(48rem, calc(100vw - 32px));
      max-block-size: calc(100dvh - 32px);
      overflow: auto;
      padding: 1.5rem;
      border: 1px solid var(--color-base-300, CanvasText);
      border-radius: var(--radius-box, 0.5rem);
      color: var(--color-base-content, CanvasText);
      background: var(--color-base-100, Canvas);
      box-shadow: 0 8px 24px #0002;
    }
    :host[data-width='full'] {
      inline-size: calc(100vw - 32px);
    }
    @media (width < 48rem) {
      :host {
        grid-template-columns: minmax(0, 1fr);
        gap: 1rem;
        padding: 1rem;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
        transition: none;
        scroll-behavior: auto;
      }
    }
    @media (forced-colors: active) {
      :host {
        border-color: CanvasText;
        box-shadow: none;
      }
    }
  `,
})
export class ZdMegamenuPanel {
  readonly width = input<'anchored' | 'full'>('anchored');
  readonly columns = input<1 | 2 | 3 | 4>(3);
}

/** Opt-in application command bar. Site navigation must retain native nav/link semantics. */
@Component({
  selector: 'zd-megamenu-bar',
  hostDirectives: [
    {
      directive: MenuBar,
      inputs: ['wrap', 'typeaheadDelay', 'disabled'],
      outputs: ['itemSelected'],
    },
  ],
  host: { '[class]': 'classes' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }
  `,
})
export class ZdMegamenuBar {
  protected readonly classes = inject(ZdClassNames).daisyUi('megamenu');
}
