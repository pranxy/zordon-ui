import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Landing card with a soft accent glow, display heading, lead, actions and meta.
 * Project `[docsHeroActions]` (buttons) and `[docsHeroMeta]` (e.g. a stats meta grid).
 */
@Component({
  selector: 'docs-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="docs-eyebrow docs-eyebrow--accent">{{ eyebrow() }}</p>
    <h1 id="page-title">{{ heading() }}</h1>
    <p class="lead">{{ description() }}</p>
    <div class="actions"><ng-content select="[docsHeroActions]" /></div>
    <ng-content select="[docsHeroMeta]" />
    <ng-content />
  `,
  styles: `
    :host {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 1.25rem;
      padding: clamp(1.25rem, 4vw, 2.25rem);
      overflow: hidden;
      isolation: isolate;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    :host::before {
      content: '';
      position: absolute;
      inset-block-start: -8rem;
      inset-inline-end: -6rem;
      z-index: -1;
      inline-size: 24rem;
      block-size: 24rem;
      border-radius: 50%;
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--docs-accent) 22%, transparent),
        transparent 70%
      );
    }

    h1 {
      margin: 0;
      max-inline-size: 20ch;
      font-size: var(--docs-text-display);
      font-weight: var(--docs-weight-black);
      line-height: 0.97;
      letter-spacing: -0.035em;
    }

    .lead {
      margin: 0;
      max-inline-size: var(--docs-measure);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-lead);
      line-height: 1.6;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
    }

    .actions:empty {
      display: none;
    }
  `,
})
export class DocsHeroComponent {
  readonly eyebrow = input.required<string>();
  readonly heading = input.required<string>();
  readonly description = input.required<string>();
}
