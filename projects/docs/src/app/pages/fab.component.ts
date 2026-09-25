import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdFab,
  ZdFabAction,
  ZdFabActions,
  type ZdFabArrangement,
  type ZdFabCorner,
} from '@pranxy/zordon-ui/fab';
import { ZdTooltip } from '@pranxy/zordon-ui/tooltip';

import {
  fabPlaygroundControls,
  fabPlaygroundSnippet,
  fabReference,
  flowerCode,
  singleCode,
  speedDialCode,
} from '../content/fab.content';
import { flagOf } from '../content/form-controls.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** FAB ships its own stylesheet and uses Button's global classes, so no page stylesheet. */
@Component({
  selector: 'docs-fab-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdButton,
    ZdFab,
    ZdFabAction,
    ZdFabActions,
    ZdTooltip,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="FAB"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="stage" [attr.data-corner]="cornerOf(values)">
            <zd-fab
              label="Create"
              inline
              [arrangement]="arrangementOf(values)"
              [corner]="cornerOf(values)"
              [disabled]="flagOf(values, 'disabled')"
              (mainAction)="last.set('main action')"
            >
              <ng-template zdFabActions>
                @for (action of actions; track action) {
                  <button
                    type="button"
                    zdButton
                    layout="circle"
                    zdFabAction
                    [attr.aria-label]="action"
                    (click)="last.set(action)"
                  >
                    {{ action[0] }}
                  </button>
                }
              </ng-template>
            </zd-fab>
            <p class="docs-status" role="status">Last: {{ last() }}</p>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="speed-dial"
        level="3"
        heading="Speed dial"
        description="Text actions in a vertical list. Choosing one closes the group; keepOpen leaves it open for actions like a preview."
      >
        <docs-example label="create.html" [code]="speedDialCode">
          <div class="stage">
            <zd-fab label="Create" closeLabel="Close create actions" inline>
              <ng-template zdFabActions>
                <button type="button" zdButton zdFabAction (click)="created.set('Draft')">
                  Draft
                </button>
                <button type="button" zdButton zdFabAction (click)="created.set('Template')">
                  Template
                </button>
                <button
                  type="button"
                  zdButton
                  zdFabAction
                  keepOpen
                  (click)="created.set('Preview (still open)')"
                >
                  Preview
                </button>
              </ng-template>
            </zd-fab>
            <p class="docs-status" role="status">Chose: {{ created() }}</p>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="flower"
        level="3"
        heading="Flower"
        description="Up to four circular icon actions on a quarter circle. Each has an accessible name and a tooltip for pointer users; five or more fall back to the list."
      >
        <docs-example label="share.html" [code]="flowerCode">
          <div class="stage">
            <zd-fab label="Share" arrangement="flower" inline>
              <ng-template zdFabActions>
                @for (action of shareActions; track action) {
                  <button
                    type="button"
                    zdButton
                    layout="circle"
                    zdFabAction
                    tooltipSide="start"
                    [attr.aria-label]="action"
                    [zdTooltip]="action"
                  >
                    {{ action[0] }}
                  </button>
                }
              </ng-template>
            </zd-fab>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="single"
        level="3"
        heading="Single action"
        description="Without an actions template the trigger is a plain action button and emits mainAction. zdFabIcon replaces its glyph."
      >
        <docs-example label="note.html" [code]="singleCode">
          <div class="docs-cluster">
            <zd-fab
              label="New note"
              arrangement="single"
              inline
              (mainAction)="notes.set(notes() + 1)"
            >
              <span zdFabIcon aria-hidden="true">✎</span>
            </zd-fab>
            <p class="docs-status" role="status">Notes: {{ notes() }}</p>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .stage {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: flex-end;
      gap: var(--docs-space-3);
      box-sizing: border-box;
      inline-size: min(22rem, 100%);
      min-block-size: 18rem;
      padding: var(--docs-space-3);
    }

    .stage[data-corner^='top'] {
      flex-direction: column-reverse;
    }

    .stage[data-corner$='start'] {
      align-items: flex-start;
    }
  `,
})
export class FabPageComponent {
  protected readonly reference = fabReference;
  protected readonly controls = fabPlaygroundControls;
  protected readonly snippet = fabPlaygroundSnippet;
  protected readonly speedDialCode = speedDialCode;
  protected readonly flowerCode = flowerCode;
  protected readonly singleCode = singleCode;
  protected readonly flagOf = flagOf;
  protected readonly actions = ['Draft', 'Upload', 'Note'] as const;
  protected readonly shareActions = ['Email', 'Copy link', 'Print'] as const;

  protected readonly last = signal('nothing yet');
  protected readonly created = signal('nothing yet');
  protected readonly notes = signal(0);

  protected arrangementOf(values: PlaygroundValues): ZdFabArrangement {
    return values['arrangement'] as ZdFabArrangement;
  }

  protected cornerOf(values: PlaygroundValues): ZdFabCorner {
    return values['corner'] as ZdFabCorner;
  }
}
