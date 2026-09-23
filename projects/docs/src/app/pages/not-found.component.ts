import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';

import { DocsPageHeaderComponent } from '../ui';

@Component({
  selector: 'docs-not-found',
  imports: [DocsPageHeaderComponent, RouterLink, ZdButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="404"
        heading="Page not found"
        description="The address does not point to a Zordon UI documentation page."
      >
        <div class="docs-cluster">
          <a zdButton color="primary" href="/" routerLink="/">Return home</a>
          <a zdButton variant="outline" href="/components" routerLink="/components"
            >Browse components</a
          >
        </div>
      </docs-page-header>
    </article>
  `,
})
export class NotFoundComponent {}
