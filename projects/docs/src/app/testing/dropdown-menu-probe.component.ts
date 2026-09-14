import { Menu, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { Dir } from '@angular/cdk/bidi';
import { CdkConnectedOverlay, type ConnectedPosition } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  afterRenderEffect,
  untracked,
  signal,
  viewChild,
} from '@angular/core';

/** Test-only Angular 21 Menu/Overlay integration. Not a public Dropdown implementation. */
@Component({
  selector: 'docs-dropdown-menu-probe',
  imports: [Menu, MenuItem, MenuTrigger, Dir, CdkConnectedOverlay],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main data-testid="dropdown-probe">
      <h1>Dropdown integration</h1>
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <button type="button" (click)="present.set(!present())">Toggle presence</button>
      <button type="button" (click)="disabled.set(!disabled())">Toggle disabled</button>
      <output aria-label="Selected action">{{ selected() }}</output>
      @if (present()) {
        <section [dir]="rtl() ? 'rtl' : 'ltr'" data-theme="light" aria-label="Actions">
          <button
            type="button"
            ngMenuTrigger
            #origin
            #trigger="ngMenuTrigger"
            [menu]="rootMenu()"
            [disabled]="disabled()"
            [attr.disabled]="disabled() ? '' : null"
            id="dropdown-probe-trigger"
            [attr.aria-controls]="trigger.expanded() ? 'dropdown-probe-menu' : null"
          >
            Open actions
          </button>
          <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOrigin]="origin"
            [cdkConnectedOverlayOpen]="trigger.expanded()"
            [cdkConnectedOverlayPositions]="positions"
            [cdkConnectedOverlayPush]="true"
            [cdkConnectedOverlayViewportMargin]="8"
            (overlayOutsideClick)="outside($event)"
          >
            <div
              ngMenu
              #rootMenu="ngMenu"
              id="dropdown-probe-menu"
              aria-label="Actions"
              [attr.id]="'dropdown-probe-menu'"
              (itemSelected)="selected.set($event)"
              class="probe-menu"
            >
              <button type="button" ngMenuItem value="edit">Edit</button>
              <button type="button" ngMenuItem value="delete" [disabled]="true">Delete</button>
              <button
                type="button"
                ngMenuItem
                value="more"
                [submenu]="childMenu()"
                #more
                #moreItem="ngMenuItem"
              >
                More
              </button>
              <ng-template
                cdkConnectedOverlay
                [cdkConnectedOverlayOrigin]="more"
                [cdkConnectedOverlayOpen]="trigger.expanded()"
                [cdkConnectedOverlayPositions]="subPositions"
                [cdkConnectedOverlayPush]="true"
                [cdkConnectedOverlayViewportMargin]="8"
              >
                <div
                  ngMenu
                  #childMenu="ngMenu"
                  id="dropdown-probe-child"
                  aria-label="More actions"
                  [attr.id]="'dropdown-probe-child'"
                  [hidden]="!childMenu.visible()"
                  class="probe-menu"
                >
                  <button type="button" ngMenuItem value="archive">Archive</button>
                  <button type="button" ngMenuItem value="duplicate">Duplicate</button>
                </div>
              </ng-template>
            </div>
          </ng-template>
        </section>
      }
      <button type="button">After actions</button>
    </main>
  `,
  styles: `
    main {
      padding: 2rem;
      font-family: sans-serif;
    }
    section {
      margin-block: 2rem;
    }
    button {
      padding: 0.65rem 1rem;
    }
    .probe-menu {
      display: flex;
      flex-direction: column;
      min-width: 12rem;
      background: white;
      color: #111;
      border: 1px solid #777;
      border-radius: 0.5rem;
      padding: 0.3rem;
    }
    .probe-menu[hidden] {
      display: none;
    }
    .probe-menu button {
      text-align: start;
    }
    [aria-disabled='true'] {
      opacity: 0.55;
    }
    button:focus-visible {
      outline: 3px solid #165dcc;
      outline-offset: -3px;
    }
  `,
})
export class DropdownMenuProbeComponent {
  private readonly trigger = viewChild<MenuTrigger<string>>('trigger');
  private readonly focusAttachedMenu = afterRenderEffect(() => {
    const menu = this.rootMenu();
    untracked(() => {
      if (menu && this.trigger()?.expanded()) this.trigger()?.open();
    });
  });
  private readonly portaledBoundaries = afterRenderEffect(onCleanup => {
    const root = this.rootMenu();
    const child = this.childMenu();
    if (!root || !child) return;
    // CDK 21.2 portals are DOM siblings. Aria's focusout boundary expects descendants.
    const keepParent = (event: FocusEvent) => {
      if (child.element.contains(event.relatedTarget as Node | null))
        event.stopImmediatePropagation();
    };
    const escapeChild = (event: KeyboardEvent) => {
      if (
        event.key !== 'Escape' ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const parent = child.parent();
      parent?.close();
      parent?.element.focus();
    };
    root.element.addEventListener('focusout', keepParent, true);
    child.element.addEventListener('keydown', escapeChild, true);
    onCleanup(() => {
      root.element.removeEventListener('focusout', keepParent, true);
      child.element.removeEventListener('keydown', escapeChild, true);
    });
  });
  protected outside(event: MouseEvent): void {
    if (!this.childMenu()?.element.contains(event.target as Node | null)) this.trigger()?.close();
  }
  protected readonly rootMenu = viewChild<Menu<string>>('rootMenu');
  protected readonly childMenu = viewChild<Menu<string>>('childMenu');
  protected readonly rtl = signal(false);
  protected readonly present = signal(true);
  protected readonly disabled = signal(false);
  protected readonly selected = signal('none');
  protected readonly positions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
  ];
  protected readonly subPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top' },
  ];
}
