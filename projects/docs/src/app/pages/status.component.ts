import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdStatus } from '@pranxy/zordon-ui/status';

import { colorOf, sizeOf } from '../content/form-controls.content';
import {
  pulseCode,
  statusPlaygroundControls,
  statusPlaygroundSnippet,
  statusReference,
  textFiles,
} from '../content/status.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
} from '../ui';

/** Loads the daisyUI classes Status emits, only while this page is in use. */
@Component({
  selector: 'docs-status-daisy-styles',
  template: '',
  styleUrl: './styles/status.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class StatusDaisyStylesComponent {}

@Component({
  selector: 'docs-status-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    StatusDaisyStylesComponent,
    ZdStatus,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-status-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Status"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <p class="line">
            <span
              zdStatus
              aria-hidden="true"
              [color]="colorOf(values)"
              [size]="sizeOf(values)"
            ></span>
            Build agent · {{ colorOf(values) ?? 'default' }}
          </p>
        </ng-template>
      </docs-playground>

      <docs-section
        id="text"
        level="3"
        heading="With text"
        description="Each dot sits beside the words that state it, so it is hidden from assistive technology."
      >
        <docs-example label="services.html" [files]="textFiles">
          <ul class="services" aria-label="Service health">
            @for (service of services; track service.name) {
              <li class="line">
                <span zdStatus aria-hidden="true" [color]="service.color"></span>
                {{ service.name }} · {{ service.state }}
              </li>
            }
          </ul>
        </docs-example>
      </docs-section>

      <docs-section
        id="pulse"
        level="3"
        heading="Pulse"
        description="Two stacked dots, the back one animated by page CSS. It stays still when the system asks for reduced motion."
      >
        <docs-example label="recording.html" [code]="pulseCode">
          <p class="line">
            <span class="pulse" aria-hidden="true">
              <span zdStatus color="error"></span>
              <span zdStatus color="error"></span>
            </span>
            Recording
          </p>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .line {
      display: flex;
      align-items: center;
      gap: var(--docs-space-2);
      margin: 0;
    }

    .services {
      display: grid;
      gap: var(--docs-space-2);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .pulse {
      display: inline-grid;
    }

    .pulse > * {
      grid-area: 1 / 1;
    }

    @media (prefers-reduced-motion: no-preference) {
      .pulse > :first-child {
        animation: docs-status-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
    }

    @keyframes docs-status-ping {
      75%,
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }
  `,
})
export class StatusPageComponent {
  protected readonly reference = statusReference;
  protected readonly controls = statusPlaygroundControls;
  protected readonly snippet = statusPlaygroundSnippet;
  protected readonly textFiles = textFiles;
  protected readonly pulseCode = pulseCode;
  protected readonly colorOf = colorOf;
  protected readonly sizeOf = sizeOf;

  protected readonly services = [
    { name: 'API', state: 'Operational', color: 'success' },
    { name: 'Search', state: 'Degraded', color: 'warning' },
    { name: 'Email', state: 'Down', color: 'error' },
  ] as const;
}
