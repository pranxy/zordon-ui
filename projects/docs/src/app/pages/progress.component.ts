import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdProgress, type ZdProgressFormatter } from '@pranxy/zordon-ui/progress';

import { colorOf } from '../content/form-controls.content';
import {
  colorsCode,
  indeterminateCode,
  progressPlaygroundControls,
  progressPlaygroundSnippet,
  progressReference,
  progressValueOf,
  uploadFiles,
} from '../content/progress.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Progress emits, only while this page is in use. */
@Component({
  selector: 'docs-progress-daisy-styles',
  template: '',
  styleUrl: './styles/progress.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class ProgressDaisyStylesComponent {}

@Component({
  selector: 'docs-progress-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ProgressDaisyStylesComponent,
    ZdButton,
    ZdProgress,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-progress-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Progress"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-progress
            class="bar"
            label="Upload"
            [value]="valueOf(values['[value]'])"
            [color]="colorOf(values)"
            [showLabel]="values['[showLabel]'] === 'true'"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="upload"
        level="3"
        heading="File upload"
        description="Value and max are in megabytes; the formatter turns them into words. The lighter buffer shows data read but not yet sent."
      >
        <docs-example label="upload" [files]="uploadFiles">
          <div class="docs-stack bar">
            <zd-progress
              #upload
              label="Upload"
              color="primary"
              [value]="sent()"
              [buffer]="sent() + 50"
              [max]="200"
              [format]="megabytes"
            />
            <div class="docs-cluster">
              <button
                zdButton
                type="button"
                size="sm"
                color="primary"
                [disabled]="upload.complete()"
                (click)="sent.set(sent() + 50)"
              >
                Send 50 MB
              </button>
              <button zdButton type="button" size="sm" variant="outline" (click)="sent.set(0)">
                Reset
              </button>
              <p class="docs-status" role="status">
                {{ upload.complete() ? 'Upload complete' : 'Upload pending' }}
              </p>
            </div>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="indeterminate"
        level="3"
        heading="Unknown total"
        description="Leave value unset while the total is unknown. Turn animation off where movement would distract."
      >
        <docs-example label="indeterminate.html" [code]="indeterminateCode">
          <div class="docs-stack bar">
            <zd-progress label="Preparing export" />
            <zd-progress label="Preparing export" [animated]="false" />
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="colors"
        level="3"
        heading="Colors"
        description="Theme roles for the bar. The text above it keeps the page’s text color."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          <div class="docs-stack bar">
            <zd-progress label="Neutral" color="neutral" [value]="40" />
            <zd-progress label="Success" color="success" [value]="60" />
            <zd-progress label="Warning" color="warning" [value]="80" />
            <zd-progress label="Error" color="error" [value]="100" [showLabel]="false" />
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .bar {
      inline-size: min(24rem, 100%);
    }
  `,
})
export class ProgressPageComponent {
  protected readonly reference = progressReference;
  protected readonly controls = progressPlaygroundControls;
  protected readonly snippet = progressPlaygroundSnippet;
  protected readonly uploadFiles = uploadFiles;
  protected readonly indeterminateCode = indeterminateCode;
  protected readonly colorsCode = colorsCode;
  protected readonly colorOf = colorOf;
  protected readonly valueOf = progressValueOf;

  protected readonly sent = signal(0);
  protected readonly megabytes: ZdProgressFormatter = state =>
    state.value === null ? 'Waiting for total' : `${state.value} of ${state.max} MB`;
}
