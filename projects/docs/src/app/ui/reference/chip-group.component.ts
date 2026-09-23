import { ChangeDetectionStrategy, Component, inject, input, model } from '@angular/core';
import { ZdIdGenerator } from '@pranxy/zordon-ui';

export interface DocsChipOption {
  readonly value: string;
  readonly label: string;
  readonly count?: number;
  /** CSS colour for a leading dot, e.g. "var(--color-primary)". */
  readonly swatch?: string;
}

/**
 * Single-choice pill group built on native radio inputs, so arrow keys, form semantics and
 * screen-reader announcements come from the platform.
 * `inverse` selection = text-coloured fill (playground); `accent` = primary fill (filters).
 */
@Component({
  selector: 'docs-chip-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'selectedStyle()' },
  template: `
    <fieldset>
      <legend [class.docs-visually-hidden]="hideLegend()" class="docs-eyebrow">
        {{ label() }}
      </legend>
      <div class="chips">
        @for (option of options(); track option.value) {
          <label [class.selected]="option.value === value()">
            <input
              type="radio"
              [name]="name"
              [value]="option.value"
              [checked]="option.value === value()"
              (change)="value.set(option.value)"
            />
            @if (option.swatch) {
              <span class="swatch" [style.background]="option.swatch" aria-hidden="true"></span>
            }
            {{ option.label }}
            @if (option.count !== undefined) {
              <span class="count">{{ option.count }}</span>
            }
          </label>
        }
      </div>
    </fieldset>
  `,
  styles: `
    fieldset {
      display: grid;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      border: 0;
      min-inline-size: 0;
    }

    legend {
      padding: 0;
      margin-block-end: 0.5rem;
      font-family: var(--docs-font-mono);
      font-weight: var(--docs-weight-regular);
      letter-spacing: 0;
      text-transform: none;
      font-size: 0.75rem;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    label {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      min-block-size: 2rem;
      padding-inline: 0.7rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-pill);
      color: var(--docs-muted-text);
      font-size: var(--docs-text-xs);
      font-weight: var(--docs-weight-bold);
      cursor: pointer;
      transition:
        background var(--docs-duration) var(--docs-ease),
        color var(--docs-duration) var(--docs-ease);
    }

    label:hover {
      color: var(--docs-text);
    }

    input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }

    label:has(input:focus-visible) {
      outline: 3px solid var(--docs-accent);
      outline-offset: 2px;
    }

    .swatch {
      inline-size: 0.55rem;
      block-size: 0.55rem;
      border-radius: 50%;
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--docs-text) 20%, transparent);
    }

    .count {
      font-weight: var(--docs-weight-regular);
      opacity: 0.75;
    }

    :host(.inverse) label.selected {
      border-color: var(--docs-text);
      background: var(--docs-text);
      color: var(--docs-surface);
    }

    :host(.accent) label.selected {
      border-color: transparent;
      background: var(--docs-accent);
      color: var(--docs-accent-text);
    }
  `,
})
export class DocsChipGroupComponent {
  readonly label = input.required<string>();
  readonly options = input.required<readonly DocsChipOption[]>();
  readonly value = model.required<string>();
  readonly selectedStyle = input<'inverse' | 'accent'>('inverse');
  readonly hideLegend = input(false);

  protected readonly name = inject(ZdIdGenerator).next('docs-chip-group');
}
