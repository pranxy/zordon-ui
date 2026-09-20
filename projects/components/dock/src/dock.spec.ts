import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdDock, type ZdDockItem, type ZdDockIconContext } from './dock';
@Component({ template: '<ng-template #icon let-item><b>{{ item.id }}</b></ng-template>' })
class IconHost {
  readonly icon = viewChild.required<TemplateRef<ZdDockIconContext>>('icon');
}
@Component({ template: '' })
class Destination {}
const items: readonly ZdDockItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'mail', label: 'Mail', href: '#mail', badge: 0, badgeLabel: 'No unread messages' },
  { id: 'locked', label: 'Settings', disabled: true },
];
describe('Dock', () => {
  afterEach(() => TestBed.resetTestingModule());
  async function setup(value = items) {
    const fixture = TestBed.createComponent(ZdDock);
    fixture.componentRef.setInput('items', value);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }
  it('renders native navigation, complete names, badges and inert disabled destinations', async () => {
    const { fixture, element } = await setup();
    expect(element.querySelector('nav')!.getAttribute('aria-label')).toBe('Primary navigation');
    expect(element.querySelectorAll('a').length).toBe(2);
    expect(element.querySelectorAll('[aria-current]').length).toBe(0);
    expect(element.querySelector('.zd-badge')!.textContent).toBe('0');
    expect(element.querySelectorAll('a')[1].getAttribute('aria-label')).toBe(
      'Mail, No unread messages',
    );
    const disabled = element.querySelector('[aria-disabled]')!;
    expect(disabled.tagName).toBe('SPAN');
    expect(disabled.hasAttribute('href')).toBe(false);
    expect(disabled.hasAttribute('tabindex')).toBe(false);
    expect(element.getAttribute('data-position')).toBe('fixed');
    expect(element.getAttribute('data-reserve')).toBe('true');
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    expect(element.querySelectorAll('.zd-item').length).toBe(0);
  });
  it('updates all sizes, layout policies and manual active state with prefix-aware classes', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const { fixture, element } = await setup();
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl']) {
      fixture.componentRef.setInput('size', size);
      await fixture.whenStable();
      expect(element.querySelector('nav')!.classList.contains(`du-dock-${size}`)).toBe(true);
    }
    fixture.componentRef.setInput('activeId', 'home');
    await fixture.whenStable();
    expect(element.querySelector('a')!.classList.contains('du-dock-active')).toBe(true);
    expect(element.querySelector('a')!.getAttribute('aria-current')).toBe('page');
    expect(element.querySelector('.zd-label')!.classList.contains('du-dock-label')).toBe(true);
    fixture.componentRef.setInput('activeId', null);
    fixture.componentRef.setInput('position', 'sticky');
    fixture.componentRef.setInput('visibility', 'mobile');
    fixture.componentRef.setInput('labels', 'hidden');
    fixture.componentRef.setInput('reserveSpace', false);
    fixture.componentRef.setInput('label', 'App sections');
    await fixture.whenStable();
    expect(element.querySelectorAll('[aria-current]').length).toBe(0);
    expect(element.getAttribute('data-position')).toBe('sticky');
    expect(element.getAttribute('data-visibility')).toBe('mobile');
    expect(element.getAttribute('data-reserve')).toBe('false');
    expect(element.querySelector('nav')!.getAttribute('data-labels')).toBe('hidden');
    expect(element.querySelector('nav')!.getAttribute('aria-label')).toBe('App sections');
  });
  it('synchronizes RouterLinkActive with navigation and supports explicit override/reset', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'home', component: Destination },
          { path: 'mail', component: Destination },
        ]),
      ],
    });
    const { fixture, element } = await setup([
      { id: 'home', label: 'Home', routerLink: '/home' },
      {
        id: 'mail',
        label: 'Mail',
        routerLink: ['/mail'],
        queryParams: { page: 2 },
        fragment: 'inbox',
      },
    ]);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/home');
    await fixture.whenStable();
    expect(element.querySelector('[aria-current]')!.getAttribute('aria-label')).toBe('Home');
    const mail = element.querySelectorAll('a')[1];
    expect(mail.getAttribute('href')).toBe('/mail?page=2#inbox');
    mail.click();
    await fixture.whenStable();
    expect(router.url).toBe('/mail?page=2#inbox');
    expect(mail.getAttribute('aria-current')).toBe('page');
    fixture.componentRef.setInput('activeId', 'home');
    await fixture.whenStable();
    expect(element.querySelector('[aria-current]')!.getAttribute('aria-label')).toBe('Home');
    fixture.componentRef.setInput('activeId', null);
    await fixture.whenStable();
    expect(element.querySelectorAll('[aria-current]').length).toBe(0);
    fixture.componentRef.setInput('activeId', undefined);
    await fixture.whenStable();
    expect(mail.getAttribute('aria-current')).toBe('page');
    fixture.componentRef.setInput('routeExact', false);
    await router.navigateByUrl('/mail?page=2&extra=yes');
    await fixture.whenStable();
    expect(mail.getAttribute('aria-current')).toBe('page');
  });
  it('renders decorative templates with item context and leaves modified href activation native', async () => {
    const host = TestBed.createComponent(IconHost);
    await host.whenStable();
    const { element } = await setup([
      {
        id: 'icon',
        label: 'Icon destination',
        href: '#target',
        icon: host.componentInstance.icon(),
        badge: 'New',
      },
    ]);
    expect(element.querySelector('.zd-icon b')!.textContent).toBe('icon');
    expect(element.querySelector('.zd-icon')!.getAttribute('aria-hidden')).toBe('true');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    element.querySelector('a')!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });
  it('rejects ambiguous destinations and invalid identity while allowing unavailable items without links', () => {
    for (const value of [
      [{ id: '', label: 'x', href: '/' }],
      [{ id: 'x', label: '', href: '/' }],
      [
        { id: 'x', label: 'x', href: '/' },
        { id: 'x', label: 'y', href: '/' },
      ],
      [{ id: 'x', label: 'x', href: '/', routerLink: '/' }],
      [{ id: 'x', label: 'x' }],
    ]) {
      const f = TestBed.createComponent(ZdDock);
      f.componentRef.setInput('items', value);
      expect(() => f.detectChanges()).toThrow(RangeError);
      f.destroy();
    }
  });
});
