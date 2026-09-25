import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ZdBadge } from '@pranxy/zordon-ui/badge';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdIndicator,
  ZdIndicatorItem,
  type ZdIndicatorHorizontalPlacement,
  type ZdIndicatorVerticalPlacement,
} from '@pranxy/zordon-ui/indicator';
import { ZdStatus } from '@pranxy/zordon-ui/status';

import {
  countCode,
  indicatorPlaygroundControls,
  indicatorPlaygroundSnippet,
  indicatorReference,
  presenceCode,
} from '../content/indicator.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Indicator emits, only while this page is in use. */
@Component({
  selector: 'docs-indicator-daisy-styles',
  template: '',
  styleUrls: [
    './styles/indicator.daisy.css',
    './styles/badge.daisy.css',
    './styles/status.daisy.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
class IndicatorDaisyStylesComponent {}

@Component({
  selector: 'docs-indicator-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    IndicatorDaisyStylesComponent,
    ZdBadge,
    ZdButton,
    ZdIndicator,
    ZdIndicatorItem,
    ZdStatus,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-indicator-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Indicator"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div zdIndicator>
            <span
              zdIndicatorItem
              zdBadge
              color="secondary"
              aria-hidden="true"
              [horizontalPlacement]="horizontalOf(values)"
              [verticalPlacement]="verticalOf(values)"
              >New</span
            >
            <div class="tile">Release notes <span class="docs-visually-hidden">(new)</span></div>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="count"
        level="3"
        heading="Count on a button"
        description="The visible count is hidden from assistive technology; the button’s name carries it instead."
      >
        <docs-example label="inbox.html" [code]="countCode">
          <div zdIndicator>
            <span zdIndicatorItem zdBadge color="primary" size="sm" aria-hidden="true">3</span>
            <button zdButton type="button">
              Inbox<span class="docs-visually-hidden">, 3 unread</span>
            </button>
          </div>
        </docs-example>
      </docs-section>

      <docs-section
        id="presence"
        level="3"
        heading="Presence dot"
        description="A Status dot in the bottom end corner of an avatar, with the state written beside it."
      >
        <docs-example label="person.html" [code]="presenceCode">
          <div class="person">
            <div zdIndicator>
              <span
                zdIndicatorItem
                horizontalPlacement="end"
                verticalPlacement="bottom"
                zdStatus
                color="success"
                size="lg"
                aria-hidden="true"
              ></span>
              <div class="avatar-tile">AL</div>
            </div>
            <span>Ada Lovelace · online</span>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .tile {
      display: grid;
      place-items: center;
      inline-size: 12rem;
      block-size: 6rem;
      border: 1px solid var(--docs-border);
      border-radius: var(--docs-radius-md);
      background: var(--docs-surface);
    }

    .person {
      display: flex;
      align-items: center;
      gap: var(--docs-space-3);
    }

    .avatar-tile {
      display: grid;
      place-items: center;
      inline-size: 3rem;
      block-size: 3rem;
      border-radius: var(--docs-radius-pill);
      background: var(--docs-accent);
      color: var(--docs-accent-text);
      font-weight: var(--docs-weight-bold);
    }
  `,
})
export class IndicatorPageComponent {
  protected readonly reference = indicatorReference;
  protected readonly controls = indicatorPlaygroundControls;
  protected readonly snippet = indicatorPlaygroundSnippet;
  protected readonly presenceCode = presenceCode;
  protected readonly countCode = countCode;

  protected horizontalOf(values: PlaygroundValues): ZdIndicatorHorizontalPlacement | undefined {
    const value = values['horizontalPlacement'];
    return value === 'default' ? undefined : (value as ZdIndicatorHorizontalPlacement);
  }

  protected verticalOf(values: PlaygroundValues): ZdIndicatorVerticalPlacement | undefined {
    const value = values['verticalPlacement'];
    return value === 'default' ? undefined : (value as ZdIndicatorVerticalPlacement);
  }
}
