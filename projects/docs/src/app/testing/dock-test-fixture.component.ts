import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewEncapsulation,
  computed,
  signal,
  viewChild,
} from '@angular/core';
import {
  ZdDock,
  type ZdDockItem,
  type ZdDockIconContext,
  type ZdDockSize,
  type ZdDockPosition,
  type ZdDockVisibility,
  type ZdDockLabels,
} from '@pranxy/zordon-ui/dock';
@Component({
  selector: 'docs-dock-daisy-styles',
  template: '',
  styleUrl: './dock-daisy-fixture.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DockDaisyStyles {}
@Component({
  selector: 'docs-dock-test-fixture',
  imports: [ZdDock, DockDaisyStyles],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './dock-fixture.css',
  template: `<docs-dock-daisy-styles />
    <main data-testid="dock-fixture" [dir]="direction()">
      <h1>Dock</h1>
      <p>Native destinations with route-aware navigation.</p>
      <div class="controls">
        <label
          >Size<select [value]="size()" (change)="setSize($event)">
            <option>xs</option>
            <option>sm</option>
            <option>md</option>
            <option>lg</option>
            <option>xl</option>
          </select></label
        >
        <label
          >Position<select [value]="position()" (change)="setPosition($event)">
            <option>static</option>
            <option>sticky</option>
            <option>fixed</option>
          </select></label
        >
        <label
          >Visibility<select [value]="visibility()" (change)="setVisibility($event)">
            <option>always</option>
            <option>mobile</option>
            <option>desktop</option>
          </select></label
        >
        <label
          >Labels<select [value]="labels()" (change)="setLabels($event)">
            <option>always</option>
            <option>compact</option>
            <option>hidden</option>
          </select></label
        >
        <button type="button" (click)="more.set(!more())">Toggle extra items</button>
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
        <button type="button" (click)="activeId.set(activeId() === 'mail' ? undefined : 'mail')">
          Toggle manual active
        </button>
        <button type="button" (click)="reserve.set(!reserve())">Toggle reserved space</button>
      </div>
      <ng-template #icon let-item
        ><svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          focusable="false"
        >
          @switch (item.id) {
            @case ('home') {
              <path d="M3 11 12 3 21 11M5 10V21H19V10M9 21V14H15V21" />
            }
            @case ('search') {
              <circle cx="10" cy="10" r="6" />
              <path d="m15 15 6 6" />
            }
            @case ('mail') {
              <path d="M3 5H21V19H3ZM3 5l9 8 9-8" />
            }
            @default {
              <circle cx="12" cy="12" r="8" />
              <path d="M8 12h8M12 8v8" />
            }
          }</svg
      ></ng-template>
      <section
        class="stage"
        [class.sticky]="position() === 'sticky'"
        data-testid="dock-stage"
        aria-label="Dock layout example"
      >
        <div class="filler" [class.tall]="position() === 'sticky'">
          <h2>Workspace content</h2>
          <p>Choose a destination below.</p>
        </div>
        <zd-dock
          [items]="items()"
          [size]="size()"
          [position]="position()"
          [visibility]="visibility()"
          [labels]="labels()"
          [activeId]="activeId()"
          [reserveSpace]="reserve()"
          label="Workspace destinations"
        />
        <div class="tail">
          <p>Content following the dock.</p>
          <button type="button">Outside action</button>
        </div>
      </section>
    </main>`,
})
export class DockTestFixtureComponent {
  readonly size = signal<ZdDockSize>('md');
  readonly position = signal<ZdDockPosition>('static');
  readonly visibility = signal<ZdDockVisibility>('always');
  readonly labels = signal<ZdDockLabels>('always');
  readonly more = signal(false);
  readonly reserve = signal(true);
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly activeId = signal<string | undefined>(undefined);
  readonly icon = viewChild<TemplateRef<ZdDockIconContext>>('icon');
  readonly items = computed<readonly ZdDockItem[]>(() => [
    { id: 'home', label: 'Home', routerLink: ['.'], icon: this.icon() },
    {
      id: 'search',
      label: 'Search',
      routerLink: ['.'],
      queryParams: { section: 'search' },
      icon: this.icon(),
    },
    {
      id: 'mail',
      label: 'Messages',
      routerLink: ['.'],
      queryParams: { section: 'mail' },
      badge: 3,
      badgeLabel: '3 unread messages',
      icon: this.icon(),
    },
    { id: 'settings', label: 'Settings unavailable', disabled: true, icon: this.icon() },
    ...(this.more()
      ? Array.from({ length: 6 }, (_, i) => ({
          id: `extra-${i}`,
          label: `Destination ${i + 1}`,
          href: `#destination-${i + 1}`,
          icon: this.icon(),
        }))
      : []),
  ]);
  setSize(event: Event): void {
    this.size.set((event.target as HTMLSelectElement).value as ZdDockSize);
  }
  setPosition(event: Event): void {
    this.position.set((event.target as HTMLSelectElement).value as ZdDockPosition);
  }
  setVisibility(event: Event): void {
    this.visibility.set((event.target as HTMLSelectElement).value as ZdDockVisibility);
  }
  setLabels(event: Event): void {
    this.labels.set((event.target as HTMLSelectElement).value as ZdDockLabels);
  }
}
