import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  signal,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import {
  ZdStat,
  ZdStatActions,
  ZdStatDesc,
  ZdStatFigure,
  ZdStats,
  ZdStatTitle,
  ZdStatValue,
  type ZdStatsOrientation,
} from '@pranxy/zordon-ui/stat';

import { flagOf } from '../content/form-controls.content';
import {
  responsiveFiles,
  verticalFiles,
  centeredFiles,
  figuresFiles,
  basicFiles,
  actionsFiles,
  statPlaygroundControls,
  statPlaygroundSnippet,
  statReference,
} from '../content/stat.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads the daisyUI classes Stat emits, only while this page is in use. */
@Component({
  selector: 'docs-stat-daisy-styles',
  template: '',
  styleUrl: './styles/stat.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class StatDaisyStylesComponent {}

const euros = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

@Component({
  selector: 'docs-stat-page',
  imports: [
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    StatDaisyStylesComponent,
    ZdButton,
    ZdStat,
    ZdStatActions,
    ZdStatDesc,
    ZdStatFigure,
    ZdStats,
    ZdStatTitle,
    ZdStatValue,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-stat-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Stat"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <section
            zdStats
            class="summary"
            tabindex="0"
            aria-label="This month"
            [orientation]="orientationOf(values)"
          >
            @for (item of month; track item.title) {
              <div zdStat>
                @if (flagOf(values, 'figures')) {
                  <div zdStatFigure class="figure" aria-hidden="true">{{ item.icon }}</div>
                }
                <p zdStatTitle>{{ item.title }}</p>
                <p zdStatValue>{{ item.value }}</p>
                <p zdStatDesc>{{ item.desc }}</p>
              </div>
            }
          </section>
        </ng-template>
      </docs-playground>

      <docs-section
        id="actions"
        level="3"
        heading="Actions"
        description="zdStatActions holds your own buttons. The new value is not announced; the button’s result is visible next to it."
      >
        <docs-example label="balance" [files]="actionsFiles">
          <section zdStats class="summary" aria-label="Account summary">
            <div zdStat>
              <p zdStatTitle>Account balance</p>
              <p zdStatValue>{{ formatted() }}</p>
              <div zdStatActions>
                <button zdButton type="button" size="sm" (click)="addFunds()">Add €100</button>
              </div>
            </div>
          </section>
        </docs-example>
      </docs-section>
      <docs-section
        id="basic"
        level="3"
        heading="Basic stat"
        description="A single metric with a title, value and comparison."
      >
        <docs-example label="basic" [files]="basicFiles">
          <section zdStats class="summary" aria-label="Downloads">
            <div zdStat>
              <p zdStatTitle>Downloads</p>
              <p zdStatValue>31K</p>
              <p zdStatDesc>Up 12% from last month</p>
            </div>
          </section>
        </docs-example>
      </docs-section>
      <docs-section
        id="figures"
        level="3"
        heading="Icon and image figures"
        description="A decorative icon supports the metric. The portrait is decorative because the person is named in text."
      >
        <docs-example label="figures" [files]="figuresFiles">
          <section zdStats class="summary" tabindex="0" aria-label="Team activity">
            <div zdStat>
              <div zdStatFigure aria-hidden="true">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
                </svg>
              </div>
              <p zdStatTitle>Downloads</p>
              <p zdStatValue>31K</p>
              <p zdStatDesc>Up 12% this month</p>
            </div>
            <div zdStat>
              <div zdStatFigure>
                <img
                  class="stat-portrait"
                  src="images/showcase/portrait-ada.webp"
                  alt=""
                  width="256"
                  height="256"
                  loading="lazy"
                />
              </div>
              <p zdStatTitle>Ada Lovelace</p>
              <p zdStatValue>86%</p>
              <p zdStatDesc>Tasks complete</p>
            </div>
          </section>
        </docs-example>
      </docs-section>
      <docs-section
        id="centered"
        level="3"
        heading="Centered stats"
        description="Center the text for compact summary metrics."
      >
        <docs-example label="centered" [files]="centeredFiles">
          <section
            zdStats
            class="summary centered-stats"
            tabindex="0"
            aria-label="Centered monthly summary"
          >
            <div zdStat>
              <p zdStatTitle>Downloads</p>
              <p zdStatValue>31K</p>
              <p zdStatDesc>Up 12% from last month</p>
            </div>
            <div zdStat>
              <p zdStatTitle>New users</p>
              <p zdStatValue>4,200</p>
              <p zdStatDesc>Down 3% from last month</p>
            </div>
          </section>
        </docs-example>
      </docs-section>
      <docs-section
        id="vertical"
        level="3"
        heading="Vertical stats"
        description="Stack related metrics in a narrow space."
      >
        <docs-example label="vertical" [files]="verticalFiles">
          <section
            zdStats
            orientation="vertical"
            class="summary"
            aria-label="Vertical monthly summary"
          >
            <div zdStat>
              <p zdStatTitle>Downloads</p>
              <p zdStatValue>31K</p>
              <p zdStatDesc>Up 12% from last month</p>
            </div>
            <div zdStat>
              <p zdStatTitle>New users</p>
              <p zdStatValue>4,200</p>
              <p zdStatDesc>Down 3% from last month</p>
            </div>
          </section>
        </docs-example>
      </docs-section>
      <docs-section
        id="responsive"
        level="3"
        heading="Responsive stats"
        description="Stack on small screens and arrange horizontally from the large breakpoint."
      >
        <docs-example label="responsive" [files]="responsiveFiles">
          <section
            zdStats
            orientation="vertical"
            class="summary lg:stats-horizontal"
            aria-label="Responsive monthly summary"
          >
            <div zdStat>
              <p zdStatTitle>Downloads</p>
              <p zdStatValue>31K</p>
              <p zdStatDesc>Up 12% from last month</p>
            </div>
            <div zdStat>
              <p zdStatTitle>New users</p>
              <p zdStatValue>4,200</p>
              <p zdStatDesc>Down 3% from last month</p>
            </div>
          </section>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .centered-stats [zdStat] {
      text-align: center;
    }

    .stat-portrait {
      inline-size: 4rem;
      block-size: 4rem;
      object-fit: cover;
      border-radius: 50%;
    }

    .summary {
      max-inline-size: 100%;
      border: 1px solid var(--docs-border);
      background: var(--docs-surface);
    }

    .summary:focus-visible {
      outline: 2px solid var(--docs-accent);
      outline-offset: 2px;
    }

    .summary p {
      margin: 0;
    }

    .figure {
      font-size: 1.75rem;
      color: var(--docs-accent);
    }
  `,
})
export class StatPageComponent {
  protected readonly basicFiles = basicFiles;
  protected readonly figuresFiles = figuresFiles;
  protected readonly centeredFiles = centeredFiles;
  protected readonly verticalFiles = verticalFiles;
  protected readonly responsiveFiles = responsiveFiles;
  protected readonly reference = statReference;
  protected readonly controls = statPlaygroundControls;
  protected readonly snippet = statPlaygroundSnippet;
  protected readonly actionsFiles = actionsFiles;
  protected readonly flagOf = flagOf;
  protected readonly balance = signal(1280);
  protected readonly formatted = computed(() => euros.format(this.balance()));

  protected readonly month = [
    { title: 'Downloads', value: '31K', desc: 'Up 12% from last month', icon: '⬇' },
    { title: 'New users', value: '4,200', desc: 'Down 3% from last month', icon: '☺' },
  ] as const;

  protected orientationOf(values: PlaygroundValues): ZdStatsOrientation | undefined {
    const value = values['orientation'];
    return value === 'default' ? undefined : (value as ZdStatsOrientation);
  }

  protected addFunds(): void {
    this.balance.update(value => value + 100);
  }
}
