import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ZdButton, type ZdButtonVariant, type ZdColor } from '@pranxy/zordon-ui/button';
import type { ZdSize } from '@pranxy/zordon-ui';

import {
  accessibilityNotes,
  buttonFacts,
  colorsCode,
  exampleColors,
  exampleSizes,
  exampleVariants,
  importCode,
  inputColumns,
  inputRows,
  keyboardColumns,
  keyboardRows,
  linksCode,
  loadingFiles,
  playgroundControls,
  sizesCode,
  themingCode,
  themingColumns,
  themingRows,
  typesCode,
  variantsCode,
} from '../content/button.content';
import {
  DocsApiTableComponent,
  DocsCalloutComponent,
  DocsCodeBlockComponent,
  DocsExampleComponent,
  DocsFeatureGridComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

type SaveState = 'idle' | 'saving' | 'saved';

@Component({
  selector: 'docs-button-page',
  imports: [
    DocsApiTableComponent,
    DocsCalloutComponent,
    DocsCodeBlockComponent,
    DocsExampleComponent,
    DocsFeatureGridComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsSectionComponent,
    TitleCasePipe,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Actions"
        heading="Button"
        maturity="planned"
        description="A directive, not a wrapper. zdButton applies daisyUI button styling and controlled state to the native action element you already write, so forms, focus and keyboard behave exactly as the platform intends."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Planned maturity.</strong> The entry point is implemented, but manual
        assistive-technology review and the remaining release gates are not complete. Treat this
        page as an implementation contract, not a Stable release claim.
      </docs-callout>

      <docs-section id="install" heading="Install and import">
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Every input, live. The snippet underneath is exactly what you would paste."
      >
        <docs-playground
          label="Button"
          [controls]="controls"
          [snippet]="{ element: 'button', directive: 'zdButton', content: 'Save changes' }"
        >
          <ng-template docsPlaygroundPreview let-values>
            <button
              zdButton
              type="button"
              [color]="color(values)"
              [variant]="variant(values)"
              [size]="size(values)"
              [loading]="values['loading'] === true"
              [disabled]="values['disabled'] === true"
            >
              @if (values['loading'] === true) {
                <span class="loading loading-spinner loading-xs" aria-hidden="true"></span>
              }
              Save changes
            </button>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="color"
          level="3"
          heading="Color"
          description="Colors are daisyUI roles, not hex values, so they follow whichever theme the application loads. Omit color for the base button."
        >
          <docs-example label="colors.html" [code]="colorsCode">
            <button zdButton type="button">Default</button>
            @for (color of colors; track color) {
              <button zdButton type="button" [color]="color">{{ color | titlecase }}</button>
            }
          </docs-example>
        </docs-section>

        <docs-section
          id="variant"
          level="3"
          heading="Variant"
          description="One input replaces daisyUI's mutually exclusive modifier classes, so btn-outline and btn-ghost can't be combined by accident."
        >
          <docs-example label="variants.html" [code]="variantsCode">
            <button zdButton type="button" color="primary">Solid</button>
            @for (variant of variants; track variant) {
              <button
                zdButton
                type="button"
                [color]="variant === 'ghost' ? undefined : 'primary'"
                [variant]="variant"
              >
                {{ variant | titlecase }}
              </button>
            }
          </docs-example>
        </docs-section>

        <docs-section
          id="size"
          level="3"
          heading="Size"
          description="Heights match Input, Select and the other data-input controls of the same size, so rows align without overrides."
        >
          <docs-example label="sizes.html" [code]="sizesCode">
            @for (size of sizes; track size) {
              <button zdButton type="button" color="primary" [size]="size">{{ size }}</button>
            }
          </docs-example>
        </docs-section>

        <docs-section
          id="loading"
          level="3"
          heading="Loading state"
          description="Bind loading to a signal. Activation is guarded and aria-disabled is set, but focus stays on the button, unlike disabled, which drops it. Try it."
        >
          <docs-example label="save-button" [files]="loadingFiles">
            <button
              zdButton
              type="button"
              color="primary"
              [loading]="saveState() === 'saving'"
              (click)="save()"
            >
              @if (saveState() === 'saving') {
                <span class="loading loading-spinner loading-xs" aria-hidden="true"></span>
                Saving…
              } @else {
                Save changes
              }
            </button>
            <span class="status" role="status">{{ saveLabel() }}</span>
          </docs-example>
        </docs-section>

        <docs-section
          id="links"
          level="3"
          heading="Links that look like buttons"
          description="Navigation stays an anchor. Anchors have no native disabled state, so zdDisabled guards activation and sets aria-disabled instead."
        >
          <docs-example label="links.html" [code]="linksCode">
            <a zdButton color="primary" href="/components">Open catalogue</a>
            <a zdButton color="primary" href="/resources" [zdDisabled]="true">Upgrade plan</a>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="ZdButton is a standalone directive. All inputs are signal inputs; booleans accept bare attributes."
      >
        <docs-section id="inputs" level="3" heading="Inputs">
          <docs-api-table caption="Button inputs" [columns]="inputColumns" [rows]="inputRows" />
        </docs-section>
        <docs-section id="outputs" level="3" heading="Outputs">
          <docs-callout variant="empty">
            None. The host is a real button, so bind (click), (focus) and friends directly.
            Activation is guarded while loading.
          </docs-callout>
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Native semantics do most of the work. Zordon only adds what the platform can't express."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
        <docs-api-table caption="Keyboard" [columns]="keyboardColumns" [rows]="keyboardRows" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Zordon ships no button CSS of its own. Your classes, styles and data-theme scopes are kept. daisyUI's component variables work at any scope, but they are daisyUI internals and can change between daisyUI releases."
      >
        <docs-api-table
          caption="Button CSS variables"
          [columns]="themingColumns"
          [rows]="themingRows"
        />
        <docs-code-block label="styles.css" language="css" [code]="themingCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="Button renders deterministic native markup with no generated IDs or browser-only initial state. Hydration attaches the activation guard without changing the server-owned classes or ARIA."
      />
    </article>
  `,
  styles: `
    .status {
      color: var(--docs-muted-text);
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }
  `,
})
export class ButtonPageComponent {
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly facts = buttonFacts;
  protected readonly importCode = importCode;
  protected readonly controls = playgroundControls;
  protected readonly colors = exampleColors;
  protected readonly colorsCode = colorsCode;
  protected readonly variants = exampleVariants;
  protected readonly variantsCode = variantsCode;
  protected readonly sizes = exampleSizes;
  protected readonly sizesCode = sizesCode;
  protected readonly loadingFiles = loadingFiles;
  protected readonly linksCode = linksCode;
  protected readonly inputColumns = inputColumns;
  protected readonly inputRows = inputRows;
  protected readonly typesCode = typesCode;
  protected readonly accessibilityNotes = accessibilityNotes;
  protected readonly keyboardColumns = keyboardColumns;
  protected readonly keyboardRows = keyboardRows;
  protected readonly themingColumns = themingColumns;
  protected readonly themingRows = themingRows;
  protected readonly themingCode = themingCode;

  protected readonly saveState = signal<SaveState>('idle');
  protected readonly saveLabel = signal('Idle');

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected color(values: PlaygroundValues): ZdColor | undefined {
    const value = values['color'];
    return value === 'default' ? undefined : (value as ZdColor);
  }

  protected variant(values: PlaygroundValues): ZdButtonVariant | undefined {
    const value = values['variant'];
    return value === 'solid' ? undefined : (value as ZdButtonVariant);
  }

  protected size(values: PlaygroundValues): ZdSize {
    return values['size'] as ZdSize;
  }

  protected save(): void {
    if (this.saveState() === 'saving') return;
    this.saveState.set('saving');
    this.saveLabel.set('Saving…');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.saveState.set('saved');
      this.saveLabel.set('Saved');
    }, 1500);
  }
}
