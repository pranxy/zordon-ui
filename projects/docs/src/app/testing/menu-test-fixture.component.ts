import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Dir } from '@angular/cdk/bidi';
import {
  ZdMenu,
  ZdMenuTree,
  type ZdMenuItem,
  type ZdMenuNode,
  type ZdMenuIconContext,
  type ZdMenuSize,
  type ZdMenuOrientation,
} from '@pranxy/zordon-ui/menu';
import {
  ZdDropdown,
  ZdDropdownTrigger,
  ZdDropdownPanel,
  ZdDropdownMenu,
  ZdDropdownItem,
} from '@pranxy/zordon-ui/dropdown';

@Component({
  selector: 'docs-menu-test-fixture',
  encapsulation: ViewEncapsulation.None,
  imports: [
    Dir,
    ZdMenu,
    ZdMenuTree,
    ZdDropdown,
    ZdDropdownTrigger,
    ZdDropdownPanel,
    ZdDropdownMenu,
    ZdDropdownItem,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./menu-daisy-fixture.css', './menu-fixture.css'],
  template: `<main data-testid="menu-fixture" [dir]="rtl() ? 'rtl' : 'ltr'">
    <h1>Menu</h1>
    <p>Native destinations and a selectable Aria hierarchy.</p>
    <div class="controls">
      <label
        >Size<select (change)="setSize($event)">
          <option>xs</option>
          <option>sm</option>
          <option selected>md</option>
          <option>lg</option>
          <option>xl</option>
        </select></label
      >
      <button
        type="button"
        (click)="orientation.set(orientation() === 'vertical' ? 'horizontal' : 'vertical')"
      >
        Toggle orientation
      </button>
      <button type="button" (click)="rtl.set(!rtl())">Toggle direction</button>
      <button type="button" (click)="expanded.set(expanded().length ? [] : ['resources'])">
        Toggle navigation group
      </button>
      <button type="button" (click)="treeExpanded.set(treeExpanded().length ? [] : ['projects'])">
        Toggle tree group
      </button>
      <button type="button" (click)="multi.set(!multi())">Toggle multiple selection</button>
      <button type="button" (click)="manual.set(manual() ? undefined : 'guide')">
        Toggle manual active
      </button>
    </div>
    <ng-template #icon let-item
      ><svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M4 5h16v14H4z M8 9h8 M8 13h5" /></svg
    ></ng-template>
    <section class="examples">
      <div>
        <h2>Site destinations</h2>
        <zd-menu
          [items]="navigation()"
          label="Workspace navigation"
          [size]="size()"
          [orientation]="orientation()"
          [(expandedIds)]="expanded"
          [activeId]="manual()"
        />
      </div>
      <div>
        <h2>Project selection</h2>
        <zd-menu-tree
          [items]="nodes()"
          label="Project files"
          [size]="size()"
          [orientation]="orientation()"
          [(expandedIds)]="treeExpanded"
          [(selectedIds)]="selected"
          [multi]="multi()"
        />
      </div>
    </section>
    <p>
      Selected: <output aria-label="Selected files">{{ selected().join(', ') || 'none' }}</output>
    </p>
    <div zdDropdown mode="menu" (selected)="action.set($event)">
      <button zdDropdownTrigger>File commands</button>
      <ng-template zdDropdownPanel
        ><zd-dropdown-menu aria-label="File commands"
          ><button zdDropdownItem value="copy">Copy <span aria-hidden="true">⌘C</span></button
          ><button zdDropdownItem value="delete" [disabled]="true">Delete</button>
          <div zdDropdown mode="menu" side="end">
            <button zdDropdownTrigger zdDropdownItem value="export">Export</button
            ><ng-template zdDropdownPanel
              ><zd-dropdown-menu aria-label="Export formats"
                ><button zdDropdownItem value="pdf">PDF</button
                ><button zdDropdownItem value="csv">CSV</button></zd-dropdown-menu
              ></ng-template
            >
          </div></zd-dropdown-menu
        ></ng-template
      >
    </div>
    <p>
      Action: <output aria-label="Last command">{{ action() }}</output>
    </p>
    <button type="button">After menus</button>
  </main>`,
})
export class MenuTestFixtureComponent {
  readonly size = signal<ZdMenuSize>('md');
  readonly orientation = signal<ZdMenuOrientation>('vertical');
  readonly rtl = signal(false);
  readonly expanded = signal<readonly string[]>(['resources']);
  readonly treeExpanded = signal<readonly string[]>([]);
  readonly selected = signal<string[]>([]);
  readonly multi = signal(false);
  readonly manual = signal<string | undefined>(undefined);
  readonly action = signal<unknown>('none');
  readonly icon = viewChild<TemplateRef<ZdMenuIconContext>>('icon');
  readonly navigation = computed<readonly ZdMenuItem[]>(() => [
    { id: 'title', label: 'Workspace', kind: 'title' },
    { id: 'home', label: 'Home', routerLink: ['.'], icon: this.icon() },
    {
      id: 'inbox',
      label: 'Inbox',
      routerLink: ['.'],
      queryParams: { section: 'inbox' },
      badge: 3,
      badgeLabel: '3 unread messages',
      shortcut: 'I',
    },
    { id: 'sep', label: 'Resource boundary', kind: 'separator' },
    {
      id: 'resources',
      label: 'Resources',
      children: [
        { id: 'guide', label: 'Guide', href: '#guide' },
        { id: 'api', label: 'API reference', routerLink: ['.'], queryParams: { section: 'api' } },
      ],
    },
    { id: 'locked', label: 'Settings unavailable', disabled: true },
  ]);
  readonly nodes = computed<readonly ZdMenuNode[]>(() => [
    {
      id: 'projects',
      label: 'Projects',
      icon: this.icon(),
      children: [
        { id: 'alpha', label: 'Alpha', badge: 0, badgeLabel: 'No issues' },
        { id: 'locked-file', label: 'Locked file', disabled: true },
        { id: 'beta', label: 'Beta', shortcut: 'B' },
      ],
    },
    { id: 'archive', label: 'Archive' },
  ]);
  setSize(event: Event): void {
    this.size.set((event.target as HTMLSelectElement).value as ZdMenuSize);
  }
}
