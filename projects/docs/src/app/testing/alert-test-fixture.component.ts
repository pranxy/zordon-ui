import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ZdAlert,
  type ZdAlertColor,
  type ZdAlertVariant,
  type ZdAlertDismissReason,
} from '@pranxy/zordon-ui/alert';

@Component({
  selector: 'docs-alert-test-fixture',
  imports: [ZdAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './alert-fixture.css',
  template: `
    <main data-testid="alert-fixture" [dir]="direction()">
      <h1>Alert</h1>
      <p>Inline feedback, optional details, and actions.</p>
      <div class="controls">
        <button type="button" (click)="show.set(true)">Show message</button
        ><button type="button" (click)="accept.set(!accept())">Accept close: {{ accept() }}</button
        ><button type="button" (click)="timer.set(timer() ? 0 : 1500)">Toggle timer</button
        ><button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
      </div>
      <zd-alert
        data-testid="alert-interactive"
        [open]="show()"
        announcement="polite"
        dismissible
        dismissLabel="Close update"
        [autoDismiss]="timer()"
        (openChange)="close($event)"
        (dismissRequested)="last.set($event)"
      >
        <span zdAlertIcon>ⓘ</span>
        <h2 zdAlertTitle>Update available</h2>
        <p>Save your work before installing the update.</p>
        <div zdAlertActions>
          <button type="button" (click)="actions.set(actions() + 1)">Install later</button>
        </div>
        <details zdAlertDetails>
          <summary>Release details</summary>
          <p>The update includes improved keyboard navigation.</p>
        </details>
      </zd-alert>
      <p data-testid="alert-event">Last close: {{ last() ?? 'none' }}; actions: {{ actions() }}</p>
      <div data-testid="alert-matrix" class="matrix">
        @for (color of colors; track color) {
          @for (variant of variants; track variant ?? 'solid') {
            <zd-alert [color]="color" [variant]="variant" direction="horizontal"
              ><span zdAlertIcon>●</span
              ><strong zdAlertTitle>{{ color }} · {{ variant ?? 'solid' }}</strong
              ><span>Account notification</span></zd-alert
            >
          }
        }
        <zd-alert direction="vertical"
          ><h2 zdAlertTitle>Vertical layout</h2>
          <span>Details stay readable on narrow screens.</span
          ><button zdAlertActions type="button">Review</button></zd-alert
        >
      </div>
    </main>
  `,
})
export class AlertTestFixtureComponent {
  readonly colors: readonly ZdAlertColor[] = ['info', 'success', 'warning', 'error'];
  readonly variants: readonly (ZdAlertVariant | undefined)[] = [
    undefined,
    'soft',
    'outline',
    'dash',
  ];
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly show = signal(true);
  readonly accept = signal(false);
  readonly timer = signal(0);
  readonly actions = signal(0);
  readonly last = signal<ZdAlertDismissReason | null>(null);
  close(open: boolean): void {
    if (this.accept()) this.show.set(open);
  }
}
