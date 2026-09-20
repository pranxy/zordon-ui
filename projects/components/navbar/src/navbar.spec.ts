import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { provideZordonUi } from '@pranxy/zordon-ui';
import {
  ZdNavbar,
  ZdNavbarContent,
  ZdNavbarToggle,
  type ZdNavbarPosition,
  type ZdNavbarVisibility,
} from './public-api';

@Component({
  imports: [ZdNavbar, ZdNavbarContent, ZdNavbarToggle, RouterLink, RouterLinkActive],
  template: `<zd-navbar label="Workspace" [position]="position()" [transparent]="transparent()">
      <a zdNavbarStart href="#home">Brand</a>
      <zd-navbar-content zdNavbarCenter [visibility]="visibility()">
        <a routerLink="/guide" routerLinkActive="current" ariaCurrentWhenActive="page">Guide</a>
      </zd-navbar-content>
      <span>Default content</span>
      <button
        zdNavbarEnd
        zdNavbarToggle
        controls="mobile-links"
        [expanded]="expanded()"
        [disabled]="disabled()"
        (expandedChange)="requests.push($event)"
      >
        Navigation
      </button>
    </zd-navbar>
    <div id="mobile-links" [hidden]="!expanded()">Destinations</div>`,
})
class Host {
  readonly position = signal<ZdNavbarPosition>('static');
  readonly visibility = signal<ZdNavbarVisibility>('always');
  readonly transparent = signal(false);
  readonly expanded = signal(false);
  readonly disabled = signal(false);
  readonly requests: boolean[] = [];
}
@Component({ template: '' })
class Destination {}

describe('Navbar', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('projects native navigation and Router state into prefix-aware regions', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'guide', component: Destination }]),
        provideZordonUi({ classPrefixes: { daisyUi: 'du-' } }),
      ],
    });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('nav')!.getAttribute('aria-label')).toBe('Workspace');
    expect(el.querySelector('nav')!.classList.contains('du-navbar')).toBe(true);
    expect(el.querySelector('.du-navbar-start a')!.textContent).toBe('Brand');
    expect(el.querySelector('.du-navbar-center')!.textContent).toContain('Default content');
    expect(el.querySelector('.du-navbar-end button')!.getAttribute('type')).toBe('button');
    await TestBed.inject(Router).navigateByUrl('/guide');
    await fixture.whenStable();
    expect(el.querySelector('a.current')!.getAttribute('aria-current')).toBe('page');
    for (const position of ['sticky', 'fixed', 'static'] as const) {
      fixture.componentInstance.position.set(position);
      await fixture.whenStable();
      expect(el.querySelector('zd-navbar')!.getAttribute('data-position')).toBe(position);
    }
    fixture.componentInstance.transparent.set(true);
    for (const visibility of ['mobile', 'desktop', 'always'] as const) {
      fixture.componentInstance.visibility.set(visibility);
      await fixture.whenStable();
      expect(el.querySelector('zd-navbar-content')!.getAttribute('data-visibility')).toBe(
        visibility,
      );
    }
    expect(el.querySelector('zd-navbar')!.getAttribute('data-transparent')).toBe('true');
  });
  it('requests controlled changes and suppresses disabled activation without owning panel focus', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    const button = el.querySelector('button')!;
    button.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.requests).toEqual([true]);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('#mobile-links')!.hasAttribute('hidden')).toBe(true);
    fixture.componentInstance.expanded.set(true);
    await fixture.whenStable();
    expect(button.getAttribute('aria-controls')).toBe('mobile-links');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    expect(fixture.componentInstance.requests).toEqual([true, false]);
    fixture.componentInstance.disabled.set(true);
    await fixture.whenStable();
    button.click();
    button.dispatchEvent(new MouseEvent('click'));
    expect(button.disabled).toBe(true);
    expect(fixture.componentInstance.requests).toEqual([true, false]);
  });
  it('provides native standalone defaults without a Router', async () => {
    const fixture = TestBed.createComponent(ZdNavbar);
    await fixture.whenStable();
    expect(fixture.componentInstance.position()).toBe('static');
    expect(fixture.componentInstance.transparent()).toBe(false);
    expect(fixture.nativeElement.querySelector('nav').getAttribute('aria-label')).toBe(
      'Primary navigation',
    );
    const content = TestBed.createComponent(ZdNavbarContent);
    await content.whenStable();
    expect(content.componentInstance.visibility()).toBe('always');
    fixture.componentRef.setInput('transparent', '');
    await fixture.whenStable();
    expect(fixture.componentInstance.transparent()).toBe(true);
  });
});
