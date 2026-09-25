import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdCountdown } from '@pranxy/zordon-ui/countdown';

import {
  countdownPlaygroundControls,
  countdownPlaygroundSnippet,
  countdownReference,
  timerFiles,
} from '../content/countdown.content';
import {
  DocsExampleComponent,
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  DocsReferencePageComponent,
  DocsSectionComponent,
  type PlaygroundValues,
} from '../ui';

/** Loads daisyUI's countdown class, only while this page is in use. */
@Component({
  selector: 'docs-countdown-daisy-styles',
  template: '',
  styleUrl: './styles/countdown.daisy.css',
  encapsulation: ViewEncapsulation.None,
})
class CountdownDaisyStylesComponent {}

@Component({
  selector: 'docs-countdown-page',
  imports: [
    CountdownDaisyStylesComponent,
    DocsExampleComponent,
    DocsPlaygroundComponent,
    DocsPlaygroundPreviewDirective,
    DocsReferencePageComponent,
    DocsSectionComponent,
    ZdButton,
    ZdCountdown,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-countdown-daisy-styles />
    <docs-reference-page [reference]="reference">
      <docs-playground
        docsReferencePlayground
        label="Countdown"
        [controls]="controls"
        [snippet]="snippet"
      >
        <ng-template docsPlaygroundPreview let-values>
          <div class="docs-stack center">
            <span zdCountdown class="big">
              <span
                [style.--value]="value()"
                [style.--digits]="digitsOf(values)"
                [attr.aria-label]="value()"
                >{{ value() }}</span
              >
            </span>
            <div class="docs-cluster" role="group" aria-label="Change the value">
              <button zdButton type="button" size="sm" (click)="step(-1)">−1</button>
              <button zdButton type="button" size="sm" (click)="step(1)">+1</button>
              <button zdButton type="button" size="sm" (click)="step(10)">+10</button>
            </div>
          </div>
        </ng-template>
      </docs-playground>

      <docs-section
        id="timer"
        level="3"
        heading="Timer"
        description="Your code runs the clock; the directive only animates the digits. Each part has its own label."
      >
        <docs-example label="timer" [files]="timerFiles">
          <div class="docs-stack center">
            <span zdCountdown class="big" role="timer" aria-label="Time left">
              <span
                [style.--value]="minutes()"
                [style.--digits]="2"
                [attr.aria-label]="minutes() + ' minutes'"
                >{{ minutes() }}</span
              >:<span
                [style.--value]="seconds()"
                [style.--digits]="2"
                [attr.aria-label]="seconds() + ' seconds'"
                >{{ seconds() }}</span
              >
            </span>
            <div class="docs-cluster">
              <button zdButton type="button" size="sm" color="primary" (click)="toggle()">
                {{ running() ? 'Pause' : 'Start' }}
              </button>
              <button zdButton type="button" size="sm" (click)="reset()">Reset</button>
            </div>
          </div>
        </docs-example>
      </docs-section>
    </docs-reference-page>
  `,
  styles: `
    .center {
      justify-items: center;
    }

    .big {
      font-family: var(--docs-font-mono);
      font-size: 3rem;
      line-height: 1;
    }
  `,
})
export class CountdownPageComponent {
  protected readonly reference = countdownReference;
  protected readonly controls = countdownPlaygroundControls;
  protected readonly snippet = countdownPlaygroundSnippet;
  protected readonly timerFiles = timerFiles;

  protected readonly value = signal(42);
  protected readonly left = signal(90);
  protected readonly running = signal(false);
  protected readonly minutes = computed(() => Math.floor(this.left() / 60));
  protected readonly seconds = computed(() => this.left() % 60);
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected digitsOf(values: PlaygroundValues): number | null {
    const digits = Number(values['digits']);
    return digits > 1 ? digits : null;
  }

  protected step(by: number): void {
    this.value.update(value => Math.min(999, Math.max(0, value + by)));
  }

  protected toggle(): void {
    if (this.running()) {
      clearInterval(this.timer);
      this.running.set(false);
      return;
    }
    this.running.set(true);
    this.timer = setInterval(() => {
      this.left.update(seconds => Math.max(0, seconds - 1));
      if (this.left() === 0) this.toggle();
    }, 1000);
  }

  protected reset(): void {
    if (this.running()) this.toggle();
    this.left.set(90);
  }
}
