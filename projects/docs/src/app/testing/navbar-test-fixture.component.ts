import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  ZdNavbar,
  ZdNavbarContent,
  ZdNavbarToggle,
  type ZdNavbarPosition,
} from '@pranxy/zordon-ui/navbar';

@Component({
  selector: 'docs-navbar-test-fixture',
  imports: [ZdNavbar, ZdNavbarContent, ZdNavbarToggle, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./navbar-daisy-fixture.css', './navbar-fixture.css'],
  template: `<main data-testid="navbar-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
    <h1>Navbar</h1>
    <p>Native destinations, responsive regions and an owner-controlled mobile panel.</p>
    <div class="controls">
      <label
        >Position<select (change)="setPosition($event)">
          <option>static</option>
          <option>sticky</option>
          <option>fixed</option>
        </select></label
      >
      <button type="button" (click)="transparent.set(!transparent())">Toggle transparency</button>
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <button type="button" (click)="accept.set(!accept())">Toggle acceptance</button>
      <button type="button" (click)="disabled.set(!disabled())">Toggle disabled</button>
    </div>
    <div class="scroll-container" data-testid="navbar-scroll">
      <zd-navbar label="Workspace navigation" [position]="position()" [transparent]="transparent()">
        <zd-navbar-content zdNavbarStart
          ><a class="brand" href="#workspace">Zordon</a>
          <zd-navbar-content visibility="mobile">
            <button
              #toggle
              zdNavbarToggle
              controls="navbar-mobile-panel"
              [expanded]="open()"
              [disabled]="disabled()"
              (expandedChange)="request($event)"
            >
              Menu
            </button>
          </zd-navbar-content>
        </zd-navbar-content>
        <zd-navbar-content zdNavbarCenter visibility="desktop">
          <a
            [routerLink]="[]"
            [queryParams]="{}"
            routerLinkActive="current"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            >Overview</a
          >
          <a
            [routerLink]="[]"
            [queryParams]="{ section: 'projects' }"
            routerLinkActive="current"
            ariaCurrentWhenActive="page"
            >Projects</a
          >
        </zd-navbar-content>
        <zd-navbar-content zdNavbarEnd><a href="#account">Account</a></zd-navbar-content>
      </zd-navbar>
      <zd-navbar-content visibility="mobile">
        <nav
          id="navbar-mobile-panel"
          tabindex="-1"
          aria-label="Mobile destinations"
          [hidden]="!open()"
          (keydown.escape)="close(toggle)"
        >
          <a
            [routerLink]="[]"
            [queryParams]="{}"
            routerLinkActive="current"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            (click)="close(toggle)"
            >Overview</a
          >
          <a
            [routerLink]="[]"
            [queryParams]="{ section: 'projects' }"
            routerLinkActive="current"
            ariaCurrentWhenActive="page"
            (click)="close(toggle)"
            >Projects</a
          >
        </nav>
      </zd-navbar-content>
      <div class="page-content">
        <h2 id="workspace">Workspace</h2>
        <p>The brand and account links remain available on every screen size.</p>
        <p id="account">Account settings</p>
        <div class="scroll-space" aria-hidden="true"></div>
      </div>
    </div>
    <output aria-label="Toggle requests">{{ requests() }}</output>
    <p>The panel starts expanded so mobile destinations are usable before hydration.</p>
  </main>`,
})
export class NavbarTestFixtureComponent {
  readonly position = signal<ZdNavbarPosition>('static');
  readonly transparent = signal(false);
  readonly rtl = signal(false);
  readonly open = signal(true);
  readonly accept = signal(true);
  readonly disabled = signal(false);
  readonly requests = signal(0);
  setPosition(event: Event): void {
    this.position.set((event.target as HTMLSelectElement).value as ZdNavbarPosition);
  }
  request(value: boolean): void {
    this.requests.update(value => value + 1);
    if (this.accept()) this.open.set(value);
  }
  close(toggle: HTMLButtonElement): void {
    this.open.set(false);
    toggle.focus();
  }
}
