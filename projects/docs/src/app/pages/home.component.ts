import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'docs-home',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section aria-labelledby="page-title">
      <p class="eyebrow">Angular + daisyUI</p>
      <h1 id="page-title">Zordon UI</h1>
      <p class="summary">
        A customizable Angular component library that keeps daisyUI's styling system in your hands.
      </p>
      <a class="action" routerLink="/docs/getting-started">Get started</a>
    </section>
  `,
  styles: `
    section {
      display: grid;
      gap: 1.5rem;
      max-inline-size: 48rem;
    }

    p,
    h1 {
      margin: 0;
    }

    .eyebrow {
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      font-size: clamp(3rem, 10vw, 6rem);
      line-height: 0.95;
    }

    .summary {
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      line-height: 1.5;
    }

    .action {
      inline-size: fit-content;
      padding: 0.75rem 1rem;
      border: 2px solid currentColor;
      border-radius: 0.5rem;
      font-weight: 700;
      text-decoration: none;
    }
  `,
})
export class DocsHomeComponent {}
