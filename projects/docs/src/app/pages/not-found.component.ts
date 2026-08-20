import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="page-title">
      <p class="eyebrow">404</p>
      <h1 id="page-title">Page not found</h1>
      <p>The address does not point to a Zordon UI documentation page.</p>
      <a routerLink="/">Return home</a>
    </section>
  `,
  styles: `
    section {
      max-inline-size: 42rem;
    }

    .eyebrow {
      font-weight: 700;
    }
  `,
})
export class NotFoundComponent {}
