import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import {
  ZdLoading,
  type ZdLoadingVariant,
  type ZdLoadingSize,
  type ZdLoadingColor,
} from '@pranxy/zordon-ui/loading';

@Component({
  selector: 'docs-loading-daisy-styles',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './loading-base-fixture.css',
    './loading-spinner-fixture.css',
    './loading-dots-fixture.css',
    './loading-ring-fixture.css',
    './loading-variants-fixture.css',
    './loading-bars-fixture.css',
    './loading-infinity-fixture.css',
  ],
})
class LoadingDaisyStyles {}

@Component({
  selector: 'docs-loading-test-fixture',
  imports: [ZdLoading, LoadingDaisyStyles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './loading-fixture.css',
  template: `
    <docs-loading-daisy-styles />
    <main data-testid="loading-fixture" [dir]="direction()">
      <h1>Loading</h1>
      <p>Indeterminate work with optional delayed feedback.</p>
      <div class="controls">
        <button type="button" (click)="active.set(!active())">
          {{ active() ? 'Finish' : 'Start' }} work</button
        ><button type="button" (click)="delay.set(delay() ? 0 : 500)">Delay: {{ delay() }}</button
        ><button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
      </div>
      <section class="work" aria-label="Results" [attr.aria-busy]="active()">
        <p>Your results stay in this region.</p>
        <button type="button" (click)="actions.set(actions() + 1)">Available action</button
        ><span>Actions: {{ actions() }}</span>
      </section>
      <zd-loading
        data-testid="loading-delayed"
        [active]="active()"
        [delay]="delay()"
        label="Loading results"
        showLabel
        layout="center"
      />
      <div class="overlay-demo">
        <button type="button" (click)="actions.set(actions() + 1)">Overlay action</button
        ><zd-loading
          data-testid="loading-overlay"
          [active]="active()"
          layout="overlay"
          label="Refreshing preview"
          showLabel
        />
      </div>
      <zd-loading data-testid="loading-custom" variant="custom" label="Preparing export" showLabel
        ><span zdLoadingCustom class="custom-art">◇</span></zd-loading
      >
      <div data-testid="loading-matrix" class="matrix">
        @for (variant of variants; track variant) {
          <section>
            <h2>{{ variant }}</h2>
            <div class="sizes">
              @for (size of sizes; track size) {
                <div>
                  <zd-loading [variant]="variant" [size]="size" decorative /><span>{{ size }}</span>
                </div>
              }
            </div>
          </section>
        }
        <section class="colors">
          <h2>Semantic colors</h2>
          <div class="sizes">
            @for (color of colors; track color) {
              <div>
                <zd-loading [color]="color" decorative /><span>{{ color }}</span>
              </div>
            }
          </div>
        </section>
      </div>
    </main>
  `,
})
export class LoadingTestFixtureComponent {
  readonly active = signal(false);
  readonly delay = signal(500);
  readonly actions = signal(0);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly variants: readonly ZdLoadingVariant[] = [
    'spinner',
    'dots',
    'ring',
    'ball',
    'bars',
    'infinity',
  ];
  readonly sizes: readonly ZdLoadingSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  readonly colors: readonly ZdLoadingColor[] = [
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
