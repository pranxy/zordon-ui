import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdCarousel,
  ZdCarouselItem,
  type ZdCarouselAlign,
  type ZdCarouselOrientation,
} from '@pranxy/zordon-ui/carousel';

import {
  carouselAccessibilityNotes,
  carouselCustomizationCode,
  carouselFacts,
  carouselImportCode,
  carouselInputs,
  carouselParts,
  carouselPlaygroundControls,
  carouselPlaygroundSnippet,
  carouselSlides,
  carouselSourceCode,
  carouselTypesCode,
  controlsFiles,
  peekCode,
  verticalCode,
} from '../content/carousel.content';
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

/** Loads the daisyUI classes Carousel emits, only while this page is in use. */
@Component({
  selector: 'docs-carousel-daisy-styles',
  template: '',
  styleUrl: './styles/carousel.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class CarouselDaisyStylesComponent {}

@Component({
  selector: 'docs-carousel-page',
  imports: [
    CarouselDaisyStylesComponent,
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
    ZdCarousel,
    ZdCarouselItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-carousel-daisy-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Data display"
        heading="Carousel"
        maturity="preview"
        description="Scroll-snap layout for a native scroll container. zdCarousel and zdCarouselItem apply daisyUI's carousel classes; scrolling, controls, semantics and position stay with you."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> A layout directive, not a slideshow widget: there is no index,
        autoplay or looping. Manual assistive-technology review is pending.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="Import the directives, and register the classes with Tailwind so they are compiled."
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
        description="Scroll the region with a trackpad, a mouse wheel, or the arrow keys after focusing it."
      >
        <docs-playground label="Carousel" [controls]="controls" [snippet]="snippet">
          <ng-template docsPlaygroundPreview let-values>
            <div
              zdCarousel
              class="track"
              [class.vertical]="values['orientation'] === 'vertical'"
              [align]="align(values)"
              [orientation]="orientation(values)"
              role="region"
              aria-label="Theme colours"
              tabindex="0"
            >
              @for (slide of slides; track slide.id; let index = $index) {
                <div
                  zdCarouselItem
                  class="slide half"
                  role="group"
                  [attr.aria-label]="index + 1 + ' of ' + slides.length"
                  [attr.data-tone]="slide.id"
                >
                  <span class="slide-label">{{ slide.label }}</span>
                </div>
              }
            </div>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="controls"
          level="3"
          heading="Previous and next"
          description="Native buttons scroll the region by one width. The directive adds no methods, so the control code lives in your component."
        >
          <docs-example label="gallery" [files]="controlsFiles">
            <div class="docs-stack full">
              <div
                #track
                zdCarousel
                class="track"
                role="region"
                aria-label="Theme colours with controls"
                tabindex="0"
              >
                @for (slide of slides; track slide.id; let index = $index) {
                  <div
                    zdCarouselItem
                    class="slide full-width"
                    role="group"
                    [attr.aria-label]="index + 1 + ' of ' + slides.length"
                    [attr.data-tone]="slide.id"
                  >
                    <span class="slide-label">{{ slide.label }}</span>
                  </div>
                }
              </div>
              <div class="docs-cluster controls">
                <button zdButton type="button" size="sm" (click)="scroll(track, -1)">
                  Previous
                </button>
                <button zdButton type="button" size="sm" (click)="scroll(track, 1)">Next</button>
              </div>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="peek"
          level="3"
          heading="Partial items"
          description="Centre-snapped items narrower than the region let the next one peek in, which shows that the region scrolls."
        >
          <docs-example label="peek.html" [code]="peekCode">
            <div
              zdCarousel
              align="center"
              class="track padded"
              role="region"
              aria-label="Centred theme colours"
              tabindex="0"
            >
              @for (slide of slides; track slide.id; let index = $index) {
                <div
                  zdCarouselItem
                  class="slide peek"
                  role="group"
                  [attr.aria-label]="index + 1 + ' of ' + slides.length"
                  [attr.data-tone]="slide.id"
                >
                  <span class="slide-label">{{ slide.label }}</span>
                </div>
              }
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="vertical"
          level="3"
          heading="Vertical"
          description="Give the region a height; items snap top to bottom."
        >
          <docs-example label="vertical.html" [code]="verticalCode">
            <div
              zdCarousel
              orientation="vertical"
              class="track vertical"
              role="region"
              aria-label="Vertical theme colours"
              tabindex="0"
            >
              @for (slide of slides; track slide.id; let index = $index) {
                <div
                  zdCarouselItem
                  class="slide full-height"
                  role="group"
                  [attr.aria-label]="index + 1 + ' of ' + slides.length"
                  [attr.data-tone]="slide.id"
                >
                  <span class="slide-label">{{ slide.label }}</span>
                </div>
              }
            </div>
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="Two standalone directives. No outputs, models, navigation methods or timers."
      >
        <docs-section id="directives" level="3" heading="Directives">
          <docs-api-table
            caption="Carousel directives"
            [columns]="parts.columns"
            [rows]="parts.rows"
          />
        </docs-section>
        <docs-section id="inputs" level="3" heading="Inputs">
          <docs-api-table
            caption="Carousel inputs"
            [columns]="inputs.columns"
            [rows]="inputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/carousel" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="The directive adds classes only. Semantics, labels, focus and controls are the consumer's."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Item width, gap, padding and responsive axis are ordinary classes and styles."
      >
        <docs-code-block label="custom.html" language="html" [code]="customizationCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="The server renders the scroll container and items with their classes. Native scrolling works before hydration; your control buttons start working once the page hydrates."
      />
    </article>
  `,
  styles: `
    .track {
      inline-size: 100%;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }

    .track.vertical {
      block-size: 12rem;
    }

    .track.padded {
      padding-inline: 2rem;
    }

    .full {
      inline-size: 100%;
    }

    .slide {
      display: grid;
      place-items: center;
      min-block-size: 8rem;
      border-radius: var(--docs-radius-md);
      font-weight: var(--docs-weight-bold);
    }

    .half {
      inline-size: 45%;
    }

    .full-width {
      inline-size: 100%;
    }

    .peek {
      inline-size: 80%;
    }

    .full-height {
      inline-size: 100%;
      block-size: 100%;
    }

    /* Theme content colours are not guaranteed to reach 4.5:1 on every role colour, so the
       label sits on the page surface instead. */
    .slide-label {
      padding: 0.25rem 0.625rem;
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
      color: var(--docs-text);
    }

    .slide[data-tone='primary'] {
      background: var(--color-primary);
      color: var(--color-primary-content);
    }

    .slide[data-tone='secondary'] {
      background: var(--color-secondary);
      color: var(--color-secondary-content);
    }

    .slide[data-tone='accent'] {
      background: var(--color-accent);
      color: var(--color-accent-content);
    }

    .slide[data-tone='neutral'] {
      background: var(--color-neutral);
      color: var(--color-neutral-content);
    }

    .slide[data-tone='info'] {
      background: var(--color-info);
      color: var(--color-info-content);
    }

    .controls {
      justify-content: center;
    }
  `,
})
export class CarouselPageComponent {
  private readonly document = inject(DOCUMENT);

  protected readonly facts = carouselFacts;
  protected readonly importCode = carouselImportCode;
  protected readonly sourceCode = carouselSourceCode;
  protected readonly controls = carouselPlaygroundControls;
  protected readonly snippet = carouselPlaygroundSnippet;
  protected readonly slides = carouselSlides;
  protected readonly controlsFiles = controlsFiles;
  protected readonly peekCode = peekCode;
  protected readonly verticalCode = verticalCode;
  protected readonly parts = carouselParts;
  protected readonly inputs = carouselInputs;
  protected readonly typesCode = carouselTypesCode;
  protected readonly accessibilityNotes = carouselAccessibilityNotes;
  protected readonly customizationCode = carouselCustomizationCode;

  protected align(values: PlaygroundValues): ZdCarouselAlign {
    return values['align'] as ZdCarouselAlign;
  }

  protected orientation(values: PlaygroundValues): ZdCarouselOrientation {
    return values['orientation'] as ZdCarouselOrientation;
  }

  protected scroll(track: HTMLElement, step: -1 | 1): void {
    const view = this.document.defaultView;
    if (!view) return;
    const rtl = view.getComputedStyle(track).direction === 'rtl';
    const reduce = view.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: step * (rtl ? -1 : 1) * track.clientWidth,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }
}
