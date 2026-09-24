import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

import { MenuTestFixtureComponent } from './menu-test-fixture.component';

/**
 * Docs-only route for the Menu fixture. It adds daisyUI's generic menu rule, which the docs site
 * no longer compiles globally, without adding it to the fixture the SSR example shares.
 */
@Component({
  selector: 'docs-menu-docs-fixture',
  imports: [MenuTestFixtureComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: '<docs-menu-test-fixture />',
  styleUrl: './menu-base-fixture.css',
  styles: `
    docs-menu-docs-fixture {
      display: contents;
    }
  `,
})
export class MenuDocsFixtureComponent {}
