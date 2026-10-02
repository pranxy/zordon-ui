import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdCarousel,
  ZdCarouselItem,
  type ZdCarouselAlign,
  type ZdCarouselOrientation,
} from '@pranxy/zordon-ui/carousel';
import {
  carouselReference,
  carouselPlaygroundControls,
  carouselPlaygroundSnippet,
  carouselSlides,
  controlsFiles,
  indicatorFiles,
  peekFiles,
  verticalFiles,
} from '../content/carousel.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

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
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdButton,
    ZdCarousel,
    ZdCarouselItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-carousel-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Carousel"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div
            zdCarousel
            class="track"
            [class.vertical]="values['orientation'] === 'vertical'"
            [align]="align(values)"
            [orientation]="orientation(values)"
            role="region"
            aria-label="Landscapes"
            tabindex="0"
          >
            @for (slide of slides; track slide.id; let index = $index) {
              <div
                zdCarouselItem
                class="slide half"
                role="group"
                [attr.aria-label]="index + 1 + ' of ' + slides.length"
              >
                <img
                  [src]="slide.src"
                  width="768"
                  [height]="slide.height"
                  [alt]="slide.alt"
                  loading="lazy"
                />
              </div>
            }
          </div>
        </ng-template>
      </docs-playground>
      <docs-section
        id="controls"
        level="3"
        heading="Previous and next"
        description="Buttons align the exact next or previous image with the padded start edge. They stop at the ends and respect direction and reduced motion."
      >
        <docs-example label="gallery" [files]="controlsFiles"
          ><div class="docs-stack full">
            <div
              #track
              zdCarousel
              class="track"
              role="region"
              aria-label="Landscape gallery with controls"
              tabindex="0"
              (scroll)="controlIndex.set(nearestIndex(track))"
            >
              @for (slide of slides; track slide.id; let index = $index) {
                <div
                  zdCarouselItem
                  class="slide full-width"
                  role="group"
                  [attr.aria-label]="index + 1 + ' of ' + slides.length"
                >
                  <img
                    [src]="slide.src"
                    width="768"
                    [height]="slide.height"
                    [alt]="slide.alt"
                    loading="lazy"
                  />
                </div>
              }
            </div>
            <div class="docs-cluster controls">
              <button
                zdButton
                type="button"
                size="sm"
                [disabled]="controlIndex() === 0"
                (click)="scroll(track, -1)"
              >
                Previous
              </button>
              <button
                zdButton
                type="button"
                size="sm"
                [disabled]="controlIndex() === slides.length - 1"
                (click)="scroll(track, 1)"
              >
                Next
              </button>
            </div>
          </div></docs-example
        >
      </docs-section>
      <docs-section
        id="indicators"
        level="3"
        heading="Indicator buttons"
        description="Choose an image directly. The current indicator follows native scrolling, too; each gallery scrolls independently."
      >
        <docs-example label="indicators" [files]="indicatorFiles"
          ><div class="docs-stack full">
            <div
              #indicators
              zdCarousel
              class="track"
              role="region"
              aria-label="Landscape gallery with indicators"
              tabindex="0"
              (scroll)="indicatorIndex.set(nearestIndex(indicators))"
            >
              @for (slide of slides; track slide.id; let index = $index) {
                <div
                  zdCarouselItem
                  class="slide full-width"
                  role="group"
                  [attr.aria-label]="index + 1 + ' of ' + slides.length"
                >
                  <img
                    [src]="slide.src"
                    width="768"
                    [height]="slide.height"
                    [alt]="slide.alt"
                    loading="lazy"
                  />
                </div>
              }
            </div>
            <div class="docs-cluster controls" role="group" aria-label="Choose a landscape">
              @for (slide of slides; track slide.id; let index = $index) {
                <button
                  zdButton
                  type="button"
                  size="sm"
                  [attr.aria-label]="'Show ' + slide.label"
                  [attr.aria-current]="indicatorIndex() === index ? 'true' : null"
                  (click)="goTo(indicators, index)"
                >
                  {{ index + 1 }}
                </button>
              }
            </div>
          </div></docs-example
        >
      </docs-section>
      <docs-section
        id="peek"
        level="3"
        heading="Partial items"
        description="Centre-snapped images narrower than the region let the next one peek in."
      >
        <docs-example label="peek" [files]="peekFiles"
          ><div
            zdCarousel
            align="center"
            class="track padded"
            role="region"
            aria-label="Centred landscapes"
            tabindex="0"
          >
            @for (slide of slides; track slide.id; let index = $index) {
              <div
                zdCarouselItem
                class="slide peek"
                role="group"
                [attr.aria-label]="index + 1 + ' of ' + slides.length"
              >
                <img
                  [src]="slide.src"
                  width="768"
                  [height]="slide.height"
                  [alt]="slide.alt"
                  loading="lazy"
                />
              </div>
            }</div
        ></docs-example>
      </docs-section>
      <docs-section
        id="vertical"
        level="3"
        heading="Vertical"
        description="Give the region a height; images snap top to bottom."
      >
        <docs-example label="vertical" [files]="verticalFiles"
          ><div
            zdCarousel
            orientation="vertical"
            class="track vertical"
            role="region"
            aria-label="Vertical landscapes"
            tabindex="0"
          >
            @for (slide of slides; track slide.id; let index = $index) {
              <div
                zdCarouselItem
                class="slide full-height"
                role="group"
                [attr.aria-label]="index + 1 + ' of ' + slides.length"
              >
                <img
                  [src]="slide.src"
                  width="768"
                  [height]="slide.height"
                  [alt]="slide.alt"
                  loading="lazy"
                />
              </div>
            }</div
        ></docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .track {
      inline-size: 100%;
      min-inline-size: 0;
      gap: 0.75rem;
      padding: 0.75rem;
      scroll-padding-inline: 0.75rem;
      border-radius: var(--docs-radius-lg);
      background: var(--docs-surface);
    }
    .track.vertical {
      block-size: 15rem;
      scroll-padding-block: 0.75rem;
    }
    .track.padded {
      padding-inline: 2rem;
      scroll-padding-inline: 2rem;
    }
    .full {
      inline-size: 100%;
      min-inline-size: 0;
    }
    .slide {
      min-inline-size: 0;
      overflow: hidden;
      border-radius: var(--docs-radius-md);
    }
    .slide img {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      aspect-ratio: 3 / 2;
    }
    .half {
      inline-size: 65%;
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
    .controls {
      justify-content: center;
    }
    .controls [aria-current='true'] {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }
    .track:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }
    @media (prefers-reduced-motion: reduce) {
      .track {
        scroll-behavior: auto;
      }
    }
  `,
})
export class CarouselPageComponent {
  protected readonly reference = carouselReference;
  protected readonly controls = carouselPlaygroundControls;
  protected readonly snippet = carouselPlaygroundSnippet;
  protected readonly slides = carouselSlides;
  protected readonly controlsFiles = controlsFiles;
  protected readonly indicatorFiles = indicatorFiles;
  protected readonly peekFiles = peekFiles;
  protected readonly verticalFiles = verticalFiles;
  protected align(values: PlaygroundValues): ZdCarouselAlign {
    return values['align'] as ZdCarouselAlign;
  }
  protected orientation(values: PlaygroundValues): ZdCarouselOrientation {
    return values['orientation'] as ZdCarouselOrientation;
  }
  private readonly document = inject(DOCUMENT);
  protected readonly controlIndex = signal(0);
  protected readonly indicatorIndex = signal(0);

  protected nearestIndex(track: HTMLElement): number {
    const view = this.document.defaultView;
    if (!view) return 0;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    const distances = Array.from(track.children, child => {
      const rect = child.getBoundingClientRect();
      return Math.abs((rtl ? rect.right : rect.left) - edge);
    });
    return distances.indexOf(Math.min(...distances));
  }

  protected goTo(track: HTMLElement, index: number): void {
    const view = this.document.defaultView;
    const item = track.children.item(index);
    if (!view || !item) return;
    const style = view.getComputedStyle(track);
    const rtl = style.direction === 'rtl';
    const bounds = track.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const edge = rtl
      ? bounds.left + track.clientLeft + track.clientWidth - parseFloat(style.paddingRight)
      : bounds.left + track.clientLeft + parseFloat(style.paddingLeft);
    track.scrollBy({
      left: (rtl ? rect.right : rect.left) - edge,
      behavior: view.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  protected scroll(track: HTMLElement, step: -1 | 1): void {
    const next = Math.max(0, Math.min(track.children.length - 1, this.nearestIndex(track) + step));
    this.goTo(track, next);
  }
}
