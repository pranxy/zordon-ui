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
  sideFiles,
  responsiveFiles,
  selectableFiles,
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
              <img
                src="images/showcase/lake-morning.webp"
                width="768"
                height="512"
                alt="Mountain lake in the morning"
                loading="lazy"
              />
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
              <img
                src="images/showcase/lake-morning.webp"
                width="768"
                height="512"
                alt="Mountain lake in the morning"
                loading="lazy"
              />
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Lake trip</h3>
              <p>Three days by the water.</p>
            </div>
          </article>
        </docs-example>
      </docs-section>
      <docs-section
        id="side-image"
        level="3"
        heading="Image on the side"
        description="The side input puts a direct figure next to the body."
        ><docs-example label="side-card" [files]="sideFiles"
          ><article zdCard side class="demo side-demo" variant="border">
            <figure>
              <img
                src="images/showcase/sneaker-side.webp"
                width="512"
                height="512"
                alt="Blue trainer in profile"
                loading="lazy"
              />
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Everyday trainer</h3>
              <p>A comfortable companion for the city.</p>
            </div>
          </article></docs-example
        ></docs-section
      >
      <docs-section
        id="responsive"
        level="3"
        heading="Responsive card"
        description="Vertical on smaller screens and horizontal from 48rem; a media query owns the layout."
        ><docs-example label="responsive-card" [files]="responsiveFiles"
          ><article zdCard class="demo responsive-card" variant="border">
            <figure>
              <img
                src="images/showcase/lake-sunset.webp"
                width="768"
                height="512"
                alt="Mountain lake at sunset"
                loading="lazy"
              />
            </figure>
            <div zdCardBody>
              <h3 zdCardTitle>Stay by the lake</h3>
              <p>A quiet cabin and a view to remember.</p>
            </div>
          </article></docs-example
        ></docs-section
      >
      <docs-section
        id="selectable"
        level="3"
        heading="Selectable cards"
        description="Native checkboxes and radios own selection, keyboard behavior and disabled state."
        ><docs-example label="selectable-cards" [files]="selectableFiles"
          ><div class="selection-examples">
            <fieldset class="choice-set">
              <legend>Trip extras — choose any</legend>
              <div class="choice-cards">
                <label zdCard variant="border" class="selectable-card"
                  ><span zdCardBody
                    ><span class="choice-title"
                      ><input type="checkbox" name="breakfast" /><span zdCardTitle
                        >Breakfast</span
                      ></span
                    ><span>Fresh pastries each morning.</span></span
                  ></label
                >
                <label zdCard variant="border" class="selectable-card"
                  ><span zdCardBody
                    ><span class="choice-title"
                      ><input type="checkbox" name="kayak" /><span zdCardTitle
                        >Kayak hire</span
                      ></span
                    ><span>Explore the shore at your pace.</span></span
                  ></label
                >
                <label zdCard variant="border" class="selectable-card"
                  ><span zdCardBody
                    ><span class="choice-title"
                      ><input type="checkbox" name="sauna" disabled /><span zdCardTitle
                        >Sauna</span
                      ></span
                    ><span>Unavailable this weekend.</span></span
                  ></label
                >
              </div>
            </fieldset>
            <fieldset class="choice-set">
              <legend>Room — choose one</legend>
              <div class="choice-cards">
                <label zdCard variant="border" class="selectable-card"
                  ><span zdCardBody
                    ><span class="choice-title"
                      ><input type="radio" name="showcase-room" value="cabin" checked /><span
                        zdCardTitle
                        >Cabin</span
                      ></span
                    ><span>A cosy room for two.</span></span
                  ></label
                >
                <label zdCard variant="border" class="selectable-card"
                  ><span zdCardBody
                    ><span class="choice-title"
                      ><input type="radio" name="showcase-room" value="suite" /><span zdCardTitle
                        >Suite</span
                      ></span
                    ><span>Extra space and a private balcony.</span></span
                  ></label
                >
                <label zdCard variant="border" class="selectable-card"
                  ><span zdCardBody
                    ><span class="choice-title"
                      ><input type="radio" name="showcase-room" value="lodge" disabled /><span
                        zdCardTitle
                        >Lodge</span
                      ></span
                    ><span>Fully booked.</span></span
                  ></label
                >
              </div>
            </fieldset>
          </div></docs-example
        ></docs-section
      >
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

    .demo figure {
      margin: 0;
      min-inline-size: 0;
    }
    .demo figure img {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
    .demo:not(.card-side):not(.image-full) figure img {
      aspect-ratio: 3 / 2;
    }
    .demo.card-side > figure {
      flex: 0 0 38%;
    }
    .demo.card-side > [zdCardBody] {
      min-inline-size: 0;
    }
    .side-demo {
      max-inline-size: 100%;
    }
    .demo.responsive-card {
      inline-size: min(38rem, 100%);
    }
    @media (min-width: 48rem) {
      .responsive-card {
        flex-direction: row;
      }
      .responsive-card > figure {
        flex: 0 0 42%;
        border-start-end-radius: 0;
        border-end-start-radius: inherit;
      }
      .responsive-card > [zdCardBody] {
        min-inline-size: 0;
      }
    }
    .selection-examples {
      inline-size: 100%;
      display: grid;
      gap: var(--docs-space-5);
    }
    .choice-set {
      margin: 0;
      padding: 0;
      border: 0;
      min-inline-size: 0;
    }
    .choice-set legend {
      margin-block-end: var(--docs-space-3);
      font-weight: var(--docs-weight-bold);
    }
    .choice-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
      gap: var(--docs-space-3);
    }
    .selectable-card {
      cursor: pointer;
      background: var(--docs-surface);
      color: var(--docs-text);
    }
    .choice-title {
      display: flex;
      align-items: center;
      gap: var(--docs-space-2);
    }
    .choice-title input {
      accent-color: var(--docs-accent);
      flex-shrink: 0;
    }
    .selectable-card:has(input:checked) {
      border-color: var(--docs-accent);
      background: var(--docs-subtle);
    }
    .selectable-card:has(input:focus-visible) {
      outline: 2px solid var(--docs-accent);
      outline-offset: 3px;
    }
    .selectable-card:has(input:disabled) {
      cursor: not-allowed;
      opacity: 0.6;
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
  protected readonly sideFiles = sideFiles;
  protected readonly responsiveFiles = responsiveFiles;
  protected readonly selectableFiles = selectableFiles;
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
