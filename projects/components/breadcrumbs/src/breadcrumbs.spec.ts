import { Component, TemplateRef, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdBreadcrumbs, type ZdBreadcrumbItem, type ZdBreadcrumbIconContext } from './breadcrumbs';
@Component({ template: '<ng-template #icon let-item><b>{{ item.id }}</b></ng-template>' })
class IconHost {
  readonly icon = viewChild.required<TemplateRef<ZdBreadcrumbIconContext>>('icon');
}
@Component({ template: '' })
class Destination {}
const trail: ZdBreadcrumbItem[] = Array.from({ length: 6 }, (_, i) => ({
  id: `i${i}`,
  label: `Level ${i}`,
  href: `#level-${i}`,
  canonicalUrl: `https://example.com/level-${i}`,
}));
describe('Breadcrumbs', () => {
  afterEach(() => TestBed.resetTestingModule());
  async function setup(items: readonly ZdBreadcrumbItem[] = trail) {
    const fixture = TestBed.createComponent(ZdBreadcrumbs);
    fixture.componentRef.setInput('items', items);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }
  it('renders an ordered labelled native trail with one current page and a bounded collapsed middle', async () => {
    const { fixture, element } = await setup();
    expect(element.querySelector('nav')!.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(element.querySelectorAll('.zd-trail > li').length).toBe(4);
    expect(element.querySelectorAll('.zd-overflow a').length).toBe(3);
    expect(element.querySelector('[aria-current]')!.textContent).toContain('Level 5');
    expect(element.querySelectorAll('[aria-current]').length).toBe(1);
    expect(element.querySelectorAll('.zd-separator[aria-hidden="true"]').length).toBe(3);
    fixture.componentRef.setInput('maxItems', 6);
    await fixture.whenStable();
    expect(element.querySelector('details')).toBeNull();
    expect(element.querySelectorAll('.zd-trail > li').length).toBe(6);
    element.querySelector('a')!.click();
    await fixture.whenStable();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
    expect(element.querySelectorAll('li').length).toBe(0);
  });
  it('dismisses overflow on Escape, outside interaction and navigation without overriding native activation', async () => {
    const { fixture, element } = await setup();
    const details = element.querySelector('details')!;
    const summary = element.querySelector('summary')!;
    details.open = true;
    const inside = new MouseEvent('click', { bubbles: true });
    summary.dispatchEvent(inside);
    await fixture.whenStable();
    details.open = true;
    const key = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    details.dispatchEvent(key);
    await fixture.whenStable();
    expect(key.defaultPrevented).toBe(true);
    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
    details.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    details.open = true;
    details.querySelector('a')!.focus();
    document.body.click();
    await fixture.whenStable();
    expect(details.open).toBe(false);
    expect(document.activeElement).toBe(summary);
    document.body.click();
    details.open = true;
    const anchor = details.querySelector('a')!;
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
    anchor.dispatchEvent(click);
    await fixture.whenStable();
    expect(click.defaultPrevented).toBe(false);
    expect(details.open).toBe(false);
  });
  it('keeps all items in keyboard-scrollable mode and supports non-link ancestors and linked current pages', async () => {
    const { fixture, element } = await setup([{ id: 'text', label: 'Text' }, ...trail]);
    fixture.componentRef.setInput('overflow', 'scroll');
    fixture.componentRef.setInput('linkCurrent', true);
    fixture.componentRef.setInput('label', 'Page hierarchy');
    fixture.componentRef.setInput('separator', '/');
    await fixture.whenStable();
    expect(element.querySelector('nav')!.tabIndex).toBe(0);
    expect(element.querySelectorAll('.zd-trail > li').length).toBe(7);
    expect(element.querySelector('details')).toBeNull();
    expect(element.querySelector('a[aria-current="page"]')!.getAttribute('href')).toBe('#level-5');
    expect(element.querySelector('.zd-separator')!.textContent).toBe('/');
    expect(element.querySelector('nav')!.getAttribute('aria-label')).toBe('Page hierarchy');
  });
  it('supports RouterLink commands, query parameters, fragments and the current-link policy', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'target', component: Destination }])],
    });
    const { fixture, element } = await setup([
      {
        id: 'route',
        label: 'Route',
        routerLink: ['/target'],
        queryParams: { page: 2 },
        fragment: 'section',
      },
      { id: 'last', label: 'Current', routerLink: '/target' },
    ]);
    const anchor = element.querySelector('a')!;
    expect(anchor.getAttribute('href')).toBe('/target?page=2#section');
    anchor.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/target?page=2#section');
    fixture.componentRef.setInput('linkCurrent', true);
    await fixture.whenStable();
    expect(element.querySelector('a[aria-current]')!.getAttribute('href')).toBe('/target');
  });
  it('projects decorative icons, offers short visual labels and honors configured prefixes', async () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'du-' } })],
    });
    const icons = TestBed.createComponent(IconHost);
    await icons.whenStable();
    const { element } = await setup([
      {
        id: 'home',
        label: 'Application home',
        shortLabel: 'Home',
        icon: icons.componentInstance.icon(),
      },
    ]);
    expect(element.querySelector('nav')!.classList.contains('du-breadcrumbs')).toBe(true);
    expect(element.querySelector('.zd-icon')!.getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('.zd-icon b')!.textContent).toBe('home');
    expect(element.querySelector('.zd-short')!.textContent).toBe('Home');
    expect(element.querySelector('.zd-sr')!.textContent).toBe('Application home');
  });
  it('renders the full ordered structured trail regardless of visual collapse and safely binds text', async () => {
    const { fixture, element } = await setup([
      ...trail.slice(0, 5),
      { id: 'current', label: '<script>text</script>' },
    ]);
    fixture.componentRef.setInput('structuredData', true);
    await fixture.whenStable();
    expect(element.querySelectorAll('[itemprop="itemListElement"]').length).toBe(6);
    expect(
      Array.from(element.querySelectorAll('[itemprop="position"]')).map(el =>
        el.getAttribute('content'),
      ),
    ).toEqual(['1', '2', '3', '4', '5', '6']);
    expect(element.querySelectorAll('[itemprop="item"]').length).toBe(5);
    expect(element.querySelector('script')).toBeNull();
    expect(element.querySelectorAll('[itemprop="name"]')[5].getAttribute('content')).toBe(
      '<script>text</script>',
    );
    fixture.componentRef.setInput('items', [
      { id: 'http', label: 'HTTP', canonicalUrl: 'http://example.com' },
    ]);
    await fixture.whenStable();
    expect(element.querySelector('[itemprop="item"]')!.getAttribute('href')).toBe(
      'http://example.com',
    );
  });
  it('rejects invalid bounds, identity, ambiguous destinations and structured URLs', async () => {
    for (const max of [0, 2, 3.5, NaN, Infinity]) {
      const f = TestBed.createComponent(ZdBreadcrumbs);
      expect(() => f.componentRef.setInput('maxItems', max)).toThrow(RangeError);
      f.destroy();
    }
    for (const items of [
      [{ id: '', label: 'x' }],
      [{ id: 'x', label: '' }],
      [
        { id: 'x', label: 'x' },
        { id: 'x', label: 'y' },
      ],
      [{ id: 'x', label: 'x', href: '/', routerLink: '/' }],
    ]) {
      const f = TestBed.createComponent(ZdBreadcrumbs);
      f.componentRef.setInput('items', items);
      expect(() => f.detectChanges()).toThrow(RangeError);
      f.destroy();
    }
    for (const items of [
      [
        { id: 'a', label: 'A' },
        { id: 'b', label: 'B' },
      ],
      [{ id: 'a', label: 'A', canonicalUrl: 'mailto:a@example.com' }],
      [{ id: 'a', label: 'A', canonicalUrl: '/relative' }],
    ]) {
      const f = TestBed.createComponent(ZdBreadcrumbs);
      f.componentRef.setInput('items', items);
      f.componentRef.setInput('structuredData', true);
      expect(() => f.detectChanges()).toThrow();
      f.destroy();
    }
  });
});
