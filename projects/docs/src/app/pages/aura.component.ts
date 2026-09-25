import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdAura, type ZdAuraSize, type ZdAuraVariant } from '@pranxy/zordon-ui/aura';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdCard, ZdCardBody, ZdCardTitle } from '@pranxy/zordon-ui/card';

import {
  auraPlaygroundControls,
  auraPlaygroundSnippet,
  auraReference,
  auraVariants,
  cardCode,
  variantsCode,
} from '../content/aura.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI Aura classes, the library's motion policy and Card's classes for the example. */
@Component({
  selector: 'docs-aura-daisy-styles',
  template: '',
  styleUrls: [
    './styles/aura.daisy.css',
    './styles/card.daisy.css',
    '../../../../components/aura/src/aura-motion.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
class AuraDaisyStylesComponent {}

@Component({
  selector: 'docs-aura-page',
  imports: [
    AuraDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdAura,
    ZdButton,
    ZdCard,
    ZdCardBody,
    ZdCardTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-aura-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Aura"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div zdAura [variant]="variantOf(values)" [size]="sizeOf(values)">
            <button zdButton type="button">Start free trial</button>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="variants"
        level="3"
        heading="Variants"
        description="Six daisyUI effects. Without a variant the light follows the text color."
      >
        <docs-example label="variants.html" [code]="variantsCode">
          @for (variant of variants; track variant) {
            <div zdAura [variant]="variant">
              <div class="tile">{{ variant }}</div>
            </div>
          }
        </docs-example>
      </docs-section>

      <docs-section
        id="card"
        level="3"
        heading="Around a card"
        description="daisyUI reads the radius of a direct card child, so the light follows its corners."
      >
        <docs-example label="plan.html" [code]="cardCode">
          <div zdAura size="lg" class="brand-light">
            <article zdCard class="plan">
              <div zdCardBody>
                <h3 zdCardTitle>Pro plan</h3>
                <p>Everything in Team, plus audit logs.</p>
              </div>
            </article>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .tile {
      padding: var(--docs-space-3) var(--docs-space-4);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      color: var(--docs-text);
      font-family: var(--docs-font-mono);
      font-size: var(--docs-text-sm);
    }

    .brand-light {
      color: var(--color-primary);
    }

    .plan {
      inline-size: 16rem;
      background: var(--docs-surface);
      color: var(--docs-text);
    }

    .plan p,
    .plan h3 {
      margin: 0;
    }
  `,
})
export class AuraPageComponent {
  protected readonly reference = auraReference;
  protected readonly controls = auraPlaygroundControls;
  protected readonly snippet = auraPlaygroundSnippet;
  protected readonly variants = auraVariants;
  protected readonly variantsCode = variantsCode;
  protected readonly cardCode = cardCode;

  protected variantOf(values: PlaygroundValues): ZdAuraVariant | undefined {
    const value = values['variant'];
    return value === 'default' ? undefined : (value as ZdAuraVariant);
  }

  protected sizeOf(values: PlaygroundValues): ZdAuraSize {
    return values['size'] as ZdAuraSize;
  }
}
