import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  TemplateRef,
  ViewEncapsulation,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  ZdSteps,
  type ZdStep,
  type ZdStepIconContext,
  type ZdOrientation,
  type ZdColor,
} from '@pranxy/zordon-ui/steps';

@Component({
  selector: 'docs-steps-test-fixture',
  imports: [ZdSteps],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./steps-daisy-fixture.css', './steps-fixture.css'],
  template: `<main data-testid="steps-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
    <h1>Steps</h1>
    <p>Ordered progress and owner-controlled wizard navigation.</p>
    <div class="controls">
      <button
        type="button"
        (click)="orientation.set(orientation() === 'horizontal' ? 'vertical' : 'horizontal')"
      >
        Toggle orientation
      </button>
      <button type="button" (click)="responsive.set(!responsive())">Toggle responsive</button>
      <button type="button" (click)="linear.set(!linear())">Toggle linear</button>
      <button type="button" (click)="accept.set(!accept())">Toggle acceptance</button>
      <button type="button" (click)="disabled.set(!disabled())">Toggle disabled</button>
      <button type="button" (click)="error.set(!error())">Toggle delivery error</button>
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <label
        >Current color<select (change)="setColor($event)">
          <option>neutral</option>
          <option selected>primary</option>
          <option>secondary</option>
          <option>accent</option>
          <option>info</option>
          <option>success</option>
          <option>warning</option>
          <option>error</option>
        </select></label
      >
    </div>
    <section>
      <h2>Checkout wizard</h2>
      <zd-steps
        label="Checkout progress"
        [items]="wizard()"
        [currentId]="current()"
        interactive
        [linear]="linear()"
        [disabled]="disabled()"
        [orientation]="orientation()"
        [responsive]="responsive()"
        [color]="color()"
        (currentIdChange)="select($event)"
      />
      <div id="details-panel" class="panel" [hidden]="current() !== 'details'">
        <h3 id="details-title" tabindex="-1">Your details</h3>
        <form (submit)="$event.preventDefault(); advance('delivery')">
          <label>Name<input name="name" required /></label
          ><button type="submit">Continue to delivery</button>
        </form>
      </div>
      <div id="delivery-panel" class="panel" [hidden]="current() !== 'delivery'">
        <h3 id="delivery-title" tabindex="-1">Delivery address</h3>
        <form (submit)="$event.preventDefault(); advance('review')">
          <label>Address<input name="address" required /></label
          ><button type="submit">Continue to review</button>
        </form>
      </div>
      <div id="review-panel" class="panel" [hidden]="current() !== 'review'">
        <h3 id="review-title" tabindex="-1">Review your order</h3>
        <p>Review the completed details before placing your order.</p>
      </div>
      <output aria-label="Requested step">{{ requested() }}</output>
    </section>
    <ng-template #icon
      ><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" focusable="false">
        <path d="m5 12 4 4L19 6" /></svg
    ></ng-template>
    <section>
      <h2>Display-only deployment</h2>
      <zd-steps
        label="Deployment progress"
        [items]="deployment()"
        currentId="deploy"
        [orientation]="orientation()"
        [responsive]="responsive()"
      />
    </section>
  </main>`,
})
export class StepsTestFixtureComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  readonly icon = viewChild<TemplateRef<ZdStepIconContext>>('icon');
  readonly current = signal('details');
  readonly completed = signal<readonly string[]>([]);
  readonly requested = signal('None');
  readonly accept = signal(true);
  readonly disabled = signal(false);
  readonly linear = signal(true);
  readonly error = signal(false);
  readonly responsive = signal(true);
  readonly orientation = signal<ZdOrientation>('horizontal');
  readonly color = signal<ZdColor>('primary');
  readonly rtl = signal(false);
  readonly wizard = computed<readonly ZdStep[]>(() => [
    {
      id: 'details',
      label: 'Details',
      description: 'Your identity',
      controls: 'details-panel',
      state: this.completed().includes('details') ? 'complete' : 'upcoming',
    },
    {
      id: 'delivery',
      label: 'Delivery',
      description: 'Shipping address',
      controls: 'delivery-panel',
      state: this.error()
        ? 'error'
        : this.completed().includes('delivery')
          ? 'complete'
          : 'upcoming',
    },
    { id: 'review', label: 'Review', description: 'Confirm your order', controls: 'review-panel' },
  ]);
  readonly deployment = computed<readonly ZdStep[]>(() => [
    { id: 'build', label: 'Build', state: 'complete', icon: this.icon() },
    { id: 'deploy', label: 'Deploy', description: 'Connection needs attention', state: 'error' },
    { id: 'verify', label: 'Verify', disabled: true },
    { id: 'notify', label: 'Notify', color: 'info' },
  ]);
  select(id: string): void {
    this.requested.set(id);
    if (this.accept()) this.activate(id);
  }
  advance(id: string): void {
    this.completed.update(items => [...new Set([...items, this.current()])]);
    this.error.set(false);
    this.activate(id);
  }
  private activate(id: string): void {
    this.current.set(id);
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>(`#${id}-title`)!.focus(),
      { injector: this.injector },
    );
  }
  setColor(event: Event): void {
    this.color.set((event.target as HTMLSelectElement).value as ZdColor);
  }
}
