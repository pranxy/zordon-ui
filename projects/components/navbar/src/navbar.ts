import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  inject,
  input,
  output,
} from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdNavbarPosition = 'static' | 'sticky' | 'fixed';
export type ZdNavbarVisibility = 'always' | 'desktop' | 'mobile';

/** Named native navigation with projected start, center and end regions. */
@Component({
  selector: 'zd-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-position]': 'position()',
    '[attr.data-transparent]': 'transparent()',
  },
  template: `
    <nav [class]="navbarClass" [attr.aria-label]="label()">
      <div class="zd-start" [class]="startClass"><ng-content select="[zdNavbarStart]" /></div>
      <div class="zd-center" [class]="centerClass">
        <ng-content select="[zdNavbarCenter]" /><ng-content />
      </div>
      <div class="zd-end" [class]="endClass"><ng-content select="[zdNavbarEnd]" /></div>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      min-inline-size: 0;
    }
    :host[data-position='sticky'],
    :host[data-position='fixed'] {
      inset-block-start: var(--zd-navbar-top, 0px);
      z-index: var(--zd-navbar-z-index, 20);
    }
    :host[data-position='sticky'] {
      position: sticky;
    }
    :host[data-position='fixed'] {
      position: fixed;
      inset-inline: 0;
    }
    nav {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      inline-size: 100%;
      min-block-size: 4rem;
      gap: 0.5rem;
      padding: calc(0.5rem + env(safe-area-inset-top, 0px))
        max(1rem, env(safe-area-inset-right, 0px)) 0.5rem max(1rem, env(safe-area-inset-left, 0px));
      color: var(--color-base-content, CanvasText);
      background: var(--color-base-100, Canvas);
    }
    :host[data-transparent='true'] nav {
      background: transparent;
    }
    .zd-start,
    .zd-center,
    .zd-end {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      min-inline-size: 0;
      max-inline-size: 100%;
      inline-size: auto;
      overflow-wrap: anywhere;
    }
    .zd-start,
    .zd-end {
      flex: 1 1 0%;
    }
    .zd-center {
      flex: 0 1 auto;
      justify-content: center;
    }
    .zd-end {
      justify-content: flex-end;
    }
    @media (forced-colors: active) {
      nav {
        border-block-end: 1px solid CanvasText;
      }
    }
  `,
})
export class ZdNavbar {
  readonly label = input('Primary navigation');
  readonly position = input<ZdNavbarPosition>('static');
  readonly transparent = input(false, { transform: booleanAttribute });
  private readonly names = inject(ZdClassNames);
  protected readonly navbarClass = this.names.daisyUi('navbar');
  protected readonly startClass = this.names.daisyUi('navbar-start');
  protected readonly centerClass = this.names.daisyUi('navbar-center');
  protected readonly endClass = this.names.daisyUi('navbar-end');
}

/** CSS-only responsive content; hidden content leaves the focus and accessibility trees. */
@Component({
  selector: 'zd-navbar-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-visibility]': 'visibility()' },
  template: '<ng-content />',
  styles: `
    :host {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      min-inline-size: 0;
      max-inline-size: 100%;
      overflow-wrap: anywhere;
    }
    @media (width < 48rem) {
      :host[data-visibility='desktop'] {
        display: none;
      }
    }
    @media (width >= 48rem) {
      :host[data-visibility='mobile'] {
        display: none;
      }
    }
  `,
})
export class ZdNavbarContent {
  readonly visibility = input<ZdNavbarVisibility>('always');
}

/** Requests a state change; the owner controls the panel, focus and accepted state. */
@Directive({
  selector: 'button[zdNavbarToggle]',
  host: {
    'type': 'button',
    '[disabled]': 'disabled()',
    '[attr.aria-expanded]': 'expanded()',
    '[attr.aria-controls]': 'controls()',
    '(click)': 'requestToggle()',
  },
})
export class ZdNavbarToggle {
  readonly controls = input.required<string>();
  readonly expanded = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly expandedChange = output<boolean>();
  protected requestToggle(): void {
    if (!this.disabled()) this.expandedChange.emit(!this.expanded());
  }
}
