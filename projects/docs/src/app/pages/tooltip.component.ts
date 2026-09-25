import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdTooltip,
  type ZdTooltipAlign,
  type ZdTooltipColor,
  type ZdTooltipSide,
} from '@pranxy/zordon-ui/tooltip';

import {
  controlledFiles,
  disabledCode,
  interactiveCode,
  richCode,
  tooltipPlaygroundControls,
  tooltipPlaygroundSnippet,
  tooltipReference,
} from '../content/tooltip.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** The tooltip surface brings its own stylesheet, so this page loads no daisyUI classes. */
@Component({
  selector: 'docs-tooltip-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdButton,
    ZdTooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Tooltip"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <!-- A plain daisyUI button: zdButton would also read the tooltip's color input. -->
          <button
            type="button"
            class="btn"
            zdTooltip="Saves a copy only you can see"
            [side]="sideOf(values)"
            [align]="alignOf(values)"
            [color]="colorOf(values)"
          >
            Save draft
          </button>
        </ng-template>
      </docs-playground>

      <docs-section
        id="rich-content"
        level="3"
        heading="Rich content"
        description="Pass a template for formatted text. Descriptive content must not contain controls, and the icon button keeps its own name."
      >
        <docs-example label="shortcut.html" [code]="richCode">
          <ng-template #shortcut>
            Copy the link · <kbd class="kbd kbd-xs">Ctrl</kbd> + <kbd class="kbd kbd-xs">L</kbd>
          </ng-template>
          <button
            zdButton
            type="button"
            layout="square"
            aria-label="Copy link"
            [zdTooltip]="shortcut"
          >
            🔗
          </button>
        </docs-example>
      </docs-section>

      <docs-section
        id="interactive"
        level="3"
        heading="Interactive help"
        description="interactive turns the surface into a named, non-modal dialog. Activate the button or press F2 to move focus in; Escape brings it back."
      >
        <docs-example label="settings.html" [code]="interactiveCode">
          <ng-template #settings>
            <div class="docs-stack panel">
              <label class="docs-field">
                Draft name
                <input name="draftName" value="Q3 plan" />
              </label>
              <button zdButton type="button" size="sm" color="primary">Apply</button>
            </div>
          </ng-template>
          <button
            zdButton
            type="button"
            variant="outline"
            interactive
            tooltipLabel="Draft settings"
            [zdTooltip]="settings"
          >
            Draft settings
          </button>
        </docs-example>
      </docs-section>

      <docs-section
        id="disabled-actions"
        level="3"
        heading="Disabled actions"
        description="Disabled buttons can’t take focus or pointer events, so the explanation goes on a focusable, labelled wrapper."
      >
        <docs-example label="publish.html" [code]="disabledCode">
          <span
            tabindex="0"
            role="group"
            aria-label="Publish unavailable"
            class="wrapper"
            zdTooltip="Complete the required fields first"
          >
            <button zdButton type="button" disabled>Publish</button>
          </span>
        </docs-example>
      </docs-section>

      <docs-section
        id="controlled"
        level="3"
        heading="Controlled"
        description="With a manual trigger, only your state opens it. Escape and outside clicks still ask to close through openChange."
      >
        <docs-example label="tour" [files]="controlledFiles">
          <div class="docs-cluster">
            <button
              type="button"
              class="btn"
              zdTooltip="New: export to PDF"
              trigger="manual"
              side="bottom"
              color="primary"
              [open]="tour()"
              (openChange)="tour.set($event)"
            >
              Export
            </button>
            <button
              zdButton
              type="button"
              variant="outline"
              [attr.aria-pressed]="tour()"
              (click)="tour.set(!tour())"
            >
              Show what’s new
            </button>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .panel {
      min-inline-size: 12rem;
      padding-block: 0.25rem;
    }

    .panel input {
      font: inherit;
      padding: 0.25rem 0.5rem;
      border: 1px solid currentColor;
      border-radius: var(--docs-radius-sm);
      background: transparent;
      color: inherit;
    }

    .wrapper {
      display: inline-block;
      border-radius: var(--docs-radius-sm);
    }
  `,
})
export class TooltipPageComponent {
  protected readonly reference = tooltipReference;
  protected readonly controls = tooltipPlaygroundControls;
  protected readonly snippet = tooltipPlaygroundSnippet;
  protected readonly richCode = richCode;
  protected readonly interactiveCode = interactiveCode;
  protected readonly disabledCode = disabledCode;
  protected readonly controlledFiles = controlledFiles;

  protected readonly tour = signal(false);

  protected sideOf(values: PlaygroundValues): ZdTooltipSide {
    return values['side'] as ZdTooltipSide;
  }

  protected alignOf(values: PlaygroundValues): ZdTooltipAlign {
    return values['align'] as ZdTooltipAlign;
  }

  protected colorOf(values: PlaygroundValues): ZdTooltipColor {
    return values['color'] as ZdTooltipColor;
  }
}
