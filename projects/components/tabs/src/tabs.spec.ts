import { APP_ID, Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { TabList } from '@angular/aria/tabs';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdTabs, ZdTabContent, type ZdTabItem } from './public-api';

@Component({
  imports: [ZdTabs, ZdTabContent],
  template: `<zd-tabs [items]="items" [activeId]="active" [lazy]="lazy" [preserveContent]="preserve"
    ><ng-template zdTabContent let-item><input [value]="item.label" /></ng-template
  ></zd-tabs>`,
})
class PanelHost {
  readonly content = viewChild.required(ZdTabContent);
  items: readonly ZdTabItem[] = [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
  ];
  active = 'a';
  lazy = true;
  preserve = false;
}
describe('Tabs', () => {
  afterEach(() => TestBed.resetTestingModule());
  const items: readonly ZdTabItem[] = [
    { id: 'a', label: 'Alpha', content: 'Alpha content', closable: true },
    { id: 'x', label: 'Unavailable', disabled: true },
    { id: 'b', label: 'Beta', content: 'Beta content', closable: true },
  ];
  function relationships(element: HTMLElement) {
    const tabs = Array.from(element.querySelectorAll<HTMLElement>('[role="tab"]'));
    return Object.fromEntries(
      tabs.map(tab => {
        const panelId = tab.getAttribute('aria-controls')!;
        const panel = document.getElementById(panelId)!;
        expect(tab.id).not.toBe('');
        expect(panelId).not.toBe('');
        expect(element.contains(panel)).toBe(true);
        expect(panel.getAttribute('role')).toBe('tabpanel');
        expect(panel.getAttribute('aria-labelledby')).toBe(tab.id);
        expect(panel.textContent!.trim()).toBe(tab.textContent!.trim());
        return [tab.textContent!.trim(), { tab: tab.id, panel: panelId }];
      }),
    );
  }
  it('recreates the same tab relationships in fresh applications without colliding between widgets', async () => {
    const renderApplication = async () => {
      TestBed.configureTestingModule({ providers: [{ provide: APP_ID, useValue: 'tabs-app' }] });
      const widgets = [];
      for (let index = 0; index < 2; index++) {
        const fixture = TestBed.createComponent(ZdTabs);
        fixture.componentRef.setInput('items', [{ id: 'a', label: 'Alpha', content: 'Alpha' }]);
        await fixture.whenStable();
        widgets.push(relationships(fixture.nativeElement));
      }
      const ids = widgets.flatMap(widget =>
        Object.values(widget).flatMap(pair => Object.values(pair)),
      );
      expect(new Set(ids).size).toBe(ids.length);
      return widgets;
    };
    const first = await renderApplication();
    TestBed.resetTestingModule();
    expect(await renderApplication()).toEqual(first);
  });
  it('keeps item relationships stable through reorder, removal and readdition of arbitrary IDs', async () => {
    const unusualItems = ['a b', 'a_b', 'a-b', 'a:b', 'é', 'e\u0301', '😀', '1f600'].map(
      (id, index) => ({ id, label: `Item ${index}`, content: `Item ${index}` }),
    );
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', unusualItems);
    fixture.componentRef.setInput('lazy', false);
    await fixture.whenStable();
    const initial = relationships(fixture.nativeElement);
    const ids = Object.values(initial).flatMap(pair => Object.values(pair));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(id => !/\s/.test(id))).toBe(true);
    fixture.componentRef.setInput('items', [...unusualItems].reverse());
    await fixture.whenStable();
    expect(relationships(fixture.nativeElement)).toEqual(initial);
    fixture.componentRef.setInput('items', unusualItems.slice(1));
    await fixture.whenStable();
    const remaining = relationships(fixture.nativeElement);
    const { 'Item 0': removed, ...expected } = initial;
    expect(remaining).toEqual(expected);
    expect(document.getElementById(removed.tab)).toBeNull();
    expect(document.getElementById(removed.panel)).toBeNull();
    fixture.componentRef.setInput('items', unusualItems);
    await fixture.whenStable();
    expect(relationships(fixture.nativeElement)).toEqual(initial);
  });
  it('renders accepted state and rejects optimistic Aria selection until the owner accepts', async () => {
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', items);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.componentInstance.currentId()).toBe('a');
    expect(el.querySelector('[aria-selected="true"]')!.textContent!.trim()).toBe('Alpha');
    const requested: string[] = [];
    fixture.componentInstance.activeIdChange.subscribe(id => requested.push(id));
    el.querySelectorAll<HTMLButtonElement>('[role="tab"]')[2].dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, button: 0 }),
    );
    await fixture.whenStable();
    expect(requested).toEqual(['b']);
    expect(fixture.componentInstance.currentId()).toBe('a');
    expect(el.querySelector('[role="tabpanel"]:not([hidden])')!.textContent).toContain(
      'Alpha content',
    );
    fixture.componentRef.setInput('activeId', 'b');
    await fixture.whenStable();
    expect(el.querySelector('[aria-selected="true"]')!.textContent!.trim()).toBe('Beta');
  });
  it('creates, destroys and preserves lazy panels', async () => {
    const fixture = TestBed.createComponent(PanelHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(1);
    const first = fixture.nativeElement.querySelector('input');
    fixture.componentInstance.active = 'b';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(1);
    expect(first.isConnected).toBe(false);
    fixture.componentInstance.preserve = true;
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    fixture.componentInstance.active = 'a';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(2);
    fixture.componentInstance.preserve = false;
    fixture.componentInstance.lazy = false;
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('input')).toHaveLength(2);
    const directive = fixture.componentInstance.content();
    expect(ZdTabContent.ngTemplateContextGuard(directive, {})).toBe(true);
  });
  it('retains the same editable node when preservation is enabled from first render', async () => {
    const fixture = TestBed.createComponent(PanelHost);
    fixture.componentInstance.preserve = true;
    await fixture.whenStable();
    const first: HTMLInputElement = fixture.nativeElement.querySelector('input');
    first.value = 'Draft';
    fixture.componentInstance.active = 'b';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    fixture.componentInstance.active = 'a';
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('input')).toBe(first);
    expect(first.value).toBe('Draft');
    fixture.componentInstance.items = [{ id: 'b', label: 'Beta' }];
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
    expect(first.isConnected).toBe(false);
  });
  it('handles empty, disabled, removed and unknown IDs without emitting fallback requests', async () => {
    const fixture = TestBed.createComponent(ZdTabs);
    const requested: string[] = [];
    fixture.componentInstance.activeIdChange.subscribe(id => requested.push(id));
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBeNull();
    fixture.nativeElement
      .querySelector('[role="tablist"]')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.componentRef.setInput('items', [items[1]]);
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBeNull();
    fixture.nativeElement
      .querySelector('[role="tab"]')
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const list = fixture.debugElement.query(By.directive(TabList)).injector.get(TabList);
    list.selectedTab.set('x');
    await fixture.whenStable();
    expect(requested).toEqual([]);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('activeId', 'missing');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBe('a');
    fixture.componentRef.setInput('activeId', 'x');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBe('a');
    fixture.componentRef.setInput('items', [items[2]]);
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBe('b');
    expect(requested).toEqual([]);
  });
  it('guards synthetic selection, current activation and whole-widget disabling', async () => {
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', items);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const requested: string[] = [];
    fixture.componentInstance.activeIdChange.subscribe(id => requested.push(id));
    const tabs = el.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[0].click();
    tabs[2].click();
    expect(requested).toEqual(['b']);
    const canceled = new MouseEvent('click', { cancelable: true, bubbles: true });
    canceled.preventDefault();
    tabs[2].dispatchEvent(canceled);
    tabs[2].dispatchEvent(new MouseEvent('click', { detail: 1, bubbles: true }));
    const list = fixture.debugElement.query(By.directive(TabList)).injector.get(TabList);
    list.selectedTab.set(undefined);
    list.selectedTab.set('missing');
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    tabs[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
    expect(requested).toEqual(['b']);
    expect([...tabs].every(tab => tab.getAttribute('aria-disabled') === 'true')).toBe(true);
  });
  it('requests removal, waits for acceptance and recovers focus to a surviving tab', async () => {
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', items);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const requests: unknown[] = [];
    fixture.componentInstance.closeRequest.subscribe(event => requests.push(event));
    el.querySelector<HTMLButtonElement>('.zd-tab-actions button')!.click();
    await fixture.whenStable();
    expect(requests).toEqual([{ id: 'a', nextId: 'b' }]);
    expect(el.querySelectorAll('[role="tab"]')).toHaveLength(3);
    fixture.componentRef.setInput('items', [items[1], items[2]]);
    await fixture.whenStable();
    expect(document.activeElement).toBe(el.querySelectorAll('[role="tab"]')[1]);
    el.querySelectorAll('[role="tab"]')[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }),
    );
    el.querySelector<HTMLButtonElement>('.zd-tab-actions button')!.click();
    expect(requests).toEqual([
      { id: 'a', nextId: 'b' },
      { id: 'b', nextId: null },
    ]);
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    expect(el.querySelectorAll('[role="tab"]')).toHaveLength(0);
  });
  it('offers the nearest enabled prior tab and ignores nonclosable Delete', async () => {
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', [{ ...items[0], closable: false }, items[1], items[2]]);
    fixture.componentRef.setInput('activeId', 'b');
    await fixture.whenStable();
    const requests: unknown[] = [];
    fixture.componentInstance.closeRequest.subscribe(event => requests.push(event));
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
    expect(requests).toEqual([{ id: 'b', nextId: 'a' }]);
  });
  it('emits immutable reorder proposals, preserves identity and respects boundaries', async () => {
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('reorderable', true);
    await fixture.whenStable();
    const original = [...items];
    const requests: import('./public-api').ZdTabReorder[] = [];
    fixture.componentInstance.reorder.subscribe(event => requests.push(event));
    const buttons = () =>
      fixture.nativeElement.querySelectorAll(
        '.zd-tab-actions button',
      ) as NodeListOf<HTMLButtonElement>;
    buttons()[1].dispatchEvent(new MouseEvent('click'));
    buttons()[2].click();
    expect(requests[0]).toEqual({
      id: 'a',
      fromIndex: 0,
      toIndex: 1,
      items: [items[1], items[0], items[2]],
    });
    expect(items).toEqual(original);
    fixture.componentRef.setInput('items', requests[0].items);
    await fixture.whenStable();
    expect(document.activeElement!.textContent!.trim()).toBe('Alpha');
    buttons()[1].click();
    expect(requests[1].toIndex).toBe(0);
    fixture.componentRef.setInput('activeId', 'b');
    await fixture.whenStable();
    buttons()[2].dispatchEvent(new MouseEvent('click'));
    fixture.componentRef.setInput('disabled', true);
    await fixture.whenStable();
    buttons()[1].dispatchEvent(new MouseEvent('click'));
    fixture.componentRef.setInput('disabled', false);
    fixture.componentRef.setInput('reorderable', false);
    await fixture.whenStable();
    fixture.componentInstance['move'](1);
    fixture.componentRef.setInput('reorderable', true);
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    fixture.componentInstance['move'](1);
    expect(requests).toHaveLength(2);
    fixture.componentRef.setInput('items', [
      { id: 'a', label: 'Alpha' },
      { id: 'b', label: 'Beta' },
    ]);
    fixture.componentRef.setInput('activation', 'manual');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.zd-tab-actions button')).toHaveLength(2);
  });
  it('uses prefix-aware classes and localized action names', async () => {
    TestBed.overrideComponent(ZdTabs, { add: { styles: [':host { border: 1px solid; }'] } });
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('variant', 'box');
    fixture.componentRef.setInput('size', 'xl');
    fixture.componentRef.setInput('orientation', 'vertical');
    fixture.componentRef.setInput('labels', {
      close: (label: string) => `Fermer ${label}`,
      earlier: (label: string) => label,
      later: (label: string) => label,
    });
    fixture.componentRef.setInput('reorderable', true);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.du-tabs.du-tabs-box.du-tabs-xl')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.du-tab')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.zd-tab-actions button').textContent.trim()).toBe(
      'Fermer Alpha',
    );
  });
  it('uses URL selection as authority and retains unrelated query state and fragments', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'items', component: PanelHost }])],
    });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/items?tab=b&filter=all#details');
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('queryParam', 'tab');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBe('b');
    fixture.nativeElement.querySelector('[role="tab"]').click();
    await fixture.whenStable();
    expect(router.url).toBe('/items?tab=a&filter=all#details');
    await router.navigateByUrl('/items?tab=unknown');
    await fixture.whenStable();
    expect(fixture.componentInstance.currentId()).toBe('a');
  });
  it('rejects invalid identity and Router configuration', () => {
    for (const bad of [[{ id: '', label: 'A' }], [{ id: 'a', label: '' }], [items[0], items[0]]]) {
      const fixture = TestBed.createComponent(ZdTabs);
      fixture.componentRef.setInput('items', bad);
      expect(() => fixture.detectChanges()).toThrow(/unique nonempty/);
      fixture.destroy();
    }
    for (const query of ['', 'tab']) {
      const fixture = TestBed.createComponent(ZdTabs);
      fixture.componentRef.setInput('queryParam', query);
      expect(() => fixture.detectChanges()).toThrow(query ? /requires Router/ : /nonempty/);
      fixture.destroy();
    }
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ActivatedRoute, useValue: null }],
    });
    const fixture = TestBed.createComponent(ZdTabs);
    fixture.componentRef.setInput('queryParam', 'tab');
    expect(() => fixture.detectChanges()).toThrow(/requires Router/);
    fixture.destroy();
  });
});
