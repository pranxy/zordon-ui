import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Logo mark + wordmark linking home. The mark is the only place the logo direction
 * (Components Board 2f–2j) is expressed; today it is 2f, the filled square.
 */
@Component({
  selector: 'docs-brand',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'size-' + size()" },
  template: `
    <a routerLink="/" [attr.aria-label]="label()">
      <span class="mark" aria-hidden="true">Z</span>
      <span>Zordon UI</span>
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    a {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--docs-text);
      font-weight: var(--docs-weight-heading);
      letter-spacing: -0.02em;
    }

    .mark {
      display: grid;
      place-items: center;
      inline-size: 2rem;
      block-size: 2rem;
      border-radius: var(--docs-radius-md);
      background: var(--docs-accent);
      color: var(--docs-accent-text);
      font-size: var(--docs-text-sm);
      font-weight: var(--docs-weight-black);
      letter-spacing: 0;
    }

    :host(.size-sm) a {
      gap: 0.5rem;
    }

    :host(.size-sm) .mark {
      inline-size: 1.5rem;
      block-size: 1.5rem;
      border-radius: var(--docs-radius-sm);
      font-size: 0.75rem;
    }
  `,
})
export class DocsBrandComponent {
  readonly size = input<'sm' | 'md'>('md');
  readonly label = input('Zordon UI home');
}
