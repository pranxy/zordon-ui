import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  ZdToastOutlet,
  ZdToastService,
  type ZdToastContext,
  type ZdToastPosition,
} from '@pranxy/zordon-ui/toast';
@Component({
  selector: 'docs-toast-daisy-styles',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './toast-daisy-fixture.css',
})
class ToastDaisyStyles {}
@Component({
  selector: 'docs-toast-test-fixture',
  imports: [ZdToastOutlet, ToastDaisyStyles],
  providers: [ZdToastService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './toast-fixture.css',
  template: `
    <docs-toast-daisy-styles />
    <main data-testid="toast-fixture" [dir]="direction()">
      <h1>Toast</h1>
      <p>Non-blocking notifications with queued delivery.</p>
      <label
        >Position
        <select [value]="position()" (change)="choosePosition($event)">
          @for (position of positions; track position) {
            <option [value]="position">{{ position }}</option>
          }
        </select></label
      >
      <div class="controls">
        <button type="button" (click)="show()">Show notice</button>
        <button type="button" (click)="show(800)">Timed notice</button>
        <button type="button" (click)="queue()">Queue five</button>
        <button type="button" (click)="dedupe()">Duplicate notice</button>
        <button type="button" (click)="styled()">Show styled</button>
        <button type="button" (click)="failAction()">Fail action</button>
        <button type="button" (click)="startWork()">Start task</button>
        <button type="button" (click)="resolveWork?.(42)">Resolve task</button>
        <button type="button" (click)="rejectWork?.('failure')">Reject task</button>
        <button type="button" (click)="service.clear()">Clear notices</button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
        <button type="button" (click)="mounted.set(!mounted())">Toggle outlet</button>
      </div>
      <p data-testid="toast-count">Stored: {{ service.items().length }}</p>
      <p data-testid="toast-actions">Actions: {{ actions() }}</p>
      <p data-testid="toast-result">{{ result() }}</p>
      <ng-template #custom let-item
        ><strong>{{ item.message }}</strong>
        <p>Ready for review.</p></ng-template
      >
      @if (mounted()) {
        <zd-toast-outlet [limit]="3" />
      }
    </main>
  `,
})
export class ToastTestFixtureComponent {
  readonly service = inject(ZdToastService);
  readonly position = signal<ZdToastPosition>('bottom-end');
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly mounted = signal(true);
  readonly actions = signal(0);
  readonly result = signal('No task result');
  readonly custom = viewChild.required<TemplateRef<ZdToastContext>>('custom');
  readonly positions: readonly ZdToastPosition[] = [
    'top-start',
    'top-center',
    'top-end',
    'middle-start',
    'middle-center',
    'middle-end',
    'bottom-start',
    'bottom-center',
    'bottom-end',
  ];
  resolveWork?: (value: number) => void;
  rejectWork?: (error: unknown) => void;
  constructor() {
    this.service.show({ message: 'Server-ready notice', duration: 0, priority: 'off' });
  }
  choosePosition(event: Event): void {
    this.position.set((event.target as HTMLSelectElement).value as ZdToastPosition);
  }
  show(duration = 0): void {
    this.service.show({ message: 'Notice received', duration, position: this.position() });
  }
  queue(): void {
    this.service.clear();
    for (let index = 1; index <= 5; index++)
      this.service.show({ message: `Queued ${index}`, duration: 0, position: this.position() });
  }
  dedupe(): void {
    this.service.show({
      message: 'One deduplicated notice',
      key: 'duplicate',
      duration: 0,
      position: this.position(),
    });
  }
  styled(): void {
    this.service.clear();
    this.service.show({
      message: 'Connection restored',
      color: 'info',
      duration: 0,
      position: this.position(),
    });
    this.service.show({
      message: 'Draft saved',
      color: 'success',
      position: this.position(),
      action: {
        label: 'Undo',
        errorMessage: 'Undo failed',
        run: () => {
          this.actions.update(value => value + 1);
        },
      },
    });
    this.service.show({
      message: 'Scheduled job',
      color: 'warning',
      duration: 0,
      position: this.position(),
      template: this.custom(),
    });
  }
  failAction(): void {
    this.service.show({
      message: 'Retry request',
      duration: 0,
      action: {
        label: 'Retry request',
        errorMessage: 'Request failed; retry is available',
        run: () => Promise.reject('failure'),
      },
    });
  }
  startWork(): void {
    void this.service
      .track(
        new Promise<number>((resolve, reject) => {
          this.resolveWork = resolve;
          this.rejectWork = reject;
        }),
        {
          loading: { message: 'Working on task', priority: 'polite' },
          success: value => ({ message: `Task complete: ${value}`, color: 'success', duration: 0 }),
          error: () => ({
            message: 'Task failed',
            color: 'error',
            duration: 0,
            priority: 'assertive',
          }),
        },
      )
      .then(
        value => this.result.set(`Result: ${value}`),
        () => this.result.set('Task rejected'),
      );
  }
}
