import { Dir } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  ZdTooltip,
  type ZdTooltipColor,
  type ZdTooltipSide,
  type ZdTooltipAlign,
} from '@pranxy/zordon-ui/tooltip';
import {
  ZdDropdown,
  ZdDropdownTrigger,
  ZdDropdownPanel,
  ZdDropdownMenu,
  ZdDropdownItem,
} from '@pranxy/zordon-ui/dropdown';

@Component({
  selector: 'docs-tooltip-test-fixture',
  imports: [
    Dir,
    ZdTooltip,
    ZdDropdown,
    ZdDropdownTrigger,
    ZdDropdownPanel,
    ZdDropdownMenu,
    ZdDropdownItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      width: min(54rem, calc(100vw - 4rem));
    }
    section {
      padding: 1.5rem;
      background: var(--color-base-100);
      color: var(--color-base-content);
    }
    .row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      margin-block: 1.5rem;
    }
    button,
    [role='group'] {
      border: 1px solid var(--color-base-300);
      border-radius: 0.4rem;
      padding: 0.5rem 0.75rem;
    }
    .palette {
      display: flex;
      flex-wrap: wrap;
      gap: 4rem 1.25rem;
      padding-block: 4rem 2rem;
      padding-inline: 1rem;
    }
    input {
      display: block;
      color: var(--color-base-content);
      background: var(--color-base-100);
      padding: 0.4rem;
      border: 1px solid currentColor;
    }
    .edge {
      position: fixed;
      top: 4px;
      right: 4px;
      z-index: 20;
    }
    .outside {
      min-height: 3rem;
      padding: 1rem;
      border: 1px dashed currentColor;
    }
  `,
  template: `
    <section
      [dir]="rtl() ? 'rtl' : 'ltr'"
      aria-label="Tooltip examples"
      data-testid="tooltip-fixture"
    >
      <h1>Tooltip</h1>
      <p id="tooltip-existing">Existing help.</p>
      <div class="row">
        <button
          type="button"
          zdTooltip="Saves your current draft."
          #plain="zdTooltip"
          aria-describedby="tooltip-existing"
          [side]="side()"
          [align]="align()"
          [showDelay]="0"
          data-testid="tooltip-plain"
        >
          Save draft
        </button>
        <button type="button" [zdTooltip]="rich" [showDelay]="50" [hideDelay]="80" trigger="hover">
          Hover help
        </button>
        <button type="button" zdTooltip="Focus keeps this hint open." trigger="focus" side="end">
          Focus help
        </button>
        <button
          type="button"
          [zdTooltip]="form"
          interactive
          tooltipLabel="Draft settings"
          color="primary"
          [showDelay]="0"
          data-testid="tooltip-dialog"
        >
          Draft settings
        </button>
        <button
          type="button"
          zdTooltip="Long-press help."
          [longPressDelay]="80"
          [touchHideDelay]="100"
          (click)="activations.update(increment)"
          data-testid="tooltip-touch"
        >
          Touch help
        </button>
        <span
          role="group"
          tabindex="0"
          aria-label="Unavailable deletion"
          zdTooltip="You need edit access to delete this draft."
          [showDelay]="0"
          ><button type="button" disabled>Delete draft</button></span
        >
      </div>
      <div class="row">
        <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
        <button type="button" (click)="side.set('start')">Place at start</button>
        <button type="button" (click)="side.set('bottom')">Place below</button>
        <button type="button" (click)="align.set('end')">Align end</button>
        <button type="button" (click)="palette.set(!palette())">Show colors</button>
        <button type="button" (click)="present.set(!present())">Toggle presence</button>
      </div>
      @if (present()) {
        <div zdDropdown mode="menu" data-testid="tooltip-dropdown">
          <button type="button" zdDropdownTrigger>Menu with help</button>
          <ng-template zdDropdownPanel>
            <zd-dropdown-menu aria-label="Draft actions">
              <button
                type="button"
                zdDropdownItem
                value="edit"
                [zdTooltip]="form"
                interactive
                tooltipLabel="Menu help"
                [showDelay]="0"
                data-testid="tooltip-menu-item"
              >
                Edit settings
              </button>
              <button type="button" zdDropdownItem value="save">Save draft action</button>
            </zd-dropdown-menu>
          </ng-template>
        </div>
      }
      <div class="row">
        <button type="button" (click)="locked.set(!locked())">Toggle controlled help</button>
        <button
          type="button"
          zdTooltip="Consumer-controlled help."
          trigger="manual"
          [open]="locked()"
          (openChange)="requests.update(increment)"
          #lockedTip="zdTooltip"
          data-testid="tooltip-controlled"
        >
          Controlled help
        </button>
      </div>
      <div class="outside" data-testid="tooltip-outside">Outside interaction area</div>
      <output aria-label="Tooltip results">{{ activations() }} / {{ requests() }}</output>
      <div class="palette" data-testid="tooltip-palette">
        @for (color of colors; track color) {
          <button
            type="button"
            [zdTooltip]="color + ' hint'"
            [color]="color"
            trigger="manual"
            [open]="palette()"
          >
            {{ color }}
          </button>
        }
      </div>
      <button
        type="button"
        class="edge"
        zdTooltip="A longer hint near the viewport edge."
        [showDelay]="0"
        side="top"
        align="end"
        data-testid="tooltip-edge"
      >
        Edge help
      </button>
      <ng-template #rich
        ><strong>Rich help</strong><span> stays reachable while you read it.</span></ng-template
      >
      <ng-template #form>
        <label>Draft name<input name="draft-name" value="Working draft" /></label>
        <button type="button">Apply settings</button>
      </ng-template>
    </section>
  `,
})
export class TooltipTestFixtureComponent {
  protected readonly rtl = signal(false);
  protected readonly side = signal<ZdTooltipSide>('top');
  protected readonly align = signal<ZdTooltipAlign>('center');
  protected readonly present = signal(true);
  protected readonly palette = signal(false);
  protected readonly locked = signal(false);
  protected readonly activations = signal(0);
  protected readonly requests = signal(0);
  protected readonly increment = (value: number) => value + 1;
  protected readonly colors: ZdTooltipColor[] = [
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
