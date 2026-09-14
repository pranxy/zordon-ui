import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import {
  ZdDropdown,
  ZdDropdownTrigger,
  ZdDropdownPanel,
  ZdDropdownMenu,
  ZdDropdownItem,
} from '@pranxy/zordon-ui/dropdown';

@Component({
  selector: 'docs-dropdown-test-fixture',
  imports: [Dir, ZdDropdown, ZdDropdownTrigger, ZdDropdownPanel, ZdDropdownMenu, ZdDropdownItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-label="Dropdown examples" class="examples" [dir]="rtl() ? 'rtl' : 'ltr'">
      <h1>Dropdown</h1>
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <button type="button" (click)="disabled.set(!disabled())">Toggle disabled</button>
      <button type="button" (click)="present.set(!present())">Toggle presence</button>
      <output aria-label="Last action">{{ selected() }}</output>
      @if (present()) {
        <div
          zdDropdown
          mode="menu"
          [disabled]="disabled()"
          (selected)="selected.set($event)"
          data-testid="dropdown-menu-root"
        >
          <button zdDropdownTrigger>Actions</button>
          <ng-template zdDropdownPanel>
            <zd-dropdown-menu aria-label="Actions">
              <button type="button" zdDropdownItem value="edit">Edit</button>
              <button type="button" zdDropdownItem value="delete" [disabled]="true">Delete</button>
              <div zdDropdown mode="menu" side="end">
                <button zdDropdownTrigger zdDropdownItem value="more">More</button>
                <ng-template zdDropdownPanel>
                  <zd-dropdown-menu aria-label="More actions">
                    <button type="button" zdDropdownItem value="archive">Archive</button>
                    <div zdDropdown mode="menu" side="end">
                      <button zdDropdownTrigger zdDropdownItem value="export">Export</button>
                      <ng-template zdDropdownPanel>
                        <zd-dropdown-menu aria-label="Export options">
                          <button type="button" zdDropdownItem value="pdf">PDF</button>
                          <button type="button" zdDropdownItem value="csv">CSV</button>
                        </zd-dropdown-menu>
                      </ng-template>
                    </div>
                  </zd-dropdown-menu>
                </ng-template>
              </div>
            </zd-dropdown-menu>
          </ng-template>
        </div>
      }
      <button type="button">After menu</button>
      <div
        zdDropdown
        #content="zdDropdown"
        trigger="manual"
        [open]="contentOpen()"
        (openChange)="contentOpen.set($event)"
        initialFocus="first"
      >
        <button zdDropdownTrigger>Preferences</button>
        <button type="button" (click)="contentOpen.set(!contentOpen())">
          Toggle preferences externally
        </button>
        <ng-template zdDropdownPanel>
          <form
            class="content-panel"
            aria-label="Preferences"
            (submit)="$event.preventDefault(); content.close('selection')"
          >
            <label>Display name <input name="displayName" /></label>
            <button type="submit">Save</button>
          </form>
        </ng-template>
      </div>
      <div zdDropdown trigger="hover" [hoverDelay]="50">
        <button zdDropdownTrigger>Help</button>
        <ng-template zdDropdownPanel
          ><div class="content-panel">Keyboard and pointer help</div></ng-template
        >
      </div>
      <div zdDropdown trigger="focus">
        <button zdDropdownTrigger>Focus details</button>
        <ng-template zdDropdownPanel
          ><div class="content-panel"><a href="#details">Read details</a></div></ng-template
        >
      </div>
      <div
        zdDropdown
        mode="menu"
        [open]="true"
        [closeOnEscape]="false"
        [closeOnOutside]="false"
        [disabled]="!locked()"
      >
        <button zdDropdownTrigger>Locked menu</button>
        <ng-template zdDropdownPanel
          ><zd-dropdown-menu aria-label="Locked"
            ><button type="button" zdDropdownItem value="locked">
              Locked action
            </button></zd-dropdown-menu
          ></ng-template
        >
      </div>
      <button type="button" (click)="locked.set(!locked())">Toggle locked menu</button>
    </section>
  `,
  styles: `
    .examples {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: start;
      gap: 1rem;
    }
    .content-panel {
      padding: 1rem;
      background: var(--color-base-100);
      color: var(--color-base-content);
      border: 1px solid var(--color-base-300);
      border-radius: 0.5rem;
    }
  `,
})
export class DropdownTestFixtureComponent {
  protected readonly rtl = signal(false);
  protected readonly disabled = signal(false);
  protected readonly present = signal(true);
  protected readonly selected = signal<unknown>('none');
  protected readonly contentOpen = signal(false);
  protected readonly locked = signal(false);
}
