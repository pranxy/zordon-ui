import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A top-level article section (`h2`) or sub-section (`level="3"`) with an optional intro.
 * The `id` is the anchor used by the page's table of contents. It belongs on the heading only,
 * so the static attribute Angular would otherwise leave on the host is removed.
 */
@Component({
  selector: 'docs-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': "'level-' + level()", '[attr.id]': 'null' },
  template: `
    <section [attr.aria-labelledby]="id()">
      <div class="intro">
        @if (eyebrow()) {
          <p class="docs-eyebrow docs-eyebrow--accent">{{ eyebrow() }}</p>
        }
        @if (level() === '2') {
          <h2 [id]="id()">{{ heading() }}</h2>
        } @else {
          <h3 [id]="id()">{{ heading() }}</h3>
        }
        @if (description()) {
          <p class="docs-lead">{{ description() }}</p>
        }
        <ng-content select="[docsSectionIntro]" />
      </div>
      <ng-content />
    </section>
  `,
  styles: `
    section {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.25rem;
      min-inline-size: 0;
    }

    :host(.level-3) section {
      gap: 1rem;
    }

    .intro {
      display: grid;
      gap: 0.4rem;
    }

    h2,
    h3 {
      margin: 0;
    }

    h2 {
      font-size: var(--docs-text-h2);
      font-weight: var(--docs-weight-black);
      line-height: 1.2;
      letter-spacing: -0.02em;
    }

    h3 {
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-heading);
      letter-spacing: -0.01em;
    }
  `,
})
export class DocsSectionComponent {
  readonly id = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input<string>();
  readonly eyebrow = input<string>();
  readonly level = input<'2' | '3'>('2');
}
