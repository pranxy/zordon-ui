import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, type TestModuleMetadata } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { withLinkDefaults } from './link-defaults';
import { ZdLink } from './link';

@Component({
  imports: [ZdLink],
  template: `
    <a
      zdLink
      class="consumer-static"
      href="/settings"
      tabindex="2"
      aria-current="page"
      [class.consumer-dynamic]="consumerClass()"
      [color]="color()"
      [hover]="hover()"
      [zdDisabled]="disabled()"
    >
      Settings
    </a>
  `,
})
class TestLinkHost {
  readonly color = signal<'primary' | undefined>(undefined);
  readonly hover = signal<boolean | undefined>(undefined);
  readonly disabled = signal(false);
  readonly consumerClass = signal(true);
}

@Component({
  imports: [ZdLink],
  template: '<a zdLink hover href="/plans">Plans</a>',
})
class TestBooleanAttributeLink {}

function createLinkFixture(
  providers: NonNullable<TestModuleMetadata['providers']> = [],
): ComponentFixture<TestLinkHost> {
  TestBed.configureTestingModule({
    imports: [TestLinkHost],
    providers,
  });
  const fixture = TestBed.createComponent(TestLinkHost);
  fixture.detectChanges();
  return fixture;
}

function linkOf(fixture: ComponentFixture<TestLinkHost>): HTMLAnchorElement {
  return fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
}

describe('ZdLink', () => {
  it('adds base, color, and hover candidates while preserving consumer classes and attributes', () => {
    const fixture = createLinkFixture();
    const link = linkOf(fixture);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.hover.set(true);
    fixture.detectChanges();

    for (const token of [
      'link',
      'link-primary',
      'link-hover',
      'consumer-static',
      'consumer-dynamic',
    ]) {
      expect(link.classList.contains(token)).toBe(true);
    }
    expect(link.getAttribute('href')).toBe('/settings');
    expect(link.getAttribute('tabindex')).toBe('2');
    expect(link.getAttribute('aria-current')).toBe('page');
  });

  it('resolves omitted, application, local, and reset defaults without leaking stale classes', () => {
    const fixture = createLinkFixture([
      provideZordonUi({}, withLinkDefaults({ color: 'secondary', hover: true })),
    ]);
    const link = linkOf(fixture);

    expect(link.classList.contains('link-secondary')).toBe(true);
    expect(link.classList.contains('link-hover')).toBe(true);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.hover.set(false);
    fixture.detectChanges();

    expect(link.classList.contains('link-primary')).toBe(true);
    expect(link.classList.contains('link-secondary')).toBe(false);
    expect(link.classList.contains('link-hover')).toBe(false);

    fixture.componentInstance.color.set(undefined);
    fixture.componentInstance.hover.set(undefined);
    fixture.detectChanges();

    expect(link.classList.contains('link-secondary')).toBe(true);
    expect(link.classList.contains('link-hover')).toBe(true);
    expect(link.classList.contains('link-primary')).toBe(false);
  });

  it('guards an unavailable link without removing navigation semantics or event propagation', () => {
    const fixture = createLinkFixture();
    const link = linkOf(fixture);
    let observedDefaultPrevented = false;
    link.addEventListener('click', event => {
      observedDefaultPrevented = event.defaultPrevented;
    });

    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    expect(link.dispatchEvent(event)).toBe(false);
    expect(observedDefaultPrevented).toBe(true);
    expect(link.getAttribute('href')).toBe('/settings');
    expect(link.getAttribute('tabindex')).toBe('2');
    expect(link.getAttribute('aria-current')).toBe('page');
    expect(link.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not prevent enabled native link navigation', () => {
    const fixture = createLinkFixture();
    const link = linkOf(fixture);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    expect(link.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    expect(link.hasAttribute('aria-disabled')).toBe(false);
  });

  it('supports a bare hover boolean attribute without changing omitted-default semantics', () => {
    TestBed.configureTestingModule({ imports: [TestBooleanAttributeLink] });
    const fixture = TestBed.createComponent(TestBooleanAttributeLink);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('a') as HTMLAnchorElement).classList.contains(
        'link-hover',
      ),
    ).toBe(true);
  });

  it('uses complete configured prefix tokens', () => {
    const fixture = createLinkFixture([
      provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } }),
    ]);
    const link = linkOf(fixture);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.hover.set(true);
    fixture.detectChanges();

    expect(link.classList.contains('tw:d-link')).toBe(true);
    expect(link.classList.contains('tw:d-link-primary')).toBe(true);
    expect(link.classList.contains('tw:d-link-hover')).toBe(true);
    expect(link.classList.contains('link')).toBe(false);
  });
});
