import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import {
  ZdTabs,
  ZdTabContent,
  type ZdTabItem,
  type ZdTabClose,
  type ZdTabReorder,
} from '@pranxy/zordon-ui/tabs';

@Component({
  selector: 'docs-tabs-test-fixture',
  imports: [ZdTabs, ZdTabContent, Dir],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      width: min(60rem, calc(100vw - 2rem));
      margin: 2rem auto;
    }
    section {
      margin-block: 1.5rem;
      padding: 1rem;
      border: 1px solid var(--color-base-300, GrayText);
      border-radius: 0.75rem;
    }
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.25rem;
      margin-block-end: 0.75rem;
    }
    .controls {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    input {
      border: 1px solid currentColor;
      padding: 0.25rem;
      max-width: 100%;
    }
  `,
  template: `
    <article data-testid="tabs-fixture" [dir]="direction()">
      <h1>Tabs</h1>
      <p>Aria navigation, controlled workspace panels and URL selection.</p>
      <div class="controls">
        <button type="button" (click)="direction.set(direction() === 'ltr' ? 'rtl' : 'ltr')">
          Toggle direction
        </button>
        <label
          ><input type="checkbox" [checked]="accept()" (change)="accept.set(!accept())" /> Accept
          requests</label
        >
        <label
          ><input type="checkbox" [checked]="preserve()" (change)="preserve.set(!preserve())" />
          Preserve panels</label
        >
      </div>
      <section>
        <h2>Workspace</h2>
        <zd-tabs
          label="Workspace"
          variant="box"
          [items]="items()"
          [activeId]="active()"
          [preserveContent]="preserve()"
          reorderable
          (activeIdChange)="select($event)"
          (closeRequest)="remove($event)"
          (reorder)="move($event)"
        >
          <ng-template zdTabContent let-item
            ><h3>{{ item.label }} panel</h3>
            <label>{{ item.label }} notes <input /></label
          ></ng-template>
        </zd-tabs>
        <p role="status">{{ request() }}</p>
      </section>
      <section>
        <h2>Manual vertical activation</h2>
        <zd-tabs
          label="Preferences"
          variant="lift"
          orientation="vertical"
          activation="manual"
          size="sm"
          [items]="preferences"
          [activeId]="preference()"
          (activeIdChange)="preference.set($event)"
        />
      </section>
      <section>
        <h2>URL selection</h2>
        <zd-tabs label="URL tabs" queryParam="tab" [items]="preferences" />
      </section>
      <section>
        <h2>Scrollable large tabs</h2>
        <zd-tabs
          label="Long labels"
          size="lg"
          [items]="longItems"
          [activeId]="longActive()"
          (activeIdChange)="longActive.set($event)"
        />
      </section>
    </article>
  `,
})
export class TabsTestFixtureComponent {
  readonly direction = signal<'ltr' | 'rtl'>('ltr');
  readonly accept = signal(true);
  readonly preserve = signal(true);
  readonly active = signal('overview');
  readonly preference = signal('general');
  readonly longActive = signal('one');
  readonly request = signal('No requests yet');
  readonly items = signal<readonly ZdTabItem[]>([
    { id: 'overview', label: 'Overview', closable: true },
    { id: 'locked', label: 'Unavailable', disabled: true },
    { id: 'activity', label: 'Activity', closable: true },
    { id: 'reports', label: 'Reports', closable: true },
  ]);
  readonly preferences: readonly ZdTabItem[] = [
    { id: 'general', label: 'General', content: 'General preferences' },
    { id: 'security', label: 'Security', content: 'Security preferences' },
    { id: 'billing', label: 'Billing', content: 'Billing preferences' },
  ];
  readonly longItems: readonly ZdTabItem[] = [
    { id: 'one', label: 'Planning and project overview', content: 'Planning details' },
    { id: 'two', label: 'Team responsibilities and milestones', content: 'Team details' },
    { id: 'three', label: 'Release preparation and acceptance', content: 'Release details' },
  ];
  select(id: string): void {
    this.request.set(`Requested ${id}`);
    if (this.accept()) this.active.set(id);
  }
  remove(event: ZdTabClose): void {
    this.request.set(`Close ${event.id}`);
    if (this.accept()) {
      this.items.update(items => items.filter(item => item.id !== event.id));
      this.active.set(event.nextId ?? '');
    }
  }
  move(event: ZdTabReorder): void {
    this.request.set(`Move ${event.id} to ${event.toIndex + 1}`);
    if (this.accept()) this.items.set(event.items);
  }
}
