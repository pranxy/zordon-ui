import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdSteps, type ZdOrientation, type ZdStep } from '@pranxy/zordon-ui/steps';

import { colorOf, flagOf } from '../content/form-controls.content';
import {
  statesCode,
  stepsPlaygroundControls,
  stepsPlaygroundSnippet,
  stepsReference,
  wizardFiles,
} from '../content/steps.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's step color modifiers, only while this page is in use. */
@Component({
  selector: 'docs-steps-daisy-styles',
  template: '',
  styleUrl: './styles/steps.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class StepsDaisyStylesComponent {}

type WizardStep = 'details' | 'delivery' | 'review';

@Component({
  selector: 'docs-steps-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    StepsDaisyStylesComponent,
    ZdButton,
    ZdSteps,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-steps-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Steps"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <zd-steps
            class="wide"
            label="Order progress"
            [items]="orderSteps"
            [orientation]="orientationOf(values)"
            [color]="colorOf(values) ?? 'primary'"
            [interactive]="flagOf(values, 'interactive')"
            [(currentId)]="orderStep"
          />
        </ng-template>
      </docs-playground>

      <docs-section
        id="wizard"
        level="3"
        heading="Wizard"
        description="Linear and interactive: you can go back, but forward only past completed steps. Continue marks the step complete, moves on and focuses the next panel."
      >
        <docs-example label="checkout" [files]="wizardFiles">
          <div class="docs-stack wide">
            <zd-steps
              label="Checkout"
              interactive
              linear
              [items]="wizardSteps()"
              [(currentId)]="wizardStep"
            />
            @for (panel of panels; track panel.id) {
              <section
                class="panel"
                [id]="'docs-steps-' + panel.id"
                [attr.aria-labelledby]="'docs-steps-' + panel.id + '-heading'"
                [hidden]="wizardStep() !== panel.id"
              >
                <h4 tabindex="-1" [id]="'docs-steps-' + panel.id + '-heading'">
                  {{ panel.label }}
                </h4>
                @if (panel.next) {
                  <button
                    zdButton
                    type="button"
                    size="sm"
                    color="primary"
                    (click)="continueTo(panel.id, panel.next)"
                  >
                    Continue
                  </button>
                } @else {
                  <p class="docs-status" role="status">Ready to place the order.</p>
                }
              </section>
            }
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="states"
        level="3"
        heading="States"
        description="Complete, error and unavailable steps each show text as well as color. Read-only trackers need no buttons."
      >
        <docs-example label="states.ts" language="ts" [code]="statesCode">
          <zd-steps class="wide" label="Release" currentId="scan" [items]="releaseSteps" />
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .wide {
      inline-size: 100%;
    }

    .panel {
      display: grid;
      justify-items: start;
      gap: var(--docs-space-3);
      padding: var(--docs-space-4);
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
    }

    .panel[hidden] {
      display: none;
    }

    .panel h4 {
      margin: 0;
    }
  `,
})
export class StepsPageComponent {
  protected readonly reference = stepsReference;
  protected readonly controls = stepsPlaygroundControls;
  protected readonly snippet = stepsPlaygroundSnippet;
  protected readonly wizardFiles = wizardFiles;
  protected readonly statesCode = statesCode;
  protected readonly colorOf = colorOf;
  protected readonly flagOf = flagOf;

  protected readonly orderSteps: readonly ZdStep[] = [
    { id: 'ordered', label: 'Ordered', state: 'complete' },
    { id: 'paid', label: 'Paid', state: 'complete' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];
  protected readonly orderStep = signal<string | null>('shipped');

  protected readonly panels: readonly { id: WizardStep; label: string; next?: WizardStep }[] = [
    { id: 'details', label: 'Your details', next: 'delivery' },
    { id: 'delivery', label: 'Delivery', next: 'review' },
    { id: 'review', label: 'Review' },
  ];
  private readonly document = inject(DOCUMENT);
  protected readonly wizardStep = signal<string | null>('details');
  private readonly done = signal<ReadonlySet<string>>(new Set());
  protected readonly wizardSteps = computed<readonly ZdStep[]>(() =>
    this.panels.map(panel => ({
      id: panel.id,
      label: panel.label,
      controls: 'docs-steps-' + panel.id,
      ...(this.done().has(panel.id) ? { state: 'complete' as const } : {}),
    })),
  );

  protected readonly releaseSteps: readonly ZdStep[] = [
    { id: 'upload', label: 'Upload', state: 'complete' },
    { id: 'scan', label: 'Virus scan', description: 'Blocked file found', state: 'error' },
    { id: 'publish', label: 'Publish', disabled: true },
  ];

  protected continueTo(from: WizardStep, to: WizardStep): void {
    this.done.update(done => new Set(done).add(from));
    this.wizardStep.set(to);
    // Focus the new panel's heading once it is visible.
    setTimeout(() => this.document.getElementById(`docs-steps-${to}-heading`)?.focus());
  }

  protected orientationOf(values: PlaygroundValues): ZdOrientation {
    return values['orientation'] as ZdOrientation;
  }
}
