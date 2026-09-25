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
 * Hover Gallery has no inputs, so the playground is a live example with its code. The pictures are
 * drawn with CSS gradients, standing in for your images.
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
            <div class="view" [class]="view.tone" role="img" [attr.aria-label]="view.label">
              <span aria-hidden="true">{{ view.short }}</span>
            </div>
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
                <div class="view" [class]="time.tone" role="img" [attr.aria-label]="time.label">
                  <span aria-hidden="true">{{ time.short }}</span>
                </div>
              }
            </div>
            <figcaption>One view, three times of day. Hover to compare.</figcaption>
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

    .view {
      display: grid;
      place-items: center;
      font-size: var(--docs-text-h3);
      font-weight: var(--docs-weight-bold);
      color: var(--color-primary-content);
    }

    .primary {
      background: linear-gradient(160deg, var(--color-primary), var(--color-secondary));
    }

    .info {
      background: linear-gradient(160deg, var(--color-info), var(--color-primary));
    }

    .accent {
      background: linear-gradient(160deg, var(--color-accent), var(--color-info));
    }

    .neutral {
      background: linear-gradient(160deg, var(--color-neutral), var(--color-primary));
      color: var(--color-neutral-content);
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
    { label: 'Blue trainer, front view', short: 'Front', tone: 'view primary' },
    { label: 'Blue trainer, side view', short: 'Side', tone: 'view info' },
    { label: 'Blue trainer, sole', short: 'Sole', tone: 'view accent' },
    { label: 'Blue trainer, heel', short: 'Heel', tone: 'view neutral' },
  ] as const;

  protected readonly times = [
    { label: 'The lake at dawn', short: 'Dawn', tone: 'view accent' },
    { label: 'The lake at noon', short: 'Noon', tone: 'view info' },
    { label: 'The lake at dusk', short: 'Dusk', tone: 'view primary' },
  ] as const;
}
