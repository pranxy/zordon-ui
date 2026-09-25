import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import {
  ZdAccordion,
  ZdAccordionContent,
  ZdAccordionHeading,
  ZdAccordionItem,
  ZdAccordionPanel,
  ZdAccordionTrigger,
} from '@pranxy/zordon-ui/accordion';
import { ZdButton } from '@pranxy/zordon-ui/button';

import {
  accordionPlaygroundControls,
  accordionPlaygroundSnippet,
  accordionReference,
  controlledFiles,
  lazyCode,
} from '../content/accordion.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

type Indicator = 'arrow' | 'plus' | 'none';

/** Accordion items use daisyUI's collapse classes; reuse the Collapse page stylesheet. */
@Component({
  selector: 'docs-accordion-daisy-styles',
  template: '',
  styleUrl: './styles/collapse.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class AccordionDaisyStylesComponent {}

/** A lazily created panel body, standing in for an expensive editor. */
@Component({
  selector: 'docs-accordion-lazy-editor',
  template: `
    <label class="docs-field">
      Card holder
      <input class="field" value="Ada Lovelace" />
    </label>
    <p class="docs-status">Created {{ created }}</p>
  `,
  styles: `
    :host {
      display: grid;
      gap: var(--docs-space-2);
    }

    .field {
      font: inherit;
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-sm);
      background: transparent;
      color: inherit;
    }
  `,
})
class AccordionLazyEditorComponent {
  protected readonly created = new Date().toLocaleTimeString('en-GB');
}

@Component({
  selector: 'docs-accordion-page',
  imports: [
    AccordionDaisyStylesComponent,
    AccordionLazyEditorComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdAccordion,
    ZdAccordionContent,
    ZdAccordionHeading,
    ZdAccordionItem,
    ZdAccordionPanel,
    ZdAccordionTrigger,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-accordion-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Accordion"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <!-- Recreate the group when the mode changes, so states never conflict. -->
          @for (single of [values['oneAtATime'] === true]; track single) {
            <section
              zdAccordion
              class="group"
              aria-label="Shipping questions"
              [multiExpandable]="!single"
            >
              @for (faq of faqs; track faq.id) {
                <zd-accordion-item class="item" [indicator]="indicatorOf(values)">
                  <h3 zdAccordionHeading>
                    <button
                      zdAccordionTrigger
                      [id]="'faq-' + faq.id + '-trigger'"
                      [panel]="panel.aria"
                    >
                      {{ faq.question }}
                    </button>
                  </h3>
                  <zd-accordion-panel #panel="zdAccordionPanel" [id]="'faq-' + faq.id + '-panel'">
                    <p>{{ faq.answer }}</p>
                  </zd-accordion-panel>
                </zd-accordion-item>
              }
            </section>
          }
        </ng-template>
      </docs-playground>

      <docs-section
        id="controlled"
        level="3"
        heading="Controlled state"
        description="[(expanded)] keeps your signal in sync, and the group exports expandAll() and collapseAll()."
      >
        <docs-example label="settings" [files]="controlledFiles">
          <div class="docs-stack group">
            <section zdAccordion #settings="zdAccordion" class="group" aria-label="Settings">
              <zd-accordion-item class="item">
                <h3 zdAccordionHeading>
                  <button
                    zdAccordionTrigger
                    id="settings-profile-trigger"
                    [panel]="profile.aria"
                    [(expanded)]="profileOpen"
                  >
                    Profile
                  </button>
                </h3>
                <zd-accordion-panel #profile="zdAccordionPanel" id="settings-profile-panel">
                  <p>Name, photo and pronouns.</p>
                </zd-accordion-panel>
              </zd-accordion-item>
              <zd-accordion-item class="item">
                <h3 zdAccordionHeading>
                  <button zdAccordionTrigger id="settings-privacy-trigger" [panel]="privacy.aria">
                    Privacy
                  </button>
                </h3>
                <zd-accordion-panel #privacy="zdAccordionPanel" id="settings-privacy-panel">
                  <p>Who can see your activity.</p>
                </zd-accordion-panel>
              </zd-accordion-item>
            </section>
            <div class="docs-cluster">
              <button zdButton type="button" size="sm" (click)="settings.expandAll()">
                Expand all
              </button>
              <button zdButton type="button" size="sm" (click)="settings.collapseAll()">
                Collapse all
              </button>
              <p class="docs-status" role="status">
                Profile {{ profileOpen() ? 'open' : 'closed' }}
              </p>
            </div>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="lazy"
        level="3"
        heading="Lazy content"
        description="A zdAccordionContent template is created when the panel first opens. preserveContent keeps it, and what you typed, after closing."
      >
        <docs-example label="billing.html" [code]="lazyCode">
          <section zdAccordion class="group" aria-label="Billing">
            <zd-accordion-item class="item">
              <h3 zdAccordionHeading>
                <button zdAccordionTrigger id="billing-trigger" [panel]="billing.aria">
                  Billing details
                </button>
              </h3>
              <zd-accordion-panel
                #billing="zdAccordionPanel"
                id="billing-panel"
                [preserveContent]="true"
              >
                <ng-template zdAccordionContent>
                  <docs-accordion-lazy-editor />
                </ng-template>
              </zd-accordion-panel>
            </zd-accordion-item>
          </section>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .group {
      inline-size: 100%;
    }

    .item {
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
    }

    .item + .item {
      margin-block-start: var(--docs-space-2);
    }

    h3 {
      margin: 0;
      font-size: 1rem;
    }

    zd-accordion-panel p {
      margin: 0;
    }
  `,
})
export class AccordionPageComponent {
  protected readonly reference = accordionReference;
  protected readonly controls = accordionPlaygroundControls;
  protected readonly snippet = accordionPlaygroundSnippet;
  protected readonly controlledFiles = controlledFiles;
  protected readonly lazyCode = lazyCode;
  protected readonly profileOpen = signal(true);

  protected readonly faqs = [
    { id: 'returns', question: 'Returns', answer: 'Return any item within 30 days.' },
    { id: 'delivery', question: 'Delivery', answer: 'Orders ship in two working days.' },
    { id: 'warranty', question: 'Warranty', answer: 'Two years on every product.' },
  ] as const;

  protected indicatorOf(values: PlaygroundValues): Indicator {
    return values['indicator'] as Indicator;
  }
}
