import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdCard,
  ZdCardActions,
  ZdCardBody,
  ZdCardTitle,
  type ZdCardSize,
  type ZdCardVariant,
} from '@pranxy/zordon-ui/card';

import {
  cardPlaygroundControls,
  cardPlaygroundSnippet,
  cardReference,
  imageFullCode,
  linkCardCode,
} from '../content/card.content';
import { flagOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Card emits, only while this page is in use. */
@Component({
  selector: 'docs-card-daisy-styles',
  template: '',
  styleUrl: './styles/card.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class CardDaisyStylesComponent {}

@Component({
  selector: 'docs-card-page',
  imports: [
    CardDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    RouterLink,
    ZdButton,
    ZdCard,
    ZdCardActions,
    ZdCardBody,
    ZdCardTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-card-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Card"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <article
            zdCard
            class="demo"
            [variant]="variantOf(values)"
            [size]="sizeOf(values)"
            [side]="flagOf(values, 'side')"
          >
            <figure>
              <div class="art" role="img" aria-label="Mountain lake at dawn"></div>
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Lake trip</h3>
              <p>Three days by the water, cabins included.</p>
              <div zdCardActions>
                <button zdButton type="button" color="primary">Book</button>
              </div>
            </div>
          </article>
        </ng-template>
      </docs-playground>

      <docs-section
        id="link-card"
        level="3"
        heading="Link card"
        description="When the whole card navigates, put zdCard on the link and keep other controls out of it."
      >
        <docs-example label="link-card.html" [code]="linkCardCode">
          <a zdCard variant="border" class="demo link-card" routerLink="/components/badge">
            <div zdCardBody>
              <h3 zdCardTitle>Badge</h3>
              <p>Compact labels and counts.</p>
            </div>
          </a>
        </docs-example>
      </docs-section>

      <docs-section
        id="image-full"
        level="3"
        heading="Image behind"
        description="imageFull places the figure behind the body; daisyUI darkens it for legible text."
      >
        <docs-example label="image-full.html" [code]="imageFullCode">
          <article zdCard imageFull class="demo">
            <figure>
              <div class="art" role="img" aria-label="Mountain lake at dawn"></div>
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Lake trip</h3>
              <p>Three days by the water.</p>
            </div>
          </article>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .demo {
      inline-size: min(20rem, 100%);
      background: var(--docs-surface);
      color: var(--docs-text);
    }

    .demo.card-side {
      inline-size: min(30rem, 100%);
    }

    .demo p,
    .demo h3 {
      margin: 0;
    }

    .art {
      min-block-size: 8rem;
      inline-size: 100%;
      block-size: 100%;
      background:
        radial-gradient(circle at 70% 30%, var(--color-warning) 0 10%, transparent 11%),
        linear-gradient(var(--color-info), var(--color-primary));
    }

    .link-card {
      text-decoration: none;
    }

    .link-card:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }
  `,
})
export class CardPageComponent {
  protected readonly reference = cardReference;
  protected readonly controls = cardPlaygroundControls;
  protected readonly snippet = cardPlaygroundSnippet;
  protected readonly linkCardCode = linkCardCode;
  protected readonly imageFullCode = imageFullCode;
  protected readonly flagOf = flagOf;

  protected variantOf(values: PlaygroundValues): ZdCardVariant | undefined {
    const value = values['variant'];
    return value === 'default' ? undefined : (value as ZdCardVariant);
  }

  protected sizeOf(values: PlaygroundValues): ZdCardSize {
    return values['size'] as ZdCardSize;
  }
}
