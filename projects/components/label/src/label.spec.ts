import { Component } from '@angular/core';
import { ComponentFixture, TestBed, type TestModuleMetadata } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { ZdFloatingLabel, ZdLabel } from './label';

@Component({
  imports: [ZdFloatingLabel, ZdLabel],
  template: `
    <label zdLabel class="consumer-static" for="email" aria-describedby="email-help">
      Email address
    </label>
    <input id="email" />
    <label zdFloatingLabel class="consumer-floating" for="name">
      <span>Full name</span>
      <input id="name" placeholder="Full name" />
    </label>
  `,
})
class TestLabelHost {}

function createFixture(
  providers: NonNullable<TestModuleMetadata['providers']> = [],
): ComponentFixture<TestLabelHost> {
  TestBed.configureTestingModule({ imports: [TestLabelHost], providers });
  const fixture = TestBed.createComponent(TestLabelHost);
  fixture.detectChanges();
  return fixture;
}

describe('ZdLabel', () => {
  it('adds the native label candidate while preserving association and consumer attributes', () => {
    const fixture = createFixture();
    const label = fixture.nativeElement.querySelector('label[zdLabel]') as HTMLLabelElement;

    expect(label.classList.contains('label')).toBe(true);
    expect(label.classList.contains('consumer-static')).toBe(true);
    expect(label.htmlFor).toBe('email');
    expect(label.getAttribute('aria-describedby')).toBe('email-help');
    expect(label.hasAttribute('role')).toBe(false);
    expect(label.hasAttribute('tabindex')).toBe(false);
  });

  it('adds the floating-label candidate without changing its native label relationship', () => {
    const fixture = createFixture();
    const label = fixture.nativeElement.querySelector('label[zdFloatingLabel]') as HTMLLabelElement;

    expect(label.classList.contains('floating-label')).toBe(true);
    expect(label.classList.contains('consumer-floating')).toBe(true);
    expect(label.htmlFor).toBe('name');
    expect(label.querySelector('span')?.textContent?.trim()).toBe('Full name');
    expect(label.querySelector('input')?.getAttribute('placeholder')).toBe('Full name');
    expect(label.hasAttribute('role')).toBe(false);
  });

  it('uses complete configured prefix tokens', () => {
    const fixture = createFixture([
      provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } }),
    ]);
    const [label, floatingLabel] = fixture.nativeElement.querySelectorAll(
      'label',
    ) as NodeListOf<HTMLLabelElement>;

    expect(label.classList.contains('tw:d-label')).toBe(true);
    expect(floatingLabel.classList.contains('tw:d-floating-label')).toBe(true);
    expect(label.classList.contains('label')).toBe(false);
  });
});
