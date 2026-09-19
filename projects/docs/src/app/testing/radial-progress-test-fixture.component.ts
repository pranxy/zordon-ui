import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import {
  ZdRadialProgress,
  type ZdRadialProgressColor,
  type ZdRadialProgressFormatter,
  type ZdRadialProgressThreshold,
} from '@pranxy/zordon-ui/radial-progress';
@Component({
  selector: 'docs-radial-progress-daisy-styles',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './radial-progress-daisy-fixture.css',
})
class RadialProgressDaisyStyles {}
@Component({
  selector: 'docs-radial-progress-test-fixture',
  imports: [ZdRadialProgress, RadialProgressDaisyStyles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './radial-progress-fixture.css',
  template: `
    <docs-radial-progress-daisy-styles />
    <main data-testid="radial-fixture" [dir]="direction()">
      <h1>Radial Progress</h1>
      <p>Task completion with a CSS ring and a named progressbar.</p>
      <div class="controls">
        <button type="button" (click)="value.set(100)">Halfway</button>
        <button type="button" (click)="value.set(160)">Reach target</button>
        <button type="button" (click)="value.set(200)">Complete</button>
        <button type="button" (click)="value.set(0)">Reset</button>
        <button type="button" (click)="value.set(null)">Unknown duration</button>
        <button type="button" (click)="animated.set(!animated())">
          Animation: {{ animated() }}
        </button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
      </div>
      <div class="examples">
        <div class="example">
          <zd-radial-progress
            #task
            data-testid="radial-task"
            label="Download"
            [value]="value()"
            [max]="200"
            [thresholds]="thresholds"
            [format]="format"
            [animated]="animated()"
            size="8rem"
            thickness="8px"
            color="primary"
          /><span>Download</span>
        </div>
        <div class="example">
          <zd-radial-progress
            data-testid="radial-unknown"
            label="Preparing export"
            [animated]="animated()"
          /><span>Unknown total</span>
        </div>
        <div class="example">
          <zd-radial-progress
            data-testid="radial-projected"
            label="Archive"
            [value]="100"
            color="success"
            ><span zdRadialProgressIcon class="icon">✓</span
            ><bdi zdRadialProgressLabel>Done</bdi></zd-radial-progress
          ><span>Projected content</span>
        </div>
      </div>
      <p data-testid="radial-completion">
        {{ task.complete() ? 'Download complete' : 'Download pending' }}
      </p>
      <p>Color milestones: 50% halfway; 80% target reached.</p>
      <h2>Values</h2>
      <div class="matrix" data-testid="radial-values">
        @for (value of values; track value) {
          <zd-radial-progress [label]="'Value ' + value" [value]="value" />
        }
      </div>
      <h2>Size and thickness</h2>
      <div class="matrix" data-testid="radial-sizes">
        <zd-radial-progress label="Small" [value]="70" size="4rem" thickness="2px" />
        <zd-radial-progress label="Default" [value]="70" />
        <zd-radial-progress label="Large" [value]="70" size="8rem" thickness="16px" />
      </div>
      <h2>Semantic colors</h2>
      <div class="matrix" data-testid="radial-colors">
        @for (color of colors; track color) {
          <div class="example">
            <zd-radial-progress [label]="color" [color]="color" [value]="65" /><span>{{
              color
            }}</span>
          </div>
        }
      </div>
    </main>
  `,
})
export class RadialProgressTestFixtureComponent {
  readonly value = signal<number | null>(50);
  readonly animated = signal(true);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly values = [0, 25, 50, 75, 100];
  readonly format: ZdRadialProgressFormatter = state =>
    state.value === null ? 'Waiting for total' : `${state.value} of ${state.max} MB`;
  readonly thresholds: readonly ZdRadialProgressThreshold[] = [
    { at: 50, color: 'warning' },
    { at: 80, color: 'success' },
  ];
  readonly colors: readonly ZdRadialProgressColor[] = [
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
