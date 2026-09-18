import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ZdFab, ZdFabActions, ZdFabAction, type ZdFabCorner } from '@pranxy/zordon-ui/fab';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdTooltip } from '@pranxy/zordon-ui/tooltip';

@Component({
  selector: 'docs-fab-test-fixture',
  imports: [ZdFab, ZdFabActions, ZdFabAction, ZdButton, ZdTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './fab-fixture.css',
  styles: `
    :host {
      display: block;
      width: min(54rem, calc(100vw - 3rem));
    }
    section {
      padding: 1rem;
      background: var(--color-base-100);
      color: var(--color-base-content);
    }
    .examples {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 3rem;
      min-height: 23rem;
      padding: 2rem;
    }
    .flower {
      min-width: 12rem;
      min-height: 12rem;
      display: flex;
      align-items: end;
      justify-content: end;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .outside {
      padding: 1rem;
      margin-block: 1rem;
      border: 1px solid currentColor;
    }
  `,
  template: `
    <section data-testid="fab-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
      <h1>FAB / Speed Dial</h1>
      <div class="controls">
        <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
        <button type="button" (click)="accepted.set(!accepted())">Accept controlled</button>
        <button type="button" (click)="controlled.set(!controlled())">Set controlled</button>
        <button type="button" (click)="disabled.set(!disabled())">Toggle disabled</button>
        <button type="button" (click)="fixed.set(!fixed())">Toggle fixed</button>
        <button type="button" (click)="corner.set('top-start')">Top start</button>
        <button type="button" (click)="corner.set('top-end')">Top end</button>
        <button type="button" (click)="corner.set('bottom-start')">Bottom start</button>
        <button type="button" (click)="corner.set('bottom-end')">Bottom end</button>
        <button type="button" (click)="extra.set(!extra())">Extra actions</button>
        <button type="button" (click)="present.set(!present())">Toggle presence</button>
      </div>
      <div class="examples" data-testid="fab-examples">
        <zd-fab label="New note" arrangement="single" inline (mainAction)="result.set('new note')"
          ><span zdFabIcon aria-hidden="true">N</span></zd-fab
        >
        @if (present()) {
          <zd-fab
            label="Create"
            closeLabel="Close create"
            inline
            [disabled]="disabled()"
            data-testid="fab-local"
          >
            <ng-template zdFabActions>
              <button
                type="button"
                zdButton
                zdFabAction
                zdTooltip="Create a draft"
                (click)="result.set('draft')"
              >
                Draft
              </button>
              <a zdButton zdFabAction href="/__zordon-tests__/fab#fab-result" keepOpen>Keep link</a>
              <button type="button" zdButton zdFabAction disabled>Unavailable</button>
              <button type="button" zdButton zdFabAction (click)="$event.preventDefault()">
                Cancelled
              </button>
            </ng-template>
          </zd-fab>
        }
        <div class="flower">
          <zd-fab
            label="Share"
            closeLabel="Close share"
            arrangement="flower"
            [inline]="!fixed()"
            [corner]="corner()"
            [open]="controlled()"
            (openChange)="change($event)"
            data-testid="fab-flower"
          >
            <ng-template zdFabActions>
              <button
                type="button"
                zdButton
                layout="circle"
                zdFabAction
                aria-label="Email"
                zdTooltip="Email"
                (click)="result.set('email')"
              >
                E
              </button>
              <button
                type="button"
                zdButton
                layout="circle"
                zdFabAction
                aria-label="Copy"
                zdTooltip="Copy"
              >
                C
              </button>
              <button
                type="button"
                zdButton
                layout="circle"
                zdFabAction
                aria-label="Print"
                zdTooltip="Print"
              >
                P
              </button>
              <button
                type="button"
                zdButton
                layout="circle"
                zdFabAction
                aria-label="Save"
                zdTooltip="Save"
              >
                S
              </button>
              @if (extra()) {
                <button type="button" zdButton zdFabAction>More</button>
              }
            </ng-template>
          </zd-fab>
        </div>
      </div>
      <button type="button" class="outside">Outside action</button>
      <p id="fab-result" role="status">{{ result() }}</p>
      <p>Requested: {{ request() }}</p>
    </section>
  `,
})
export class FabTestFixtureComponent {
  protected readonly rtl = signal(false);
  protected readonly accepted = signal(false);
  protected readonly controlled = signal(false);
  protected readonly disabled = signal(false);
  protected readonly fixed = signal(false);
  protected readonly corner = signal<ZdFabCorner>('bottom-end');
  protected readonly extra = signal(false);
  protected readonly present = signal(true);
  protected readonly result = signal('Ready');
  protected readonly request = signal(false);
  protected change(value: boolean): void {
    this.request.set(value);
    if (this.accepted()) this.controlled.set(value);
  }
}
