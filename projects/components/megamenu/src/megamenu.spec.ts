import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdDropdownPanel, ZdDropdownTrigger, ZdDropdownItem } from '@pranxy/zordon-ui/dropdown';
import { ZdMegamenu, ZdMegamenuBar, ZdMegamenuPanel } from './megamenu';

@Component({
  imports: [
    ZdMegamenu,
    ZdMegamenuPanel,
    ZdDropdownTrigger,
    ZdDropdownPanel,
    ZdMegamenuBar,
    ZdDropdownItem,
  ],
  template: `<div
      zdMegamenu
      #root="zdMegamenu"
      [closeOnNavigation]="navigation()"
      [open]="open()"
      (openChange)="requests.push($event)"
    >
      <button zdDropdownTrigger>Explore</button>
      <ng-template zdDropdownPanel
        ><zd-megamenu-panel [width]="width()" [columns]="columns()"
          ><a href="/guide">Guide</a><label>Search<input /></label></zd-megamenu-panel
      ></ng-template>
    </div>
    <zd-megamenu-bar aria-label="Commands"
      ><button zdDropdownItem value="save">Save</button></zd-megamenu-bar
    >`,
})
class Host {
  readonly root = viewChild.required<ZdMegamenu>('root');
  readonly navigation = signal(true);
  readonly open = signal<boolean | undefined>(undefined);
  readonly width = signal<'anchored' | 'full'>('anchored');
  readonly columns = signal<1 | 2 | 3 | 4>(3);
  readonly requests: boolean[] = [];
}
describe('Megamenu', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('opens native multi-column content without Router and composes prefix-aware Aria commands', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root = fixture.componentInstance.root();
    root.show();
    await fixture.whenStable();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    expect(root.expanded()).toBe(true);
    expect(overlay.querySelector('a')!.getAttribute('href')).toBe('/guide');
    expect(overlay.querySelector('zd-megamenu-panel')!.getAttribute('data-width')).toBe('anchored');
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('[role="menubar"]')!
        .classList.contains('du-megamenu'),
    ).toBe(true);
    fixture.componentInstance.width.set('full');
    fixture.componentInstance.columns.set(2);
    await fixture.whenStable();
    const panel = overlay.querySelector<HTMLElement>('zd-megamenu-panel')!;
    expect(panel.getAttribute('data-width')).toBe('full');
    expect(panel.style.getPropertyValue('--zd-megamenu-columns')).toBe('2');
    root.close();
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    fixture.destroy();
  });
  it('closes only after successful navigation, respects opt-out and unsubscribes on destruction', async () => {
    const events = new Subject<NavigationStart | NavigationEnd>();
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { events } }] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root = fixture.componentInstance.root();
    root.show();
    await fixture.whenStable();
    events.next(new NavigationStart(1, '/next'));
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    fixture.componentInstance.navigation.set(false);
    await fixture.whenStable();
    events.next(new NavigationEnd(1, '/next', '/next'));
    await fixture.whenStable();
    expect(root.expanded()).toBe(true);
    fixture.componentInstance.navigation.set(true);
    await fixture.whenStable();
    events.next(new NavigationEnd(2, '/last', '/last'));
    await fixture.whenStable();
    expect(root.expanded()).toBe(false);
    expect(events.observed).toBe(true);
    fixture.destroy();
    expect(events.observed).toBe(false);
  });
  it('preserves controlled requests until accepted and destroys open panels', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open.set(false);
    await fixture.whenStable();
    const host = fixture.componentInstance;
    host.root().show();
    await fixture.whenStable();
    expect(host.requests).toEqual([true]);
    expect(host.root().expanded()).toBe(false);
    host.open.set(true);
    await fixture.whenStable();
    host.root().close('navigation');
    await fixture.whenStable();
    expect(host.requests).toEqual([true, false]);
    expect(host.root().expanded()).toBe(true);
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    fixture.destroy();
    expect(overlay.querySelector('zd-megamenu-panel')).toBeNull();
  });
});
