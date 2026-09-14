import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  ZdSwap,
  ZdSwapInput,
  ZdSwapOn,
  ZdSwapOff,
  ZdSwapIndeterminate,
} from '@pranxy/zordon-ui/swap';

@Component({
  selector: 'docs-swap-test-fixture',
  imports: [ReactiveFormsModule, ZdSwap, ZdSwapInput, ZdSwapOn, ZdSwapOff, ZdSwapIndeterminate],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './swap-fixture.css',
    './swap-effects-fixture.css',
    '../../../../components/swap/src/swap.css',
  ],
  styles: `
    :host {
      display: block;
      width: min(50rem, calc(100vw - 4rem));
    }
    section {
      padding: 1.5rem;
      color: var(--color-base-content);
      background: var(--color-base-100);
    }
    .samples {
      display: flex;
      flex-wrap: wrap;
      gap: 1.5rem;
      margin-block: 1.5rem;
      align-items: center;
    }
    [zdSwap] {
      padding: 0.75rem;
      min-width: 5rem;
      min-height: 3rem;
      border: 1px solid var(--color-base-300);
      border-radius: 0.5rem;
      font-size: 1.25rem;
    }
    .custom > [data-zd-swap-part] {
      transition: opacity 0.6s linear;
    }
  `,
  template: `
    <section data-testid="swap-fixture" aria-label="Swap examples">
      <h1>Swap</h1>
      <div class="samples">
        <label zdSwap effect="rotate" [readOnly]="readOnly()" data-testid="swap-checkbox">
          <input
            type="checkbox"
            zdSwapInput
            [formControl]="enabled"
            [indeterminate]="mixed()"
            aria-label="Notifications"
            name="notifications"
            value="yes"
          />
          <span zdSwapOn>On</span><span zdSwapOff>Off</span><span zdSwapIndeterminate>Some</span>
        </label>
        <button
          type="button"
          zdSwap
          effect="flip"
          [active]="muted()"
          [readOnly]="readOnly()"
          [disabled]="disabled()"
          (activeChange)="muted.set($event)"
          aria-label="Mute"
          data-testid="swap-toggle"
        >
          <span zdSwapOn>Muted</span><span zdSwapOff>Sound</span>
        </button>
        <button type="button" zdSwap [active]="true" [disabled]="true" aria-label="Locked mode">
          <span zdSwapOn>Locked</span><span zdSwapOff>Open</span>
        </button>
        <div zdSwap effect="custom" class="custom" [active]="manual()" data-testid="swap-manual">
          <span zdSwapOn>Day</span><span zdSwapOff>Night</span>
        </div>
        <button
          type="button"
          zdSwap
          aria-label="Controlled veto"
          (activeChange)="requests.set(requests() + 1)"
          data-testid="swap-veto"
        >
          <span zdSwapOn>On</span><span zdSwapOff>Off</span>
        </button>
      </div>
      <div class="samples">
        <button type="button" (click)="readOnly.set(!readOnly())">Toggle read only</button>
        <button type="button" (click)="setDisabled()">Toggle disabled</button>
        <button type="button" (click)="mixed.set(!mixed())">Toggle mixed</button>
        <button type="button" (click)="manual.set(!manual())">Toggle manual</button>
        <button type="button" (click)="enabled.reset()">Reset checkbox</button>
      </div>
      <output aria-label="Swap values"
        >{{ enabled.value }} / {{ muted() }} / {{ requests() }}</output
      >
    </section>
  `,
})
export class SwapTestFixtureComponent {
  protected readonly enabled = new FormControl(false, { nonNullable: true });
  protected readonly mixed = signal(false);
  protected readonly muted = signal(false);
  protected readonly manual = signal(false);
  protected readonly readOnly = signal(false);
  protected readonly disabled = signal(false);
  protected readonly requests = signal(0);
  protected setDisabled(): void {
    this.disabled.update(value => !value);
    if (this.disabled()) this.enabled.disable();
    else this.enabled.enable();
  }
}
