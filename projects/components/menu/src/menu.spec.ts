import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideZordonUi } from '@pranxy/zordon-ui';
import {
  ZdMenu,
  ZdMenuTree,
  type ZdMenuItem,
  type ZdMenuNode,
  type ZdMenuIconContext,
} from './public-api';

@Component({ template: '<ng-template #icon let-item><b>{{ item.id }}</b></ng-template>' })
class IconHost {
  readonly icon = viewChild.required<TemplateRef<ZdMenuIconContext>>('icon');
}
@Component({ template: '' })
class Destination {}

describe('Menu', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('renders native titles, separators, nested controlled disclosure and unavailable leaves', async () => {
    const fixture = TestBed.createComponent(ZdMenu);
    const items: readonly ZdMenuItem[] = [
      { id: 'title', kind: 'title', label: 'Workspace' },
      {
        id: 'home',
        kind: 'item',
        label: 'Home',
        href: '#home',
        badge: 0,
        badgeLabel: 'No unread items',
        shortcut: 'H',
      },
      { id: 'separator', kind: 'separator', label: 'Section boundary' },
      {
        id: 'group',
        label: 'Resources',
        children: [{ id: 'guide', label: 'Guide', href: '#guide' }],
      },
      { id: 'disabled', label: 'Unavailable', disabled: true },
      { id: 'empty', label: 'Empty child array', href: '#empty', children: [] },
    ];
    fixture.componentRef.setInput('items', items);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Navigation');
    expect(el.querySelector('hr')).not.toBeNull();
    expect(el.querySelector('a')!.getAttribute('aria-label')).toBe('Home, No unread items');
    expect(el.querySelector('kbd')!.textContent).toBe('H');
    expect(el.querySelector('[aria-disabled]')!.hasAttribute('href')).toBe(false);
    const button = el.querySelector('button')!;
    const requests: (readonly string[])[] = [];
    fixture.componentInstance.expandedIds.subscribe(value => requests.push(value));
    button.click();
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const groupId = button.getAttribute('aria-controls')!;
    expect(el.querySelector(`[id="${groupId}"]`)!.hasAttribute('hidden')).toBe(false);
    button.click();
    await fixture.whenStable();
    expect(requests).toEqual([['group'], []]);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    fixture.componentRef.setInput('expandedIds', ['group']);
    await fixture.whenStable();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const event = new MouseEvent('click', { cancelable: true, ctrlKey: true });
    el.querySelector('a')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    expect(el.querySelectorAll('li').length).toBe(0);
  });
  it('supports prefix classes, all sizes, horizontal layout, templates and manual current-page state', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const host = TestBed.createComponent(IconHost);
    await host.whenStable();
    const fixture = TestBed.createComponent(ZdMenu);
    fixture.componentRef.setInput('items', [
      { id: 'home', label: 'Home', href: '#home', icon: host.componentInstance.icon() },
    ]);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('activeId', 'home');
    fixture.componentRef.setInput('label', 'Site');
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
      fixture.componentRef.setInput('size', size);
      await fixture.whenStable();
      expect(fixture.nativeElement.querySelector('ul').classList.contains(`du-menu-${size}`)).toBe(
        true,
      );
    }
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Site');
    expect(el.querySelector('ul')!.classList.contains('du-menu-horizontal')).toBe(true);
    expect(el.querySelector('a')!.classList.contains('du-menu-active')).toBe(true);
    expect(el.querySelector('a')!.getAttribute('aria-current')).toBe('page');
    expect(el.querySelector('.zd-icon b')!.textContent).toBe('home');
    fixture.componentRef.setInput('activeId', null);
    await fixture.whenStable();
    expect(el.querySelector('a')!.hasAttribute('aria-current')).toBe(false);
  });
  it('synchronizes Router navigation and manual overrides without overriding native destinations', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'home', component: Destination },
          { path: 'guide', component: Destination },
        ]),
      ],
    });
    const fixture = TestBed.createComponent(ZdMenu);
    fixture.componentRef.setInput('items', [
      { id: 'home', label: 'Home', routerLink: '/home' },
      {
        id: 'guide',
        label: 'Guide',
        routerLink: ['/guide'],
        queryParams: { version: 1 },
        fragment: 'intro',
      },
    ]);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/home');
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[1].getAttribute('href')).toBe('/guide?version=1#intro');
    links[1].click();
    await fixture.whenStable();
    expect(router.url).toBe('/guide?version=1#intro');
    expect(links[1].getAttribute('aria-current')).toBe('page');
    fixture.componentRef.setInput('activeId', 'home');
    await fixture.whenStable();
    expect(links[0].getAttribute('aria-current')).toBe('page');
    expect(links[1].hasAttribute('aria-current')).toBe(false);
    fixture.componentRef.setInput('activeId', undefined);
    fixture.componentRef.setInput('routeExact', false);
    await router.navigateByUrl('/guide?version=1&extra=yes');
    await fixture.whenStable();
    expect(links[1].getAttribute('aria-current')).toBe('page');
  });
  it('rejects duplicate/blank identities and ambiguous or missing destinations throughout nested lists', () => {
    const invalid: readonly ZdMenuItem[][] = [
      [{ id: '', label: 'Home', href: '/' }],
      [{ id: 'home', label: ' ', href: '/' }],
      [{ id: 'home', label: 'Home', children: [{ id: 'home', label: 'Duplicate', href: '/' }] }],
      [{ id: 'x', label: 'X' }],
      [{ id: 'x', label: 'X', href: '/', routerLink: '/' }],
      [{ id: 'x', label: 'X', href: '/', children: [{ id: 'y', label: 'Y', href: '/y' }] }],
    ];
    for (const items of invalid) {
      const fixture = TestBed.createComponent(ZdMenu);
      fixture.componentRef.setInput('items', items);
      expect(() => fixture.detectChanges()).toThrow(RangeError);
      fixture.destroy();
    }
  });
  it('composes Aria hierarchy, controlled expansion/selection and decorative node content', async () => {
    const host = TestBed.createComponent(IconHost);
    await host.whenStable();
    const fixture = TestBed.createComponent(ZdMenuTree);
    const items: readonly ZdMenuNode[] = [
      {
        id: 'folder',
        label: 'Folder',
        children: [
          {
            id: 'file',
            label: 'File',
            badge: 2,
            badgeLabel: '2 revisions',
            shortcut: 'F',
            icon: host.componentInstance.icon(),
          },
          { id: 'disabled', label: 'Disabled', disabled: true },
        ],
      },
      { id: 'other', label: 'Other' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('expandedIds', ['folder']);
    fixture.componentRef.setInput('selectedIds', ['file']);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[role="tree"]')).not.toBeNull();
    expect(
      el.querySelector('[aria-label="File, 2 revisions"]')!.getAttribute('aria-selected'),
    ).toBe('true');
    expect(el.querySelector('.zd-icon b')!.textContent).toBe('file');
    expect(el.querySelector('[aria-label="Disabled"]')!.getAttribute('aria-disabled')).toBe('true');
    const folder = el.querySelector<HTMLElement>('[aria-label="Folder"]')!;
    folder.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    folder.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.expandedIds()).toEqual([]);
    folder.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await fixture.whenStable();
    expect(fixture.componentInstance.expandedIds()).toEqual(['folder']);
    const expander = folder.querySelector<HTMLButtonElement>('button')!;
    expander.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    expander.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expandedIds()).toEqual([]);
    expander.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.expandedIds()).toEqual(['folder']);
    const instance = fixture.componentInstance as unknown as {
      expand(id: string, open: boolean): void;
    };
    instance.expand('folder', true);
    await fixture.whenStable();
    expect(fixture.componentInstance.expandedIds()).toEqual(['folder']);
    instance.expand('folder', false);
    await fixture.whenStable();
    expect(fixture.componentInstance.expandedIds()).toEqual([]);
    fixture.componentRef.setInput('orientation', 'horizontal');
    fixture.componentRef.setInput('size', 'xl');
    fixture.componentRef.setInput('multi', true);
    fixture.componentRef.setInput('wrap', false);
    fixture.componentRef.setInput('typeaheadDelay', 200);
    fixture.componentRef.setInput('label', 'Files');
    await fixture.whenStable();
    expect(el.querySelector('ul')!.classList.contains('menu-horizontal')).toBe(true);
    expect(el.querySelector('[role="tree"]')!.getAttribute('aria-multiselectable')).toBe('true');
    const other = el.querySelector<HTMLElement>('[aria-label="Other"]')!;
    other.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    await fixture.whenStable();
    expect(fixture.componentInstance.selectedIds()).toContain('other');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    expect(el.querySelector('[role="tree"]')!.getAttribute('aria-disabled')).toBe('true');
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    expect(el.querySelectorAll('[role="treeitem"]').length).toBe(0);
  });
});
