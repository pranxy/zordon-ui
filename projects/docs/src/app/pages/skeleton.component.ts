import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdSkeleton,
  ZdSkeletonRegion,
  type ZdSkeletonAnimation,
  type ZdSkeletonPreset,
  type ZdSkeletonShape,
} from '@pranxy/zordon-ui/skeleton';

import {
  presetsCode,
  regionFiles,
  shapesCode,
  skeletonPlaygroundControls,
  skeletonPlaygroundSnippet,
  skeletonReference,
} from '../content/skeleton.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's skeleton class, only while this page is in use. */
@Component({
  selector: 'docs-skeleton-daisy-styles',
  template: '',
  styleUrl: './styles/skeleton.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class SkeletonDaisyStylesComponent {}

@Component({
  selector: 'docs-skeleton-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    SkeletonDaisyStylesComponent,
    ZdButton,
    ZdSkeleton,
    ZdSkeletonRegion,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-skeleton-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Skeleton"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-skeleton
            class="card"
            [preset]="presetOf(values)"
            [shape]="shapeOf(values)"
            [animation]="animationOf(values)"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="loading-region"
        level="3"
        heading="Loading region"
        description="The status sits outside the busy region; the region and the skeleton share one loading signal."
      >
        <docs-example label="profile" [files]="regionFiles">
          <div class="docs-stack card">
            <div class="docs-cluster">
              <button
                zdButton
                type="button"
                size="sm"
                [attr.aria-pressed]="loading()"
                (click)="loading.set(!loading())"
              >
                Loading
              </button>
              <p class="docs-status" role="status">
                {{ loading() ? 'Loading profile' : 'Profile ready' }}
              </p>
            </div>
            <section aria-label="Profile" class="profile" [zdSkeletonRegion]="loading()">
              <zd-skeleton preset="avatar-text" [lines]="2" [active]="loading()" />
              @if (!loading()) {
                <span class="avatar" aria-hidden="true">AL</span>
                <div>
                  <h3>Ada Lovelace</h3>
                  <p>Analyst, London</p>
                </div>
              }
            </section>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="shapes"
        level="3"
        heading="Shapes"
        description="Circles, rounded rectangles, clip-path shapes and ragged text lines. Set both width and height for a circle."
      >
        <docs-example label="shapes.html" [code]="shapesCode">
          <div class="docs-cluster shapes">
            <zd-skeleton shape="circle" width="4rem" height="4rem" />
            <zd-skeleton width="8rem" height="4rem" radius="1rem" />
            <zd-skeleton
              shape="custom"
              width="5rem"
              height="4rem"
              clipPath="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
            />
            <zd-skeleton shape="text" width="12rem" lastLineWidth="40%" [lines]="3" />
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="presets"
        level="3"
        heading="Presets"
        description="A paragraph and a card with a slower pulse. height sets each line, not the whole preset."
      >
        <docs-example label="presets.html" [code]="presetsCode">
          <div class="docs-cluster presets">
            <zd-skeleton preset="paragraph" lastLineWidth="80%" [lines]="4" />
            <zd-skeleton preset="card" animation="pulse" [speed]="2400" />
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .card {
      inline-size: min(20rem, 100%);
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      min-block-size: 4rem;
    }

    .profile h3,
    .profile p {
      margin: 0;
    }

    .avatar {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      inline-size: 3rem;
      block-size: 3rem;
      border-radius: 50%;
      border: 1px solid var(--docs-border-strong);
      background: var(--docs-surface);
      font-weight: var(--docs-weight-bold);
    }

    .shapes {
      --gap: var(--docs-space-5);
      justify-content: center;
    }

    .presets {
      --gap: var(--docs-space-6);
      align-items: start;
      inline-size: 100%;
    }

    .presets zd-skeleton {
      flex: 1 1 14rem;
    }
  `,
})
export class SkeletonPageComponent {
  protected readonly reference = skeletonReference;
  protected readonly controls = skeletonPlaygroundControls;
  protected readonly snippet = skeletonPlaygroundSnippet;
  protected readonly regionFiles = regionFiles;
  protected readonly shapesCode = shapesCode;
  protected readonly presetsCode = presetsCode;

  protected readonly loading = signal(true);

  protected presetOf(values: PlaygroundValues): ZdSkeletonPreset {
    return values['preset'] as ZdSkeletonPreset;
  }

  protected shapeOf(values: PlaygroundValues): ZdSkeletonShape {
    return values['shape'] as ZdSkeletonShape;
  }

  protected animationOf(values: PlaygroundValues): ZdSkeletonAnimation {
    return values['animation'] as ZdSkeletonAnimation;
  }
}
