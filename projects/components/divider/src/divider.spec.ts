import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed, type TestModuleMetadata } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { withDividerDefaults } from './divider-defaults';
import { ZdDivider } from './divider';

@Component({
  imports: [ZdDivider],
  template: `
    <div
      zdDivider
      class="consumer-static"
      aria-label="Optional section"
      data-divider="example"
      [class.consumer-dynamic]="consumerClass()"
      [color]="color()"
      [orientation]="orientation()"
      [placement]="placement()"
    >
      Optional
    </div>
  `,
})
class TestDividerHost {
  readonly color = signal<'primary' | undefined>(undefined);
  readonly orientation = signal<'horizontal' | 'vertical' | undefined>(undefined);
  readonly placement = signal<'start' | 'end' | undefined>(undefined);
  readonly consumerClass = signal(true);
}

@Component({
  imports: [ZdDivider],
  template: '<hr zdDivider aria-label="Section break" />',
})
class TestHrDividerHost {}

function createDividerFixture(
  providers: NonNullable<TestModuleMetadata['providers']> = [],
): ComponentFixture<TestDividerHost> {
  TestBed.configureTestingModule({
    imports: [TestDividerHost],
    providers,
  });
  const fixture = TestBed.createComponent(TestDividerHost);
  fixture.detectChanges();
  return fixture;
}

function dividerOf(fixture: ComponentFixture<TestDividerHost>): HTMLDivElement {
  return fixture.nativeElement.querySelector('div') as HTMLDivElement;
}

describe('ZdDivider', () => {
  it('adds candidates while preserving consumer classes and native attributes', () => {
    const fixture = createDividerFixture();
    const divider = dividerOf(fixture);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.orientation.set('horizontal');
    fixture.componentInstance.placement.set('end');
    fixture.detectChanges();

    for (const token of [
      'divider',
      'divider-primary',
      'divider-horizontal',
      'divider-end',
      'consumer-static',
      'consumer-dynamic',
    ]) {
      expect(divider.classList.contains(token)).toBe(true);
    }
    expect(divider.getAttribute('aria-label')).toBe('Optional section');
    expect(divider.getAttribute('data-divider')).toBe('example');
    expect(divider.hasAttribute('role')).toBe(false);
    expect(divider.hasAttribute('tabindex')).toBe(false);
  });

  it('resolves omitted, application, local, and reset defaults without stale modifiers', () => {
    const fixture = createDividerFixture([
      provideZordonUi(
        {},
        withDividerDefaults({ color: 'secondary', orientation: 'vertical', placement: 'start' }),
      ),
    ]);
    const divider = dividerOf(fixture);

    for (const token of ['divider-secondary', 'divider-vertical', 'divider-start']) {
      expect(divider.classList.contains(token)).toBe(true);
    }

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.orientation.set('horizontal');
    fixture.componentInstance.placement.set('end');
    fixture.detectChanges();

    for (const token of ['divider-primary', 'divider-horizontal', 'divider-end']) {
      expect(divider.classList.contains(token)).toBe(true);
    }
    for (const token of ['divider-secondary', 'divider-vertical', 'divider-start']) {
      expect(divider.classList.contains(token)).toBe(false);
    }

    fixture.componentInstance.color.set(undefined);
    fixture.componentInstance.orientation.set(undefined);
    fixture.componentInstance.placement.set(undefined);
    fixture.detectChanges();

    for (const token of ['divider-secondary', 'divider-vertical', 'divider-start']) {
      expect(divider.classList.contains(token)).toBe(true);
    }
    for (const token of ['divider-primary', 'divider-horizontal', 'divider-end']) {
      expect(divider.classList.contains(token)).toBe(false);
    }
  });

  it('keeps an hr host semantic without injecting roles, focus, or handlers', () => {
    TestBed.configureTestingModule({ imports: [TestHrDividerHost] });
    const fixture = TestBed.createComponent(TestHrDividerHost);
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('hr') as HTMLHRElement;

    expect(divider.tagName).toBe('HR');
    expect(divider.classList.contains('divider')).toBe(true);
    expect(divider.getAttribute('aria-label')).toBe('Section break');
    expect(divider.hasAttribute('role')).toBe(false);
    expect(divider.hasAttribute('tabindex')).toBe(false);
  });

  it('uses complete configured prefix tokens', () => {
    const fixture = createDividerFixture([
      provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } }),
    ]);
    const divider = dividerOf(fixture);

    fixture.componentInstance.color.set('primary');
    fixture.componentInstance.orientation.set('horizontal');
    fixture.componentInstance.placement.set('end');
    fixture.detectChanges();

    for (const token of [
      'tw:d-divider',
      'tw:d-divider-primary',
      'tw:d-divider-horizontal',
      'tw:d-divider-end',
    ]) {
      expect(divider.classList.contains(token)).toBe(true);
    }
    expect(divider.classList.contains('divider')).toBe(false);
  });
});
