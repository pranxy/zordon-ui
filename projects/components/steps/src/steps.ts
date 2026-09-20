import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { ZdClassNames, type ZdColor, type ZdOrientation } from '@pranxy/zordon-ui';

export type ZdStepState = 'complete' | 'current' | 'upcoming' | 'error';
export interface ZdStep {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  /** Current state comes from currentId; an error can coexist with the current step. */
  readonly state?: Exclude<ZdStepState, 'current'>;
  readonly disabled?: boolean;
  readonly color?: ZdColor;
  readonly icon?: TemplateRef<ZdStepIconContext>;
  /** Optional ID of an existing owner-managed wizard panel. */
  readonly controls?: string;
}
export interface ZdStepIconContext {
  readonly $implicit: ZdStep;
  readonly index: number;
  readonly state: ZdStepState;
}
export interface ZdStepsLabels {
  readonly complete: string;
  readonly current: string;
  readonly upcoming: string;
  readonly error: string;
  readonly disabled: string;
}

@Component({
  selector: 'zd-steps',
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-orientation]': 'orientation()', '[attr.data-responsive]': 'responsive()' },
  styleUrl: './steps.css',
  template: `
    <ol
      class="zd-list"
      [class]="classes()"
      [attr.aria-label]="label()"
      [attr.tabindex]="!responsive() && orientation() === 'horizontal' ? 0 : null"
    >
      @for (item of checked(); track item.id; let index = $index) {
        <li
          class="zd-step"
          [class]="itemClass(item)"
          [attr.data-state]="state(item)"
          [attr.data-disabled]="item.disabled || disabled()"
          [attr.aria-current]="item.id === currentId() ? 'step' : null"
        >
          <span class="zd-marker" [class]="iconClass" aria-hidden="true">
            @if (item.icon) {
              <ng-container
                [ngTemplateOutlet]="item.icon"
                [ngTemplateOutletContext]="{ $implicit: item, index, state: state(item) }"
              />
            } @else {
              {{ state(item) === 'complete' ? '✓' : state(item) === 'error' ? '!' : index + 1 }}
            }
          </span>
          @if (interactive()) {
            <button
              type="button"
              class="zd-body"
              [disabled]="!available(index)"
              [attr.aria-controls]="item.controls"
              (click)="request(index)"
            >
              <ng-container
                [ngTemplateOutlet]="body"
                [ngTemplateOutletContext]="{ $implicit: item }"
              />
            </button>
          } @else {
            <span class="zd-body"
              ><ng-container
                [ngTemplateOutlet]="body"
                [ngTemplateOutletContext]="{ $implicit: item }"
            /></span>
          }
        </li>
      }
    </ol>
    <ng-template #body let-item>
      <span class="zd-label">{{ item.label }}</span>
      @if (item.description) {
        <span class="zd-description">{{ item.description }}</span>
      }
      <span class="zd-status">{{ stateText(item) }}</span>
    </ng-template>
  `,
})
export class ZdSteps {
  readonly items = input<readonly ZdStep[]>([]);
  readonly currentId = input<string | null>(null);
  readonly currentIdChange = output<string>();
  readonly label = input('Progress');
  readonly orientation = input<ZdOrientation>('horizontal');
  readonly responsive = input(true, { transform: booleanAttribute });
  readonly interactive = input(false, { transform: booleanAttribute });
  readonly linear = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly color = input<ZdColor>('primary');
  readonly labels = input<ZdStepsLabels>({
    complete: 'Completed',
    current: 'Current',
    upcoming: 'Upcoming',
    error: 'Error',
    disabled: 'Unavailable',
  });
  private readonly names = inject(ZdClassNames);
  protected readonly iconClass = this.names.daisyUi('step-icon');
  protected readonly classes = computed(
    () => `${this.names.daisyUi('steps')} ${this.names.daisyUi('steps-' + this.orientation())}`,
  );
  protected readonly checked = computed(() => {
    const ids = new Set<string>();
    for (const item of this.items()) {
      if (!item.id.trim() || !item.label.trim() || ids.has(item.id))
        throw new RangeError('Steps require unique nonempty IDs and labels.');
      ids.add(item.id);
    }
    if (this.currentId() !== null && !ids.has(this.currentId()!))
      throw new RangeError('Steps currentId must identify an existing step or be null.');
    return this.items();
  });
  readonly currentIndex = computed(() =>
    this.checked().findIndex(item => item.id === this.currentId()),
  );
  protected state(item: ZdStep): ZdStepState {
    if (item.state === 'error') return 'error';
    return item.id === this.currentId() ? 'current' : (item.state ?? 'upcoming');
  }
  protected stateText(item: ZdStep): string {
    const state = this.state(item);
    const parts = [this.labels()[state]];
    if (state === 'error' && item.id === this.currentId()) parts.push(this.labels().current);
    if (item.disabled) parts.push(this.labels().disabled);
    return parts.join(' · ');
  }
  protected itemClass(item: ZdStep): string {
    const state = this.state(item);
    const color =
      item.color ??
      (state === 'error'
        ? 'error'
        : state === 'complete'
          ? 'success'
          : state === 'current'
            ? this.color()
            : undefined);
    return color
      ? `${this.names.daisyUi('step')} ${this.names.daisyUi('step-' + color)}`
      : this.names.daisyUi('step');
  }
  protected available(index: number): boolean {
    return (
      !this.disabled() &&
      !this.checked()[index].disabled &&
      (!this.linear() ||
        index <= this.currentIndex() ||
        this.checked()
          .slice(0, index)
          .every(item => item.state === 'complete'))
    );
  }
  protected request(index: number): void {
    if (!this.available(index)) return;
    const id = this.checked()[index].id;
    if (id !== this.currentId()) this.currentIdChange.emit(id);
  }
}
