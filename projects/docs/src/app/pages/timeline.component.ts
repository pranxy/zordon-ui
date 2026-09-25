import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import {
  ZdTimeline,
  ZdTimelineBox,
  ZdTimelineEnd,
  ZdTimelineMiddle,
  ZdTimelineSnapIcon,
  ZdTimelineStart,
  type ZdTimelineOrientation,
} from '@pranxy/zordon-ui/timeline';

import { flagOf } from '../content/form-controls.content';
import {
  snapCode,
  timelinePlaygroundControls,
  timelinePlaygroundSnippet,
  timelineReference,
} from '../content/timeline.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Timeline emits, only while this page is in use. */
@Component({
  selector: 'docs-timeline-daisy-styles',
  template: '',
  styleUrl: './styles/timeline.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class TimelineDaisyStylesComponent {}

@Component({
  selector: 'docs-timeline-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    TimelineDaisyStylesComponent,
    ZdTimeline,
    ZdTimelineBox,
    ZdTimelineEnd,
    ZdTimelineMiddle,
    ZdTimelineSnapIcon,
    ZdTimelineStart,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-timeline-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Timeline"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <ol
            zdTimeline
            aria-label="Release history"
            [orientation]="orientationOf(values)"
            [compact]="flagOf(values, 'compact')"
          >
            @for (release of releases; track release.name; let first = $first; let last = $last) {
              <li [class.done]="release.done">
                @if (!first) {
                  <hr />
                }
                <div zdTimelineStart>
                  <time [attr.datetime]="release.datetime">{{ release.date }}</time>
                </div>
                <div zdTimelineMiddle class="marker" aria-hidden="true">
                  {{ release.done ? '●' : '○' }}
                </div>
                <div zdTimelineEnd zdTimelineBox>
                  {{ release.name }} · {{ release.done ? 'done' : 'next' }}
                </div>
                @if (!last) {
                  <hr />
                }
              </li>
            }
          </ol>
        </ng-template>
      </docs-playground>

      <docs-section
        id="snap"
        level="3"
        heading="Order tracking"
        description="zdTimelineSnapIcon aligns each marker with the top of its content, which suits entries of different heights."
      >
        <docs-example label="order.html" [code]="snapCode">
          <ol
            zdTimeline
            zdTimelineSnapIcon
            orientation="vertical"
            compact
            class="order"
            aria-label="Order 1042"
          >
            @for (step of order; track step.title; let first = $first; let last = $last) {
              <li [class.done]="step.done">
                @if (!first) {
                  <hr />
                }
                <div zdTimelineMiddle class="marker" aria-hidden="true">
                  {{ step.done ? '✓' : '○' }}
                </div>
                <div zdTimelineEnd class="entry">
                  <time [attr.datetime]="step.datetime">{{ step.when }}</time>
                  <p class="title">{{ step.title }}</p>
                  <p class="detail">{{ step.detail }}</p>
                </div>
                @if (!last) {
                  <hr />
                }
              </li>
            }
          </ol>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    ol {
      margin: 0;
      padding: 0;
    }

    .marker {
      color: var(--docs-muted-text);
    }

    .done .marker {
      color: var(--docs-accent);
    }

    .done hr,
    .done + li > hr:first-child {
      background: var(--docs-accent);
    }

    time {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }

    .entry {
      padding-block-end: var(--docs-space-4);
    }

    .entry p {
      margin: 0;
    }

    .title {
      font-weight: var(--docs-weight-semibold);
    }

    .detail {
      color: var(--docs-muted-text);
      font-size: var(--docs-text-sm);
    }
  `,
})
export class TimelinePageComponent {
  protected readonly reference = timelineReference;
  protected readonly controls = timelinePlaygroundControls;
  protected readonly snippet = timelinePlaygroundSnippet;
  protected readonly snapCode = snapCode;
  protected readonly flagOf = flagOf;

  protected readonly releases = [
    { name: 'Preview', date: 'March 2026', datetime: '2026-03', done: true },
    { name: 'Beta', date: 'June 2026', datetime: '2026-06', done: true },
    { name: 'Stable', date: 'September 2026', datetime: '2026-09', done: false },
  ] as const;

  protected readonly order = [
    {
      title: 'Order placed',
      detail: 'Paid by card ending 4242.',
      when: '21 Sep, 09:12',
      datetime: '2026-09-21T09:12',
      done: true,
    },
    {
      title: 'Shipped',
      detail: 'Parcel 3 of 3 left the warehouse in Ghent.',
      when: '22 Sep, 16:40',
      datetime: '2026-09-22T16:40',
      done: true,
    },
    {
      title: 'Out for delivery',
      detail: 'Expected between 10:00 and 14:00.',
      when: '25 Sep',
      datetime: '2026-09-25',
      done: false,
    },
  ] as const;

  protected orientationOf(values: PlaygroundValues): ZdTimelineOrientation {
    return values['orientation'] as ZdTimelineOrientation;
  }
}
