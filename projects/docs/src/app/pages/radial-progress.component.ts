import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdRadialProgress,
  type ZdRadialProgressFormatter,
  type ZdRadialProgressThreshold,
} from '@pranxy/zordon-ui/radial-progress';

import { colorOf } from '../content/form-controls.content';
import { progressValueOf } from '../content/progress.content';
import {
  centerCode,
  formatFiles,
  radialPlaygroundControls,
  radialPlaygroundSnippet,
  radialProgressReference,
  thresholdsFiles,
} from '../content/radial-progress.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads daisyUI's radial-progress class, only while this page is in use. */
@Component({
  selector: 'docs-radial-progress-daisy-styles',
  template: '',
  styleUrl: './styles/radial-progress.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class RadialProgressDaisyStylesComponent {}

@Component({
  selector: 'docs-radial-progress-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    RadialProgressDaisyStylesComponent,
    ZdButton,
    ZdRadialProgress,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-radial-progress-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Radial Progress"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-radial-progress
            label="Download"
            [value]="valueOf(values['[value]'])"
            [color]="colorOf(values)"
            [size]="$any(values['size'])"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="thresholds"
        level="3"
        heading="Thresholds"
        description="The ring turns from error to warning at 30% and to success at 70%. The value text says the same thing without color."
      >
        <docs-example label="battery" [files]="thresholdsFiles">
          <div class="docs-cluster">
            <zd-radial-progress
              label="Battery"
              color="error"
              [value]="charge()"
              [thresholds]="thresholds"
            />
            <div class="docs-cluster" role="group" aria-label="Battery charge">
              <button
                zdButton
                type="button"
                size="sm"
                variant="outline"
                [disabled]="charge() === 0"
                (click)="charge.set(charge() - 10)"
              >
                −10%
              </button>
              <button
                zdButton
                type="button"
                size="sm"
                variant="outline"
                [disabled]="charge() === 100"
                (click)="charge.set(charge() + 10)"
              >
                +10%
              </button>
            </div>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="center-content"
        level="3"
        heading="Center content"
        description="Project an icon and a short label. They are visual only; the name and value still come from label and format."
      >
        <docs-example label="archive.html" [code]="centerCode">
          <zd-radial-progress label="Archive" [value]="100" color="success">
            <span zdRadialProgressIcon class="icon">✓</span>
            <bdi zdRadialProgressLabel>Done</bdi>
          </zd-radial-progress>
        </docs-example>
      </docs-section>

      <docs-section
        id="format"
        level="3"
        heading="Custom text"
        description="max can be any positive total. The formatter turns the state into words for both the center and screen readers."
      >
        <docs-example label="files" [files]="formatFiles">
          <zd-radial-progress
            label="Files"
            size="7rem"
            color="primary"
            [value]="12"
            [max]="40"
            [format]="files"
          />
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .icon {
      font-size: 1.25rem;
      line-height: 1;
    }
  `,
})
export class RadialProgressPageComponent {
  protected readonly reference = radialProgressReference;
  protected readonly controls = radialPlaygroundControls;
  protected readonly snippet = radialPlaygroundSnippet;
  protected readonly thresholdsFiles = thresholdsFiles;
  protected readonly centerCode = centerCode;
  protected readonly formatFiles = formatFiles;
  protected readonly colorOf = colorOf;
  protected readonly valueOf = progressValueOf;

  protected readonly charge = signal(20);
  protected readonly thresholds: readonly ZdRadialProgressThreshold[] = [
    { at: 30, color: 'warning' },
    { at: 70, color: 'success' },
  ];
  protected readonly files: ZdRadialProgressFormatter = state =>
    state.value === null ? 'Counting files' : `${state.value} of ${state.max} files`;
}
