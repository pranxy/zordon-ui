import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Directionality } from '@angular/cdk/bidi';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ZdDrawer, ZdDrawerPanel, type ZdDrawerReason } from './public-api';
import { provideZordonUi } from '@pranxy/zordon-ui';

@Component({
  imports: [ZdDrawer, ZdDrawerPanel],
  template: `<zd-drawer [open]="open" [mode]="mode" swipe
    ><ng-template zdDrawerPanel let-close
      ><input aria-label="Editor" /><button (click)="close()">Close panel</button></ng-template
    ><button>Content action</button></zd-drawer
  >`,
})
class Host {
  open = true;
  mode: 'persistent' | 'modal' = 'persistent';
  readonly panel = viewChild.required(ZdDrawerPanel);
  readonly drawer = viewChild.required(ZdDrawer);
}
describe('Drawer', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });
  it('renders named inline content, stable controls identity and controlled closing', async () => {
    const f = TestBed.createComponent(Host);
    await f.whenStable();
    const drawer = f.componentInstance.drawer(),
      requests: boolean[] = [];
    drawer.openChange.subscribe(value => requests.push(value));
    expect(f.nativeElement.querySelector('aside').id).toBe(drawer.panelId);
    expect(f.nativeElement.querySelector('aside').getAttribute('aria-label')).toBe('Drawer');
    expect(ZdDrawerPanel.ngTemplateContextGuard(f.componentInstance.panel(), {})).toBe(true);
    f.nativeElement.querySelector('aside button').click();
    await f.whenStable();
    expect(requests).toEqual([false]);
    expect(f.nativeElement.querySelector('input')).toBeTruthy();
    f.componentInstance.open = false;
    f.changeDetectorRef.markForCheck();
    await f.whenStable();
    expect(f.nativeElement.querySelector('aside').hidden).toBe(true);
    expect(f.nativeElement.querySelector('input')).toBeNull();
    drawer.requestClose();
    expect(requests).toHaveLength(1);
  });
  it('composes a live modal surface, named swipe control and accepted teardown', async () => {
    const f = TestBed.createComponent(Host);
    f.componentInstance.mode = 'modal';
    await f.whenStable();
    const dialog = document.querySelector('dialog')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.querySelector('.zd-drawer-surface')!.id).toBe(
      f.componentInstance.drawer().panelId,
    );
    const requests: ZdDrawerReason[] = [];
    f.componentInstance.drawer().closeRequest.subscribe(reason => requests.push(reason));
    dialog.querySelector<HTMLButtonElement>('.zd-drawer-swipe')!.click();
    for (const type of ['pointerdown', 'pointerup', 'pointercancel'])
      dialog
        .querySelector('.zd-drawer-swipe')!
        .dispatchEvent(new MouseEvent(type, { bubbles: true }));
    expect(requests).toEqual(['close']);
    f.componentInstance.open = false;
    f.changeDetectorRef.markForCheck();
    await f.whenStable();
    expect(document.querySelector('dialog')).toBeNull();
  });
  it('keeps rejected escape/backdrop requests open and observes live policy inputs', async () => {
    const f = TestBed.createComponent(ZdDrawer);
    f.componentRef.setInput('open', true);
    await f.whenStable();
    const reasons: ZdDrawerReason[] = [];
    f.componentInstance.closeRequest.subscribe(reason => reasons.push(reason));
    const guard = f.componentInstance['options']().beforeClose!;
    expect(await guard({ reason: 'escape' })).toBe(false);
    expect(await guard({ reason: 'backdrop' })).toBe(false);
    expect(await guard({ reason: 'submit' })).toBe(false);
    f.componentRef.setInput('closeOnEscape', false);
    f.componentRef.setInput('closeOnBackdrop', false);
    await f.whenStable();
    await guard({ reason: 'escape' });
    await guard({ reason: 'backdrop' });
    expect(reasons).toEqual(['escape', 'backdrop', 'close']);
    expect(document.querySelector('dialog')).toBeTruthy();
  });
  it('updates responsive media and cleans up the listener after breakpoint changes and destruction', async () => {
    let matches = false;
    const listeners = new Set<() => void>();
    const media = {
      get matches() {
        return matches;
      },
      addEventListener: vi.fn((_event: string, fn: () => void) => listeners.add(fn)),
      removeEventListener: vi.fn((_event: string, fn: () => void) => listeners.delete(fn)),
    };
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => media),
    );
    try {
      const f = TestBed.createComponent(ZdDrawer);
      f.componentRef.setInput('mode', 'responsive');
      await f.whenStable();
      expect(f.componentInstance.effectiveMode()).toBe('modal');
      matches = true;
      listeners.forEach(fn => fn());
      await f.whenStable();
      expect(f.componentInstance.effectiveMode()).toBe('persistent');
      f.componentRef.setInput('desktopMode', 'push');
      f.componentRef.setInput('breakpoint', 900);
      await f.whenStable();
      expect(f.componentInstance.effectiveMode()).toBe('push');
      expect(media.removeEventListener).toHaveBeenCalled();
      f.destroy();
      expect(listeners.size).toBe(0);
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it('keeps the desktop mode when the environment has no matchMedia', async () => {
    vi.stubGlobal('matchMedia', undefined);
    try {
      const f = TestBed.createComponent(ZdDrawer);
      f.componentRef.setInput('mode', 'responsive');
      f.componentRef.setInput('desktopMode', 'push');
      await f.whenStable();
      expect(f.componentInstance.effectiveMode()).toBe('push');
      f.destroy();
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it('closes only on successful Router navigation when enabled and still open', async () => {
    const events = new Subject<NavigationStart | NavigationEnd>();
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { events } }] });
    const f = TestBed.createComponent(ZdDrawer);
    f.componentRef.setInput('mode', 'persistent');
    f.componentRef.setInput('open', true);
    await f.whenStable();
    const reasons: ZdDrawerReason[] = [];
    f.componentInstance.closeRequest.subscribe(reason => reasons.push(reason));
    events.next(new NavigationEnd(1, '/a', '/a'));
    f.componentRef.setInput('closeOnNavigation', true);
    await f.whenStable();
    events.next(new NavigationStart(2, '/b'));
    events.next(new NavigationEnd(2, '/b', '/b'));
    expect(reasons).toEqual(['navigation']);
    f.componentRef.setInput('open', false);
    await f.whenStable();
    events.next(new NavigationEnd(3, '/c', '/c'));
    expect(reasons).toHaveLength(1);
    f.destroy();
    expect(events.observed).toBe(false);
  });
  it('recognizes deliberate outward touch and pen swipes, canceling mismatches and duplicate clicks', async () => {
    const f = TestBed.createComponent(ZdDrawer);
    f.componentRef.setInput('mode', 'persistent');
    f.componentRef.setInput('open', true);
    await f.whenStable();
    const d = f.componentInstance,
      reasons: ZdDrawerReason[] = [];
    d.closeRequest.subscribe(reason => reasons.push(reason));
    const target = { setPointerCapture: vi.fn() };
    const event = (type: string, x: number, y = 0, id = 1) =>
      ({
        pointerType: type,
        clientX: x,
        clientY: y,
        pointerId: id,
        currentTarget: target,
        preventDefault: vi.fn(),
      }) as unknown as PointerEvent;
    d['startSwipe'](event('mouse', 100));
    d['endSwipe'](event('mouse', 0));
    d['startSwipe'](event('touch', 100));
    d['endSwipe'](event('touch', 0, 0, 2));
    d['startSwipe'](event('touch', 100));
    d['cancelSwipe']();
    d['endSwipe'](event('touch', 0));
    d['startSwipe'](event('touch', 100));
    d['endSwipe'](event('touch', 90));
    d['startSwipe'](event('touch', 100));
    d['endSwipe'](event('touch', 0, 200));
    d['startSwipe'](event('touch', 100));
    d['endSwipe'](event('touch', 0));
    const click = new MouseEvent('click', { detail: 1, cancelable: true });
    d['swipeClick'](click);
    expect(click.defaultPrevented).toBe(true);
    f.componentRef.setInput('side', 'end');
    await f.whenStable();
    d['startSwipe'](event('pen', 0));
    d['endSwipe'](event('pen', 100));
    d['swipeClick'](new MouseEvent('click', { detail: 0 }));
    TestBed.inject(Directionality).valueSignal.set('rtl');
    d['startSwipe'](event('touch', 100));
    d['endSwipe'](event('touch', 0));
    expect(reasons).toEqual(['swipe', 'swipe', 'close', 'swipe']);
  });
  it('validates dimensions and uses prefix-aware host composition', async () => {
    TestBed.overrideComponent(ZdDrawer, { add: { styles: ['zd-drawer { border: 0; }'] } });
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const f = TestBed.createComponent(ZdDrawer);
    await f.whenStable();
    expect(f.nativeElement.classList.contains('du-drawer')).toBe(true);
    for (const value of [0, -1, Infinity, NaN]) {
      f.componentRef.setInput('width', value);
      expect(() => f.componentInstance['checkedWidth']()).toThrow(/width/);
    }
    expect(() => f.componentInstance['positive'](0, 'breakpoint')).toThrow(/breakpoint/);
  });
});
