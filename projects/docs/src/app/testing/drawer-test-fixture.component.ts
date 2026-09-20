import { Component, ChangeDetectionStrategy, afterNextRender, inject, signal } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  ZdDrawer,
  ZdDrawerPanel,
  type ZdDrawerReason,
  type ZdDrawerMode,
} from '@pranxy/zordon-ui/drawer';
import { ZdNavbar, ZdNavbarToggle } from '@pranxy/zordon-ui/navbar';

@Component({
  selector: 'docs-drawer-test-fixture',
  imports: [Dir, ZdDrawer, ZdDrawerPanel, ZdNavbar, ZdNavbarToggle, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      width: min(60rem, calc(100vw - 2rem));
      margin: 2rem auto;
    }
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.25rem;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-block: 1rem;
    }
    .content {
      padding: 1rem;
      min-height: 20rem;
      border: 1px solid var(--color-base-300, GrayText);
    }
    button,
    a,
    input,
    select {
      padding: 0.4rem;
    }
    nav {
      display: grid;
      gap: 0.5rem;
    }
    label {
      display: block;
    }
    input {
      max-width: 100%;
      border: 1px solid currentColor;
    }
  `,
  template: `
    <article data-testid="drawer-fixture" [dir]="direction()">
      <h1>Drawer</h1>
      <p>Controlled navigation with responsive layouts and shared modal focus.</p>
      <div class="controls">
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
        <button type="button" (click)="side.set(side() === 'start' ? 'end' : 'start')">
          Toggle side
        </button>
        <label
          >Mode
          <select [value]="mode()" [disabled]="!ready()" (change)="setMode($event)">
            <option [attr.selected]="mode() === 'modal' ? '' : null">modal</option>
            <option [attr.selected]="mode() === 'persistent' ? '' : null">persistent</option>
            <option [attr.selected]="mode() === 'push' ? '' : null">push</option>
            <option [attr.selected]="mode() === 'responsive' ? '' : null">responsive</option>
          </select></label
        >
        <label
          ><input type="checkbox" [checked]="accept()" (change)="accept.set(!accept())" /> Accept
          requests</label
        >
      </div>
      <zd-navbar label="Application navigation"
        ><button
          zdNavbarToggle
          [controls]="drawer.panelId"
          [expanded]="open()"
          (expandedChange)="open.set($event)"
        >
          Navigation drawer
        </button></zd-navbar
      >
      <zd-drawer
        #drawer
        label="Project navigation"
        [open]="open()"
        (openChange)="change($event)"
        (closeRequest)="last.set($event)"
        [mode]="mode()"
        [side]="side()"
        [width]="300"
        closeOnNavigation
        swipe
      >
        <ng-template zdDrawerPanel let-close>
          <h2>Project navigation</h2>
          <nav aria-label="Project sections">
            <a routerLink="." [queryParams]="{ section: 'overview' }">Overview destination</a
            ><a routerLink="." [queryParams]="{ section: 'settings' }">Settings destination</a>
          </nav>
          <label>Search navigation <input /></label>
          <button type="button" (click)="nested.set(true)">Open nested drawer</button>
          <button type="button" (click)="close()">Close navigation</button>
          <zd-drawer
            label="Nested tools"
            [open]="nested()"
            (openChange)="nested.set($event)"
            side="end"
            [width]="240"
          >
            <ng-template zdDrawerPanel let-close
              ><h2>Nested tools</h2>
              <button type="button" (click)="close()">Close nested tools</button></ng-template
            >
          </zd-drawer>
        </ng-template>
        <div class="content">
          <h2>Project workspace</h2>
          <p>The main content remains in normal document flow.</p>
          <button type="button">Workspace action</button>
          <p role="status">Last request: {{ last() }}</p>
        </div>
      </zd-drawer>
      <h2>Server-rendered persistent panel</h2>
      <zd-drawer label="Help navigation" mode="persistent" open [width]="220"
        ><ng-template zdDrawerPanel
          ><nav aria-label="Help links"><a href="#help">Help articles</a></nav></ng-template
        >
        <div class="content" id="help">Help content</div></zd-drawer
      >
    </article>
  `,
})
export class DrawerTestFixtureComponent {
  readonly ready = signal(false);
  constructor() {
    afterNextRender(() => this.ready.set(true));
  }
  private readonly initialResponsive =
    inject(ActivatedRoute).snapshot.queryParamMap.has('initialResponsive');
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly side = signal<'start' | 'end'>('start');
  readonly open = signal(this.initialResponsive);
  readonly nested = signal(false);
  readonly accept = signal(true);
  readonly mode = signal<ZdDrawerMode>(this.initialResponsive ? 'responsive' : 'modal');
  readonly last = signal<ZdDrawerReason | 'none'>('none');
  change(open: boolean): void {
    if (this.accept()) {
      this.open.set(open);
      if (!open) this.nested.set(false);
    }
  }
  setMode(event: Event): void {
    this.mode.set((event.target as HTMLSelectElement).value as ZdDrawerMode);
  }
}
