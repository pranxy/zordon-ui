import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  inject,
  signal,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdLoading, type ZdLoadingVariant } from '@pranxy/zordon-ui/loading';

import { colorOf, flagOf, sizeOf } from '../content/form-controls.content';
import {
  customCode,
  delayFiles,
  loadingPlaygroundControls,
  loadingPlaygroundSnippet,
  loadingReference,
  loadingSizes,
  loadingVariants,
  overlayCode,
  variantsCode,
} from '../content/loading.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/**
 * Loads the daisyUI Loading glyphs and sizes, only while this page is in use. The glyphs carry
 * large SVG masks, so they are split to keep each stylesheet within its budget.
 */
@Component({
  selector: 'docs-loading-daisy-styles',
  template: '',
  styleUrls: [
    './styles/loading.daisy.css',
    './styles/loading-bars.daisy.css',
    './styles/loading-shapes.daisy.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
class LoadingDaisyStylesComponent {}

@Component({
  selector: 'docs-loading-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    LoadingDaisyStylesComponent,
    ZdButton,
    ZdLoading,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-loading-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Loading"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-loading
            label="Loading results"
            [variant]="variantOf(values)"
            [size]="sizeOf(values)"
            [color]="colorOf(values)"
            [showLabel]="flagOf(values, 'showLabel')"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="variants"
        level="3"
        heading="Variants and sizes"
        description="Six daisyUI animations and five sizes. Each loader here has its own status label."
      >
        <docs-example label="variants.html" [code]="variantsCode">
          <div class="docs-stack">
            <div class="docs-cluster row">
              @for (variant of variants; track variant) {
                <zd-loading [variant]="variant" [label]="'Loading (' + variant + ')'" />
              }
            </div>
            <div class="docs-cluster row">
              @for (size of sizes; track size) {
                <zd-loading [size]="size" color="primary" [label]="'Loading (' + size + ')'" />
              }
            </div>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="delay"
        level="3"
        heading="Delayed feedback"
        description="Busy state starts with the work; the indicator waits 400ms. The loader sits outside the busy region so its status is announced."
      >
        <docs-example label="results" [files]="delayFiles">
          <div class="docs-stack results">
            <div class="docs-cluster">
              <button
                zdButton
                type="button"
                size="sm"
                color="primary"
                [attr.aria-disabled]="busy()"
                (click)="search()"
              >
                Run search
              </button>
              <zd-loading [active]="busy()" [delay]="400" label="Searching" showLabel />
            </div>
            <section aria-label="Results" class="docs-status" [attr.aria-busy]="busy()">
              {{ busy() ? 'Waiting for results…' : searches() ? '12 results' : 'No search yet' }}
            </section>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="overlay"
        level="3"
        heading="Overlay"
        description="Overlay centers the indicator over the nearest positioned ancestor. It is only a position: the content underneath stays usable."
      >
        <docs-example label="overlay.html" [code]="overlayCode">
          <div class="docs-stack overlay">
            <div class="panel">
              <p>Weekly signups</p>
              <strong>1,284</strong>
              <zd-loading
                layout="overlay"
                label="Refreshing chart"
                showLabel
                [active]="refreshing()"
              />
            </div>
            <button
              zdButton
              type="button"
              size="sm"
              [attr.aria-pressed]="refreshing()"
              (click)="refreshing.set(!refreshing())"
            >
              Refreshing
            </button>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="custom"
        level="3"
        heading="Custom artwork"
        description="Project one marked element and own its animation. It is hidden under reduced motion, like the built-in glyphs."
      >
        <docs-example label="custom.html" [code]="customCode">
          <zd-loading variant="custom" size="lg" label="Preparing export" showLabel>
            <span zdLoadingCustom class="custom">◇</span>
          </zd-loading>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .row {
      --gap: var(--docs-space-5);
      justify-content: center;
    }

    .results {
      min-inline-size: 16rem;
    }

    .overlay {
      justify-items: center;
    }

    .panel {
      position: relative;
      display: grid;
      align-content: start;
      gap: var(--docs-space-1);
      inline-size: min(20rem, 70vw);
      block-size: 8rem;
      padding: var(--docs-space-3) var(--docs-space-4);
      box-sizing: border-box;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
    }

    .panel p {
      margin: 0;
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }

    .panel strong {
      font-size: 1.5rem;
    }

    /* The overlay sits in the lower part, clear of the figures. */
    .panel zd-loading {
      inset-block-start: 3rem;
    }

    .custom {
      display: inline-block;
      font-size: 1.5rem;
      line-height: 1;
      animation: docs-loading-custom 1.2s linear infinite;
    }

    @keyframes docs-loading-custom {
      to {
        rotate: 360deg;
      }
    }
  `,
})
export class LoadingPageComponent {
  protected readonly reference = loadingReference;
  protected readonly controls = loadingPlaygroundControls;
  protected readonly snippet = loadingPlaygroundSnippet;
  protected readonly variants = loadingVariants;
  protected readonly sizes = loadingSizes;
  protected readonly variantsCode = variantsCode;
  protected readonly delayFiles = delayFiles;
  protected readonly overlayCode = overlayCode;
  protected readonly customCode = customCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;
  protected readonly flagOf = flagOf;

  protected readonly busy = signal(false);
  protected readonly searches = signal(0);
  protected readonly refreshing = signal(true);
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected variantOf(values: PlaygroundValues): ZdLoadingVariant {
    return values['variant'] as ZdLoadingVariant;
  }

  protected search(): void {
    if (this.busy()) return;
    this.busy.set(true);
    this.timer = setTimeout(() => {
      this.busy.set(false);
      this.searches.update(count => count + 1);
    }, 2000);
  }
}
