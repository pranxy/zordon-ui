import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import {
  ZdProgress,
  type ZdProgressColor,
  type ZdProgressFormatter,
} from '@pranxy/zordon-ui/progress';
@Component({
  selector: 'docs-progress-daisy-styles',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './progress-daisy-fixture.css',
})
class ProgressDaisyStyles {}
@Component({
  selector: 'docs-progress-test-fixture',
  imports: [ZdProgress, ProgressDaisyStyles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './progress-fixture.css',
  template: `
    <docs-progress-daisy-styles />
    <main data-testid="progress-fixture" [dir]="direction()">
      <h1>Progress</h1>
      <p>Native task progress with a decorative download buffer.</p>
      <div class="controls">
        <button type="button" (click)="value.set(200)">Complete upload</button>
        <button type="button" (click)="value.set(50)">Restart upload</button>
        <button type="button" (click)="value.set(null)">Unknown duration</button>
        <button type="button" (click)="animated.set(!animated())">
          Animation: {{ animated() }}
        </button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
      </div>
      <zd-progress
        #upload
        data-testid="progress-upload"
        label="Upload"
        [value]="value()"
        [max]="200"
        [buffer]="140"
        [animated]="animated()"
        [format]="format"
      />
      <p data-testid="progress-completion">
        {{ upload.complete() ? 'Upload complete' : 'Upload pending' }}
      </p>
      <zd-progress
        label="Preparing export"
        data-testid="progress-unknown"
        [animated]="animated()"
      />
      <zd-progress label="Background sync" [value]="0" [showLabel]="false" />
      <div class="matrix" data-testid="progress-matrix">
        @for (color of colors; track color) {
          <zd-progress [label]="color" [color]="color" [value]="65" />
        }
      </div>
    </main>
  `,
})
export class ProgressTestFixtureComponent {
  readonly value = signal<number | null>(50);
  readonly animated = signal(true);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly format: ZdProgressFormatter = state =>
    state.value === null ? 'Waiting for total' : `${state.value} of ${state.max} MB`;
  readonly colors: readonly ZdProgressColor[] = [
    'neutral',
    'primary',
    'secondary',
    'accent',
    'info',
    'success',
    'warning',
    'error',
  ];
}
