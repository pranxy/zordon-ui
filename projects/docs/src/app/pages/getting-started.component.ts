import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'docs-getting-started',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article aria-labelledby="page-title">
      <p class="eyebrow">Documentation</p>
      <h1 id="page-title">Get started with Zordon UI</h1>
      <p>
        Zordon UI is built for Angular applications configured with Tailwind CSS 4 and daisyUI 5.
        This documentation site will guide you through installation, configuration, and component
        usage.
      </p>
      <h2>What comes next</h2>
      <p>
        Install the package, configure your daisyUI classes, then choose a component from the
        catalogue. The detailed installation guide lands with the first public component reference.
      </p>
    </article>
  `,
  styles: `
    article {
      max-inline-size: 46rem;
      font-size: 1.125rem;
      line-height: 1.65;
    }

    h1 {
      font-size: clamp(2.5rem, 7vw, 4.5rem);
      line-height: 1.05;
    }

    .eyebrow {
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  `,
})
export class GettingStartedComponent {}
