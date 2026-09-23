import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Numbered vertical procedure with a connecting rail. Children are `docs-step` elements. */
@Component({
  selector: 'docs-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'list' },
  template: `<ng-content />`,
  styles: `
    :host {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 2rem;
      counter-reset: docs-step;
    }
  `,
})
export class DocsStepsComponent {}

/** One step: numbered marker, heading, description and projected content (usually code). */
@Component({
  selector: 'docs-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'listitem' },
  template: `
    <span class="marker" aria-hidden="true"></span>
    <div class="content">
      <h3 [id]="id()">{{ heading() }}</h3>
      @if (description()) {
        <p class="docs-lead">{{ description() }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      grid-template-columns: 2.5rem minmax(0, 1fr);
      column-gap: 1.25rem;
      counter-increment: docs-step;
    }

    :host::before {
      content: '';
      position: absolute;
      inset-block: 2.5rem -2rem;
      inset-inline-start: calc(1.25rem - 0.5px);
      border-inline-start: 1px solid var(--docs-border);
    }

    :host(:last-child)::before {
      display: none;
    }

    .marker {
      display: grid;
      place-items: center;
      inline-size: 2rem;
      block-size: 2rem;
      margin-inline: auto;
      border: 1px solid var(--docs-border-strong);
      border-radius: 50%;
      background: var(--docs-surface);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }

    .marker::before {
      content: counter(docs-step);
    }

    .content {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.75rem;
      min-inline-size: 0;
    }

    h3 {
      margin: 0.25rem 0 0;
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-heading);
    }

    @media (max-width: 48rem) {
      :host {
        grid-template-columns: 2rem minmax(0, 1fr);
        column-gap: 0.875rem;
      }

      :host::before {
        inset-inline-start: calc(1rem - 0.5px);
      }
    }
  `,
})
export class DocsStepComponent {
  readonly id = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input<string>();
}
