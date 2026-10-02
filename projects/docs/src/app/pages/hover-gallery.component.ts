import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdHoverGallery } from '@pranxy/zordon-ui/hover-gallery';

import { captionCode, galleryCode, hoverGalleryReference } from '../content/hover-gallery.content';
import { DocsExampleComponent, DocsReferencePageComponent, DocsSectionComponent } from '../ui';

/** Loads daisyUI's hover-gallery class, only while this page is in use. */
@Component({
  selector: 'docs-hover-gallery-daisy-styles',
  template: '',
  styleUrl: './styles/hover-gallery.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class HoverGalleryDaisyStylesComponent {}

/**
 * Hover Gallery has no inputs, so the playground is a live example with its code. The generated photographs are reused across the showcase.
 */
@Component({
  selector: 'docs-hover-gallery-page',
  imports: [
    DocsExampleComponent,
    DocsReferencePageComponent,
    DocsSectionComponent,
    HoverGalleryDaisyStylesComponent,
    ZdHoverGallery,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-hover-gallery-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-example docsReferencePlayground label="product.html" [code]="galleryCode">
        <figure zdHoverGallery class="product">
          @for (view of views; track view.label) {
            <img [src]="view.src" [alt]="view.label" width="512" height="512" loading="lazy" />
          }
        </figure>
      </docs-example>

      <docs-section
        id="caption"
        level="3"
        heading="With a caption"
        description="A caption tells everyone what the images are, including people who only ever see the first one."
      >
        <docs-example label="lake.html" [code]="captionCode">
          <figure class="captioned">
            <div zdHoverGallery class="product">
              @for (time of times; track time.label) {
                <img [src]="time.src" [alt]="time.label" width="768" height="512" loading="lazy" />
              }
            </div>
            <figcaption>One view, morning and sunset. Hover to compare.</figcaption>
          </figure>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .product {
      inline-size: min(22rem, 100%);
      aspect-ratio: 4 / 3;
      margin: 0;
      border-radius: var(--docs-radius-lg);
    }

    .product img {
      object-fit: cover;
    }

    .captioned {
      display: grid;
      justify-items: center;
      gap: var(--docs-space-2);
      margin: 0;
    }

    figcaption {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class HoverGalleryPageComponent {
  protected readonly reference = hoverGalleryReference;
  protected readonly galleryCode = galleryCode;
  protected readonly captionCode = captionCode;

  protected readonly views = [
    { label: 'Studio sneaker, side view', src: 'images/showcase/sneaker-side.webp' },
    { label: 'The same sneaker, angled view', src: 'images/showcase/sneaker-angle.webp' },
  ] as const;

  protected readonly times = [
    { label: 'Mountain lake in the morning', src: 'images/showcase/lake-morning.webp' },
    { label: 'The same lake at sunset', src: 'images/showcase/lake-sunset.webp' },
  ] as const;
}
