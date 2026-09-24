import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdCollapse,
  ZdCollapseContent,
  ZdCollapseTitle,
  type ZdCollapseIndicator,
} from '@pranxy/zordon-ui/collapse';

import {
  collapseAccessibilityNotes,
  collapseCustomizationCode,
  collapseDirectives,
  collapseFacts,
  collapseFaqs,
  collapseImportCode,
  collapseInputs,
  collapsePlaygroundControls,
  collapsePlaygroundSnippet,
  collapseSourceCode,
  collapseTypesCode,
  detailsCode,
  forcedStateCode,
  groupCode,
  indicatorsCode,
} from '../content/collapse.content';
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

/** Loads the daisyUI classes Collapse emits, only while this page is in use. */
@Component({
  selector: 'docs-collapse-daisy-styles',
  template: '',
  styleUrl: './styles/collapse.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class CollapseDaisyStylesComponent {}

@Component({
  selector: 'docs-collapse-page',
  imports: [
    CollapseDaisyStylesComponent,
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
    ZdButton,
    ZdCollapse,
    ZdCollapseContent,
    ZdCollapseTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-collapse-daisy-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Data display"
        heading="Collapse"
        maturity="preview"
        description="A styling composition for native disclosures. zdCollapse and its parts put daisyUI's collapse, title, content and indicator classes on the details and summary you already write, and leave the open state to the platform."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Usable for evaluation; feedback may still change the API before it
        is marked Stable. Manual assistive-technology review is pending.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="Import the directives you use, and register the classes with Tailwind so they are compiled."
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-block label="src/styles.css" language="css" [code]="sourceCode" />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Choose an indicator, then open and close the disclosure. It works without JavaScript."
      >
        <docs-playground label="Collapse" [controls]="controls" [snippet]="snippet">
          <ng-template docsPlaygroundPreview let-values>
            <details zdCollapse class="disclosure wide" [indicator]="indicator(values)">
              <summary zdCollapseTitle>How is the value submitted?</summary>
              <div zdCollapseContent>As a native boolean through the form control.</div>
            </details>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="details"
          level="3"
          heading="Native details"
          description="The recommended pattern. The open attribute is the state; summary is the keyboard-operable toggle."
        >
          <docs-example label="shipping.html" [code]="detailsCode">
            <details zdCollapse indicator="arrow" class="disclosure wide" open>
              <summary zdCollapseTitle>Shipping</summary>
              <div zdCollapseContent>Orders ship within two business days.</div>
            </details>
          </docs-example>
        </docs-section>

        <docs-section
          id="indicators"
          level="3"
          heading="Indicators"
          description="An arrow, a plus that turns into a minus, or no indicator at all."
        >
          <docs-example label="indicators.html" [code]="indicatorsCode">
            <div class="docs-stack wide">
              <details zdCollapse indicator="arrow" class="disclosure">
                <summary zdCollapseTitle>Arrow</summary>
                <div zdCollapseContent>Rotates when open.</div>
              </details>
              <details zdCollapse indicator="plus" class="disclosure">
                <summary zdCollapseTitle>Plus</summary>
                <div zdCollapseContent>Becomes a minus when open.</div>
              </details>
              <details zdCollapse class="disclosure">
                <summary zdCollapseTitle>No indicator</summary>
                <div zdCollapseContent>Just the title.</div>
              </details>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="forced-state"
          level="3"
          heading="Forced state"
          description="For a host that is not details, forcedState sets the visual state. The control, its label and aria-expanded are yours."
        >
          <docs-example label="release-notes.html" [code]="forcedStateCode">
            <div class="docs-stack wide">
              <div
                zdCollapse
                indicator="plus"
                class="disclosure"
                [forcedState]="notesOpen() ? 'open' : 'close'"
              >
                <div zdCollapseTitle>Release notes</div>
                <div zdCollapseContent id="release-notes">
                  Notes for this release appear here when the title is open.
                </div>
              </div>
              <button
                zdButton
                type="button"
                variant="outline"
                size="sm"
                aria-controls="release-notes"
                [attr.aria-expanded]="notesOpen()"
                (click)="notesOpen.set(!notesOpen())"
              >
                Toggle notes
              </button>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="group"
          level="3"
          heading="Several disclosures"
          description="Independent disclosures in a list: each opens and closes on its own."
        >
          <docs-example label="faq.html" [code]="groupCode">
            <div class="docs-stack wide">
              @for (faq of faqs; track faq.id) {
                <details zdCollapse indicator="plus" class="disclosure">
                  <summary zdCollapseTitle>{{ faq.question }}</summary>
                  <div zdCollapseContent>{{ faq.answer }}</div>
                </details>
              }
            </div>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="Three standalone directives. No models, outputs, methods, IDs or ARIA are added."
      >
        <docs-section id="directives" level="3" heading="Directives">
          <docs-api-table
            caption="Collapse directives"
            [columns]="directives.columns"
            [rows]="directives.rows"
          />
        </docs-section>
        <docs-section id="inputs" level="3" heading="Inputs">
          <docs-api-table
            caption="Collapse inputs"
            [columns]="inputs.columns"
            [rows]="inputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/collapse" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="Native details carries the semantics. Zordon only adds classes."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Borders, backgrounds, spacing and icon placement are yours. daisyUI animates open and close only when reduced motion is not requested."
      >
        <docs-code-block label="styled.html" language="html" [code]="customizationCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="The server renders the native details with its classes and open state. Disclosures work before and without hydration."
      />
    </article>
  `,
  styles: `
    .disclosure {
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    .wide {
      inline-size: min(100%, 30rem);
    }
  `,
})
export class CollapsePageComponent {
  protected readonly facts = collapseFacts;
  protected readonly importCode = collapseImportCode;
  protected readonly sourceCode = collapseSourceCode;
  protected readonly controls = collapsePlaygroundControls;
  protected readonly snippet = collapsePlaygroundSnippet;
  protected readonly detailsCode = detailsCode;
  protected readonly indicatorsCode = indicatorsCode;
  protected readonly forcedStateCode = forcedStateCode;
  protected readonly groupCode = groupCode;
  protected readonly faqs = collapseFaqs;
  protected readonly directives = collapseDirectives;
  protected readonly inputs = collapseInputs;
  protected readonly typesCode = collapseTypesCode;
  protected readonly accessibilityNotes = collapseAccessibilityNotes;
  protected readonly customizationCode = collapseCustomizationCode;

  protected readonly notesOpen = signal(false);

  protected indicator(values: PlaygroundValues): ZdCollapseIndicator | undefined {
    const value = values['indicator'];
    return value === 'none' ? undefined : (value as ZdCollapseIndicator);
  }
}
