import { ChangeDetectionStrategy, Component, ViewEncapsulation, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdSwap,
  ZdSwapIndeterminate,
  ZdSwapInput,
  ZdSwapOff,
  ZdSwapOn,
  type ZdSwapEffect,
} from '@pranxy/zordon-ui/swap';

import {
  checkboxCode,
  effectsCode,
  indeterminateCode,
  swapAccessibilityNotes,
  swapCustomCode,
  swapEffects,
  swapFacts,
  swapImportCode,
  swapInputs,
  swapParts,
  swapPlaygroundControls,
  swapPlaygroundSnippet,
  swapStylesCode,
  swapTypesCode,
  toggleFiles,
} from '../content/swap.content';
import {
  DocsApiTableComponent,
  DocsCalloutComponent,
  DocsCodeBlockComponent,
  DocsExampleComponent,
  DocsFeatureGridComponent,
  DocsMetaGridComponent,
  DocsPageHeaderComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's swap classes and the library's supplemental stylesheet with this page. */
@Component({
  selector: 'docs-swap-daisy-styles',
  template: '',
  styleUrls: ['./styles/swap.daisy.css', '../../../../components/swap/src/swap.css'],
  encapsulation: ViewEncapsulation.None,
})
class SwapDaisyStylesComponent {}

type SkyState = 'day' | 'night' | 'unknown';

@Component({
  selector: 'docs-swap-page',
  imports: [
    DocsApiTableComponent,
    DocsCalloutComponent,
    DocsCodeBlockComponent,
    DocsExampleComponent,
    DocsFeatureGridComponent,
    DocsMetaGridComponent,
    DocsPageHeaderComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsSectionComponent,
    ReactiveFormsModule,
    SwapDaisyStylesComponent,
    ZdButton,
    ZdSwap,
    ZdSwapIndeterminate,
    ZdSwapInput,
    ZdSwapOff,
    ZdSwapOn,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-swap-daisy-styles />
    <article class="docs-prose" aria-labelledby="page-title">
      <docs-page-header
        eyebrow="Actions"
        heading="Swap"
        maturity="preview"
        description="Two or three decorative states around a native checkbox or toggle button. The native control owns focus, activation and Forms; Swap shows which state it is in."
      >
        <docs-meta-grid [items]="facts" />
      </docs-page-header>

      <docs-callout variant="note">
        <strong>Preview.</strong> Automated verification is complete; manual assistive-technology
        review is pending.
      </docs-callout>

      <docs-section
        id="install"
        heading="Install and import"
        description="Import the directives you use. Swap also ships a small stylesheet; load it after daisyUI."
      >
        <docs-code-block
          label="Import"
          language="ts"
          copyLabel="Copy import code"
          [code]="importCode"
        />
        <docs-code-block label="src/styles.css" language="css" [code]="stylesCode" />
      </docs-section>

      <docs-section
        id="playground"
        heading="Playground"
        description="Click the icon or focus it and press Space. The checkbox is real."
      >
        <docs-playground label="Swap" [controls]="controls" [snippet]="snippet">
          <ng-template docsPlaygroundPreview let-values>
            <label
              zdSwap
              class="icon"
              [effect]="effect(values)"
              [readOnly]="values['readOnly'] === true"
            >
              <input type="checkbox" zdSwapInput aria-label="Dark mode" />
              <span zdSwapOn>☾</span>
              <span zdSwapOff>☀</span>
            </label>
          </ng-template>
        </docs-playground>
      </docs-section>

      <docs-section id="examples" heading="Examples">
        <docs-section
          id="checkbox"
          level="3"
          heading="Checkbox"
          description="The checkbox keeps its checked state, name, value and validation. Reactive and template-driven Forms use Angular's native checkbox accessor."
        >
          <docs-example label="notifications.html" [code]="checkboxCode">
            <label zdSwap effect="rotate" class="pill">
              <input
                type="checkbox"
                zdSwapInput
                [formControl]="notifications"
                aria-label="Notifications"
              />
              <span zdSwapOn>On</span>
              <span zdSwapOff>Off</span>
            </label>
            <span class="docs-muted status" role="status">
              notifications.value: {{ notificationsValue() }}
            </span>
          </docs-example>
        </docs-section>

        <docs-section
          id="toggle-button"
          level="3"
          heading="Toggle button"
          description="On a button, activeChange is a request: update active to accept it. The button reports aria-pressed."
        >
          <docs-example label="mute" [files]="toggleFiles">
            <button
              type="button"
              zdSwap
              effect="flip"
              class="pill"
              aria-label="Mute"
              [active]="muted()"
              (activeChange)="muted.set($event)"
            >
              <span zdSwapOn>Muted</span>
              <span zdSwapOff>Sound on</span>
            </button>
          </docs-example>
        </docs-section>

        <docs-section
          id="indeterminate"
          level="3"
          heading="Indeterminate"
          description="A manual root only displays state. Here separate buttons change it and a sentence states it, because the Swap itself adds no role."
        >
          <docs-example label="sky.html" [code]="indeterminateCode">
            <div class="docs-stack center">
              <div
                zdSwap
                class="pill"
                [active]="sky() === 'day'"
                [indeterminate]="sky() === 'unknown'"
              >
                <span zdSwapOn>Day</span>
                <span zdSwapOff>Night</span>
                <span zdSwapIndeterminate>Unknown</span>
              </div>
              <div class="docs-cluster" role="group" aria-label="Sky state">
                @for (state of skyStates; track state) {
                  <button
                    zdButton
                    type="button"
                    size="sm"
                    color="primary"
                    [variant]="sky() === state ? undefined : 'outline'"
                    [attr.aria-pressed]="sky() === state"
                    (click)="sky.set(state)"
                  >
                    {{ state }}
                  </button>
                }
              </div>
              <p class="docs-muted status">Sky: {{ sky() }}</p>
            </div>
          </docs-example>
        </docs-section>

        <docs-section
          id="effects"
          level="3"
          heading="Effects"
          description="Fade is the default. Rotate and flip add daisyUI transforms; custom adds none so you can supply your own."
        >
          <docs-example label="effects.html" [code]="effectsCode">
            @for (item of effects; track item) {
              <label zdSwap class="icon" [effect]="item">
                <input type="checkbox" zdSwapInput [attr.aria-label]="item + ' effect'" />
                <span zdSwapOn>☾</span>
                <span zdSwapOff>☀</span>
              </label>
            }
          </docs-example>
        </docs-section>
      </docs-section>

      <docs-section
        id="api"
        heading="API"
        description="Root and part directives. Boolean inputs accept bare attributes."
      >
        <docs-section id="parts" level="3" heading="Directives">
          <docs-api-table caption="Swap directives" [columns]="parts.columns" [rows]="parts.rows" />
        </docs-section>
        <docs-section id="inputs" level="3" heading="Inputs and outputs">
          <docs-api-table
            caption="Swap inputs and outputs"
            [columns]="inputs.columns"
            [rows]="inputs.rows"
          />
        </docs-section>
        <docs-section id="types" level="3" heading="Types">
          <docs-code-block label="@pranxy/zordon-ui/swap" language="ts" [code]="typesCode" />
        </docs-section>
      </docs-section>

      <docs-section
        id="accessibility"
        heading="Accessibility"
        description="No Angular Aria is needed: a native checkbox or button already has the right semantics."
      >
        <docs-feature-grid [items]="accessibilityNotes" />
      </docs-section>

      <docs-section
        id="customization"
        heading="Customization"
        description="Sizes, colours, icons and text are yours. Inactive parts keep their grid space, so labels of different lengths don't shift layout. Reduced motion turns every effect off."
      >
        <docs-code-block label="styles.css" language="css" [code]="customCode" />
      </docs-section>

      <docs-section
        id="ssr"
        heading="SSR"
        description="Native checkboxes toggle before hydration. Controlled buttons and the read-only guard need hydration, and indeterminate has no HTML attribute, so render disabled or adjacent text for anything that must hold before JavaScript runs."
      />
    </article>
  `,
  styles: `
    .icon {
      font-size: 2rem;
      line-height: 1;
    }

    .pill {
      min-inline-size: 7rem;
      padding: 0.5rem 0.875rem;
      border: 1px solid var(--docs-border-strong);
      border-radius: var(--docs-radius-pill);
      background: var(--docs-surface);
      color: var(--docs-text);
      font-weight: var(--docs-weight-bold);
      text-align: center;
    }

    .center {
      justify-items: center;
    }

    .status {
      margin: 0;
      font-family: var(--docs-font-mono);
      font-size: 0.75rem;
    }
  `,
})
export class SwapPageComponent {
  protected readonly facts = swapFacts;
  protected readonly importCode = swapImportCode;
  protected readonly stylesCode = swapStylesCode;
  protected readonly controls = swapPlaygroundControls;
  protected readonly snippet = swapPlaygroundSnippet;
  protected readonly checkboxCode = checkboxCode;
  protected readonly toggleFiles = toggleFiles;
  protected readonly indeterminateCode = indeterminateCode;
  protected readonly effectsCode = effectsCode;
  protected readonly effects = swapEffects;
  protected readonly parts = swapParts;
  protected readonly inputs = swapInputs;
  protected readonly typesCode = swapTypesCode;
  protected readonly accessibilityNotes = swapAccessibilityNotes;
  protected readonly customCode = swapCustomCode;

  protected readonly notifications = new FormControl(true, { nonNullable: true });
  protected readonly notificationsValue = toSignal(this.notifications.valueChanges, {
    initialValue: this.notifications.value,
  });
  protected readonly muted = signal(false);
  protected readonly skyStates: readonly SkyState[] = ['day', 'night', 'unknown'];
  protected readonly sky = signal<SkyState>('unknown');

  protected effect(values: PlaygroundValues): ZdSwapEffect {
    return values['effect'] as ZdSwapEffect;
  }
}
