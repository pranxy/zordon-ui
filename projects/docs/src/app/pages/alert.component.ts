import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import {
  ZdAlert,
  type ZdAlertColor,
  type ZdAlertDirection,
  type ZdAlertDismissReason,
  type ZdAlertVariant,
} from '@pranxy/zordon-ui/alert';
import { ZdButton } from '@pranxy/zordon-ui/button';

import {
  actionsCode,
  alertColors,
  alertPlaygroundControls,
  alertPlaygroundSnippet,
  alertReference,
  alertVariants,
  autoDismissCode,
  colorsCode,
  dismissalFiles,
} from '../content/alert.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Alert emits, only while this page is in use. */
@Component({
  selector: 'docs-alert-daisy-styles',
  template: '',
  styleUrl: './styles/alert.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class AlertDaisyStylesComponent {}

@Component({
  selector: 'docs-alert-page',
  imports: [
    AlertDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdAlert,
    ZdButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-alert-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Alert"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="docs-stack wide">
            <zd-alert
              [color]="colorOf(values)"
              [variant]="variantOf(values)"
              [direction]="directionOf(values)"
              [dismissible]="values['dismissible'] === true"
              [open]="playgroundOpen()"
              (openChange)="playgroundOpen.set($event)"
            >
              <span zdAlertIcon class="icon">ⓘ</span>
              <strong zdAlertTitle>Update available</strong>
              <p>Save your work before installing.</p>
            </zd-alert>
            @if (!playgroundOpen()) {
              <button zdButton type="button" size="sm" (click)="playgroundOpen.set(true)">
                Show the alert again
              </button>
            }
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="colors"
        level="3"
        heading="Colors and variants"
        description="Four status colors, each filled, soft, outline or dash. Pair color with words: the title should say what happened."
      >
        <docs-example label="colors.html" [code]="colorsCode">
          <div class="docs-stack wide">
            @for (color of colors; track color) {
              <zd-alert [color]="color" direction="horizontal">
                <span>{{ messages[color] }}</span>
              </zd-alert>
            }
            @for (variant of variants; track variant) {
              <zd-alert color="success" [variant]="variant" direction="horizontal">
                <span>Success, {{ variant }}.</span>
              </zd-alert>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="dismissal"
        level="3"
        heading="Dismissal"
        description="The close button asks; you answer by setting open. Ignore openChange and the alert stays."
      >
        <docs-example label="saved" [files]="dismissalFiles">
          <div class="docs-stack wide">
            <zd-alert
              color="success"
              variant="soft"
              dismissible
              dismissLabel="Dismiss saved message"
              [open]="savedOpen()"
              (openChange)="savedOpen.set($event)"
              (dismissRequested)="savedReason.set($event)"
            >
              <strong zdAlertTitle>Changes saved</strong>
              <p>Your profile is up to date.</p>
            </zd-alert>
            @if (!savedOpen()) {
              <div class="docs-cluster">
                <button zdButton type="button" size="sm" (click)="savedOpen.set(true)">
                  Show again
                </button>
                <p class="docs-status" role="status">Closed by: {{ savedReason() }}</p>
              </div>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="auto-dismiss"
        level="3"
        heading="Auto-dismiss"
        description="A polite, self-closing confirmation. The countdown pauses while the pointer is over it, focus is inside it, or the tab is hidden."
      >
        <docs-example label="copied.html" [code]="autoDismissCode">
          <div class="docs-stack wide">
            <button zdButton type="button" size="sm" color="primary" (click)="copied.set(true)">
              Copy link
            </button>
            <zd-alert
              color="info"
              announcement="polite"
              dismissible
              dismissLabel="Dismiss copied message"
              [autoDismiss]="6000"
              [open]="copied()"
              (openChange)="copied.set($event)"
            >
              <p>Link copied to the clipboard.</p>
            </zd-alert>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="actions"
        level="3"
        heading="Actions and details"
        description="Actions are native buttons or links you own. A native details element keeps secondary information one click away, with or without JavaScript."
      >
        <docs-example label="storage.html" [code]="actionsCode">
          <zd-alert color="warning" variant="outline" direction="horizontal" class="wide">
            <span zdAlertIcon class="icon">⚠</span>
            <strong zdAlertTitle>Storage almost full</strong>
            <p>You have used 9.2 GB of 10 GB.</p>
            <details zdAlertDetails>
              <summary>What counts toward storage?</summary>
              <p>Files, attachments and version history.</p>
            </details>
            <div zdAlertActions>
              <button zdButton type="button" size="sm">Manage storage</button>
            </div>
          </zd-alert>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    /* The contrast fix shown under Customization (alertContrastCss). */
    zd-alert:is(.alert-soft, .alert-outline, .alert-dash) {
      color: var(--color-base-content);
    }

    .wide {
      inline-size: 100%;
    }

    .icon {
      font-size: 1.25rem;
      line-height: 1;
    }

    zd-alert p {
      margin: 0;
    }

    summary {
      display: list-item;
      cursor: pointer;
    }
  `,
})
export class AlertPageComponent {
  protected readonly reference = alertReference;
  protected readonly controls = alertPlaygroundControls;
  protected readonly snippet = alertPlaygroundSnippet;
  protected readonly colors = alertColors;
  protected readonly variants = alertVariants;
  protected readonly colorsCode = colorsCode;
  protected readonly dismissalFiles = dismissalFiles;
  protected readonly autoDismissCode = autoDismissCode;
  protected readonly actionsCode = actionsCode;
  protected readonly messages: Record<ZdAlertColor, string> = {
    info: 'Info: a new version is available.',
    success: 'Success: your changes were saved.',
    warning: 'Warning: your trial ends in 3 days.',
    error: 'Error: the payment was declined.',
  };

  protected readonly playgroundOpen = signal(true);
  protected readonly savedOpen = signal(true);
  protected readonly savedReason = signal<ZdAlertDismissReason | null>(null);
  protected readonly copied = signal(false);

  protected colorOf(values: PlaygroundValues): ZdAlertColor | undefined {
    const value = values['color'];
    return value === 'default' ? undefined : (value as ZdAlertColor);
  }

  protected variantOf(values: PlaygroundValues): ZdAlertVariant | undefined {
    const value = values['variant'];
    return value === 'default' ? undefined : (value as ZdAlertVariant);
  }

  protected directionOf(values: PlaygroundValues): ZdAlertDirection {
    return values['direction'] as ZdAlertDirection;
  }
}
