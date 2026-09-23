import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
} from '@angular/core';

import { DocsCodeBlockComponent } from '../code/code-block.component';
import { DocsChipGroupComponent, type DocsChipOption } from './chip-group.component';

export type PlaygroundValue = string | boolean;
export type PlaygroundValues = Readonly<Record<string, PlaygroundValue>>;

export interface PlaygroundChoiceControl {
  readonly kind: 'choice';
  /** Input name; also the attribute written into the snippet. */
  readonly key: string;
  readonly options: readonly DocsChipOption[];
  readonly defaultValue: string;
  /** Values that are written without an attribute (e.g. the default look). */
  readonly omit?: readonly string[];
}

export interface PlaygroundBooleanControl {
  readonly kind: 'boolean';
  readonly key: string;
  readonly defaultValue: boolean;
}

export type PlaygroundControl = PlaygroundChoiceControl | PlaygroundBooleanControl;

export interface PlaygroundSnippet {
  /** Host element, e.g. "button". */
  readonly element: string;
  /** Directive attribute, e.g. "zdButton". */
  readonly directive: string;
  readonly content: string;
}

/** Marks the template that renders the live preview; its context is the current values. */
@Directive({ selector: 'ng-template[docsPlaygroundPreview]' })
export class DocsPlaygroundPreviewDirective {
  readonly template = inject<TemplateRef<{ $implicit: PlaygroundValues }>>(TemplateRef);

  static ngTemplateContextGuard(
    _directive: DocsPlaygroundPreviewDirective,
    context: unknown,
  ): context is { $implicit: PlaygroundValues } {
    return true;
  }
}

/** Serialises non-default control values as template attributes. */
export function playgroundAttributes(
  controls: readonly PlaygroundControl[],
  values: PlaygroundValues,
): string {
  return controls
    .map(control => {
      const value = values[control.key];
      if (control.kind === 'boolean') return value === true ? ` ${control.key}` : '';
      if (typeof value !== 'string' || control.omit?.includes(value)) return '';
      return ` ${control.key}="${value}"`;
    })
    .join('');
}

/**
 * Live, schema-driven playground: the real component in the preview, controls on the side, and
 * the exact snippet underneath. Controls are native inputs, so the server HTML is complete.
 */
@Component({
  selector: 'docs-playground',
  imports: [DocsChipGroupComponent, DocsCodeBlockComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid">
      <div class="preview" aria-live="off">
        @if (preview(); as marker) {
          <ng-container
            [ngTemplateOutlet]="marker.template"
            [ngTemplateOutletContext]="{ $implicit: values() }"
          />
        }
      </div>
      <form
        class="controls"
        [attr.aria-label]="label() + ' controls'"
        (submit)="$event.preventDefault()"
      >
        @for (control of choiceControls(); track control.key) {
          <docs-chip-group
            [label]="control.key"
            [options]="control.options"
            [value]="$any(values()[control.key])"
            (valueChange)="set(control.key, $event)"
          />
        }
        @if (booleanControls().length) {
          <div class="toggles">
            @for (control of booleanControls(); track control.key) {
              <label>
                <input
                  type="checkbox"
                  [checked]="values()[control.key] === true"
                  (change)="set(control.key, $any($event.target).checked)"
                />
                {{ control.key }}
              </label>
            }
          </div>
        }
        <button type="button" class="reset" (click)="reset()">Reset playground</button>
      </form>
    </div>
    <docs-code-block
      [code]="code()"
      language="html"
      label="playground.html"
      copyLabel="Copy playground code"
    />
  `,
  styles: `
    :host {
      --docs-code-frame-border: 0;
      --docs-code-frame-radius: 0;
      display: block;
      overflow: hidden;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
    }

    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(14rem, 18rem);
    }

    .preview {
      display: grid;
      place-items: center;
      min-block-size: 16rem;
      padding: 2rem;
      background:
        radial-gradient(circle, var(--docs-border) 1px, transparent 1.5px) 0 0 / 1rem 1rem,
        var(--docs-surface-raised);
    }

    .controls {
      display: grid;
      align-content: start;
      gap: 1.25rem;
      padding: 1.125rem 1.25rem;
      border-inline-start: 1px solid var(--docs-border);
      background: var(--docs-surface);
    }

    .toggles {
      display: flex;
      flex-wrap: wrap;
      gap: 1.25rem;
    }

    .toggles label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
      cursor: pointer;
    }

    .toggles input {
      inline-size: 1rem;
      block-size: 1rem;
      margin: 0;
      accent-color: var(--docs-accent);
    }

    .reset {
      justify-self: start;
      min-block-size: 2rem;
      padding-inline: 0.75rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-md);
      background: transparent;
      color: var(--docs-muted-text);
      font-size: 0.75rem;
      font-weight: var(--docs-weight-bold);
      cursor: pointer;
    }

    .reset:hover {
      color: var(--docs-text);
    }

    @media (max-width: 48rem) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
      }

      .preview {
        min-block-size: 10rem;
      }

      .controls {
        border-inline-start: 0;
        border-block-start: 1px solid var(--docs-border);
      }
    }
  `,
})
export class DocsPlaygroundComponent {
  readonly label = input.required<string>();
  readonly controls = input.required<readonly PlaygroundControl[]>();
  readonly snippet = input.required<PlaygroundSnippet>();

  protected readonly preview = contentChild(DocsPlaygroundPreviewDirective);
  protected readonly defaults = computed<PlaygroundValues>(() =>
    Object.fromEntries(this.controls().map(control => [control.key, control.defaultValue])),
  );
  protected readonly values = linkedSignal<PlaygroundValues>(() => this.defaults());
  protected readonly choiceControls = computed(() =>
    this.controls().filter(
      (control): control is PlaygroundChoiceControl => control.kind === 'choice',
    ),
  );
  protected readonly booleanControls = computed(() =>
    this.controls().filter(
      (control): control is PlaygroundBooleanControl => control.kind === 'boolean',
    ),
  );
  protected readonly code = computed(() => {
    const { element, directive, content } = this.snippet();
    const attributes = playgroundAttributes(this.controls(), this.values());
    return `<${element} ${directive}${attributes}>${content}</${element}>`;
  });

  protected set(key: string, value: PlaygroundValue): void {
    this.values.update(current => ({ ...current, [key]: value }));
  }

  protected reset(): void {
    this.values.set(this.defaults());
  }
}
