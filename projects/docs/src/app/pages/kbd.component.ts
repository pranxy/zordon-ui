import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ZdKbd, type ZdKbdSize } from '@pranxy/zordon-ui/kbd';

import {
  kbdAccessibilityNotes,
  kbdCombinationCode,
  kbdFacts,
  kbdImportCode,
  kbdInputColumns,
  kbdInputRows,
  kbdInTextCode,
  kbdPlaygroundControls,
  kbdSizes,
  kbdSizesCode,
  kbdThemingCode,
  kbdThemingColumns,
  kbdThemingRows,
  kbdTypesCode,
} from '../content/kbd.content';
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

@Component({
  selector: 'docs-kbd-page',
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
    ZdKbd,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Data display"
        heading="Kbd"
        maturity="preview"
        description="A presentation directive for keys and shortcuts. zdKbd puts daisyUI keycap styling on the native kbd element you already write; the shortcut's meaning, labels and behaviour stay yours."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Usable for evaluation; feedback may still change the API before it
        is marked Stable. Manual assistive-technology review is pending.
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
        description="Size is the only input. The snippet underneath is exactly what you would paste."
      >
        <docs-playground
          label="Kbd"
          [controls]="controls"
          [snippet]="{ element: 'kbd', directive: 'zdKbd', content: 'K' }"
        >
          <ng-template docsPlaygroundPreview let-values>
            <kbd zdKbd [size]="size(values)">K</kbd>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="size"
          level="3"
          heading="Size"
          description="Five sizes that line up with buttons and inputs of the same size. Omit size for daisyUI's medium default."
        >
          <docs-example label="sizes.html" [code]="sizesCode">
            @for (size of sizes; track size) {
              <kbd zdKbd [size]="size">Esc</kbd>
            }
          </docs-example>
        </docs-section>

        <docs-section
          id="in-text"
          level="3"
          heading="In running text"
          description="Kbd is inline, so it sits in a sentence without layout overrides."
        >
          <docs-example label="hint.html" [code]="inTextCode">
            <p class="sentence">Press <kbd zdKbd size="sm">/</kbd> to search the documentation.</p>
          </docs-example>
        </docs-section>

        <docs-section
          id="combinations"
          level="3"
          heading="Key combinations"
          description="Keep each key its own kbd. When symbols or abbreviations would be unclear, name the whole shortcut on the group and hide the individual keys."
        >
          <docs-example label="shortcut.html" [code]="combinationCode">
            <span aria-label="Control plus Shift plus Delete">
              <kbd zdKbd aria-hidden="true">Ctrl</kbd> + <kbd zdKbd aria-hidden="true">Shift</kbd> +
              <kbd zdKbd aria-hidden="true">Del</kbd>
            </span>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="ZdKbd is a standalone directive with one signal input. It has no outputs, models, methods or application-level defaults."
      >
        <docs-section id="inputs" level="3" heading="Inputs">
          <docs-api-table caption="Kbd inputs" [columns]="inputColumns" [rows]="inputRows" />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/kbd" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Native kbd semantics are the whole contract. Zordon adds classes and nothing else."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Your classes, utilities, styles and data-theme scopes are kept. daisyUI's Kbd variables work at any scope, but they are daisyUI internals and can change between daisyUI releases."
      >
        <docs-api-table
          caption="Kbd CSS variables"
          [columns]="themingColumns"
          [rows]="themingRows"
        />
        <docs-code-block label="shortcut.html" language="html" [code]="themingCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="Kbd has no browser-only work. Server and client render the same element, classes and content, so hydration has nothing to reconcile."
      />
    </article>
  `,
  styles: `
    .sentence {
      margin: 0;
      font-size: var(--docs-text-body);
    }
  `,
})
export class KbdPageComponent {
  protected readonly facts = kbdFacts;
  protected readonly importCode = kbdImportCode;
  protected readonly controls = kbdPlaygroundControls;
  protected readonly sizes = kbdSizes;
  protected readonly sizesCode = kbdSizesCode;
  protected readonly inTextCode = kbdInTextCode;
  protected readonly combinationCode = kbdCombinationCode;
  protected readonly inputColumns = kbdInputColumns;
  protected readonly inputRows = kbdInputRows;
  protected readonly typesCode = kbdTypesCode;
  protected readonly accessibilityNotes = kbdAccessibilityNotes;
  protected readonly themingColumns = kbdThemingColumns;
  protected readonly themingRows = kbdThemingRows;
  protected readonly themingCode = kbdThemingCode;

  protected size(values: PlaygroundValues): ZdKbdSize | undefined {
    const value = values['size'];
    return value === 'default' ? undefined : (value as ZdKbdSize);
  }
}
