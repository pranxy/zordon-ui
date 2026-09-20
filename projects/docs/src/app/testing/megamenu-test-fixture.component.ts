import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ZdMegamenu, ZdMegamenuPanel, ZdMegamenuBar } from '@pranxy/zordon-ui/megamenu';
import {
  ZdDropdownTrigger,
  ZdDropdownPanel,
  ZdDropdownMenu,
  ZdDropdownItem,
} from '@pranxy/zordon-ui/dropdown';

@Component({
  selector: 'docs-megamenu-test-fixture',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Dir,
    RouterLink,
    RouterLinkActive,
    ZdMegamenu,
    ZdMegamenuPanel,
    ZdMegamenuBar,
    ZdDropdownTrigger,
    ZdDropdownPanel,
    ZdDropdownMenu,
    ZdDropdownItem,
  ],
  styleUrls: ['./megamenu-fixture.css'],
  template: `<main data-testid="megamenu-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
    <h1>Megamenu</h1>
    <p>Explore destinations, resources and application commands.</p>
    <div class="controls">
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <button type="button" (click)="full.set(!full())">Toggle full width</button>
      <button type="button" (click)="present.set(!present())">Toggle presence</button>
      <label
        >Opening policy<select (change)="setPolicy($event)">
          <option>click</option>
          <option>hover</option>
          <option>focus</option>
          <option>manual</option>
        </select></label
      >
    </div>
    <nav aria-label="Site navigation">
      <a
        routerLink="."
        routerLinkActive="current"
        ariaCurrentWhenActive="page"
        [routerLinkActiveOptions]="{ exact: true }"
        >Overview</a
      >
      @if (present()) {
        <div
          zdMegamenu
          #explore="zdMegamenu"
          [trigger]="policy()"
          [hoverDelay]="60"
          initialFocus="first"
          (closed)="closed.set($event)"
        >
          <button zdDropdownTrigger>Explore</button>
          <ng-template zdDropdownPanel>
            <zd-megamenu-panel
              [width]="full() ? 'full' : 'anchored'"
              role="region"
              aria-label="Explore destinations"
            >
              <section>
                <h2>Build</h2>
                <a
                  routerLink="."
                  [queryParams]="{ section: 'components' }"
                  routerLinkActive="current"
                  ariaCurrentWhenActive="page"
                  >Components</a
                ><a
                  routerLink="."
                  [queryParams]="{ section: 'patterns' }"
                  routerLinkActive="current"
                  ariaCurrentWhenActive="page"
                  >Patterns</a
                ><span aria-disabled="true" role="link">Upcoming tools</span>
              </section>
              <section>
                <h2>Learn</h2>
                <a href="#guides" (click)="explore.close('selection')">Guides</a
                ><a href="#examples" (click)="explore.close('selection')">Examples</a>
              </section>
              <section>
                <h2>Find a resource</h2>
                <label>Search resources<input type="search" /></label>
                <p>Native controls keep their familiar keyboard behavior.</p>
                <button type="button" (click)="explore.close('selection')">Apply search</button>
              </section>
            </zd-megamenu-panel>
          </ng-template>
          <button type="button" (click)="explore.show()">Open externally</button>
        </div>
      }
    </nav>
    <h2>Application commands</h2>
    <zd-megamenu-bar aria-label="Editor commands">
      <div zdMegamenu mode="menu" (selected)="action.set($event)">
        <button zdDropdownTrigger zdDropdownItem value="file">File</button>
        <ng-template zdDropdownPanel
          ><zd-dropdown-menu aria-label="File actions"
            ><button zdDropdownItem value="new">New document</button
            ><button zdDropdownItem value="export">Export</button></zd-dropdown-menu
          ></ng-template
        >
      </div>
      <div zdMegamenu mode="menu" (selected)="action.set($event)">
        <button zdDropdownTrigger zdDropdownItem value="edit">Edit</button>
        <ng-template zdDropdownPanel
          ><zd-dropdown-menu aria-label="Edit actions"
            ><button zdDropdownItem value="copy">Copy</button
            ><button zdDropdownItem value="paste" [disabled]="true">Paste</button></zd-dropdown-menu
          ></ng-template
        >
      </div>
    </zd-megamenu-bar>
    <button type="button">After navigation</button>
    <p>
      Last close: <output aria-label="Last close">{{ closed() }}</output>
    </p>
    <p>
      Last action: <output aria-label="Last action">{{ action() }}</output>
    </p>
    <p id="guides">Guides and learning resources remain available through ordinary links.</p>
  </main>`,
})
export class MegamenuTestFixtureComponent {
  readonly rtl = signal(false);
  readonly full = signal(false);
  readonly present = signal(true);
  readonly policy = signal<'click' | 'hover' | 'focus' | 'manual'>('click');
  readonly closed = signal('none');
  readonly action = signal<unknown>('none');
  setPolicy(event: Event): void {
    this.policy.set(
      (event.target as HTMLSelectElement).value as 'click' | 'hover' | 'focus' | 'manual',
    );
  }
}
