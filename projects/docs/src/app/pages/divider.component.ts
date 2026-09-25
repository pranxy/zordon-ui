import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {
  ZdDivider,
  type ZdDividerOrientation,
  type ZdDividerPlacement,
} from '@pranxy/zordon-ui/divider';

import {
  breakFiles,
  dividerPlaygroundControls,
  dividerPlaygroundSnippet,
  dividerReference,
  responsiveCode,
} from '../content/divider.content';
import { colorOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's divider modifiers (the base class is global), only while this page is in use. */
@Component({
  selector: 'docs-divider-daisy-styles',
  template: '',
  styleUrl: './styles/divider.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class DividerDaisyStylesComponent {}

@Component({
  selector: 'docs-divider-page',
  imports: [
    DividerDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdDivider,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-divider-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Divider"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="pair" [class.side]="values['orientation'] === 'horizontal'">
            <section class="option">Sign in with email</section>
            <div
              zdDivider
              [color]="colorOf(values)"
              [orientation]="orientationOf(values)"
              [placement]="placementOf(values)"
            >
              OR
            </div>
            <section class="option">Continue with a passkey</section>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="thematic-break"
        level="3"
        heading="Thematic break"
        description="An empty hr keeps its native separator meaning between two topics. Reset its own border so only daisyUI’s line shows."
      >
        <docs-example label="billing" [files]="breakFiles">
          <div class="prose">
            <p>Billing contact: Ada Lovelace, ada&#64;example.com.</p>
            <hr zdDivider />
            <p>Invoices are sent on the first working day of the month.</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="responsive"
        level="3"
        heading="Responsive direction"
        description="Stacked on narrow screens, side by side from the md breakpoint: a Tailwind variant of divider-horizontal does the switch."
      >
        <docs-example label="checkout.html" [code]="responsiveCode">
          <div class="pair responsive">
            <section class="option">Delivery · 2 days</section>
            <div zdDivider class="md:divider-horizontal">OR</div>
            <section class="option">Pickup · today</section>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .pair {
      display: flex;
      flex-direction: column;
      inline-size: min(24rem, 100%);
    }

    .pair.side {
      flex-direction: row;
      inline-size: min(32rem, 100%);
    }

    .option {
      display: grid;
      flex: 1;
      place-items: center;
      min-block-size: 4rem;
      padding: var(--docs-space-3);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      border: 1px solid var(--docs-border);
      text-align: center;
    }

    .prose {
      inline-size: min(32rem, 100%);
    }

    .prose p {
      margin: 0;
    }

    .prose hr {
      border: 0;
    }

    @media (min-width: 48rem) {
      .pair.responsive {
        flex-direction: row;
        inline-size: min(32rem, 100%);
      }
    }
  `,
})
export class DividerPageComponent {
  protected readonly reference = dividerReference;
  protected readonly controls = dividerPlaygroundControls;
  protected readonly snippet = dividerPlaygroundSnippet;
  protected readonly breakFiles = breakFiles;
  protected readonly responsiveCode = responsiveCode;
  protected readonly colorOf = colorOf;

  protected orientationOf(values: PlaygroundValues): ZdDividerOrientation {
    return values['orientation'] as ZdDividerOrientation;
  }

  protected placementOf(values: PlaygroundValues): ZdDividerPlacement {
    return values['placement'] as ZdDividerPlacement;
  }
}
