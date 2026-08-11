import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdTheme } from './theme';

@Component({
  selector: 'zd-test-themed-card',
  template: `Card content`,
})
class TestThemedCard {}

@Component({
  imports: [TestThemedCard, ZdTheme],
  template: `
    <section class="consumer-class" data-consumer="kept" [zdTheme]="outerTheme()">
      <div data-testid="nested" [zdTheme]="nestedTheme()">
        <zd-test-themed-card data-testid="component" [zdTheme]="componentTheme()" />
      </div>
    </section>
    <div
      data-testid="collision"
      [attr.data-theme]="consumerTheme()"
      [zdTheme]="directiveTheme()"
    ></div>
    <div data-testid="consumer-owned" [attr.data-theme]="consumerTheme()"></div>
  `,
})
class TestThemeConsumer {
  readonly outerTheme = signal<string | null | undefined>('dark');
  readonly nestedTheme = signal<string | null | undefined>('cupcake');
  readonly componentTheme = signal<string | null | undefined>('brand/v2');
  readonly consumerTheme = signal<string | null>('consumer-owned');
  readonly directiveTheme = signal<string | null>('directive-owned');
}

function createThemeFixture() {
  TestBed.configureTestingModule({ imports: [TestThemeConsumer] });
  const fixture = TestBed.createComponent(TestThemeConsumer);
  fixture.detectChanges();
  return fixture;
}

describe('ZdTheme', () => {
  it('writes exact built-in, nested, and consumer-defined theme names', () => {
    const fixture = createThemeFixture();
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    const nested = fixture.nativeElement.querySelector('[data-testid="nested"]') as HTMLElement;
    const component = fixture.nativeElement.querySelector(
      '[data-testid="component"]',
    ) as HTMLElement;

    expect(section.getAttribute('data-theme')).toBe('dark');
    expect(nested.getAttribute('data-theme')).toBe('cupcake');
    expect(component.getAttribute('data-theme')).toBe('brand/v2');
    expect(component.tagName).toBe('ZD-TEST-THEMED-CARD');
  });

  it('updates a scope without changing nested or consumer-owned host attributes', () => {
    const fixture = createThemeFixture();
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    const nested = fixture.nativeElement.querySelector('[data-testid="nested"]') as HTMLElement;

    fixture.componentInstance.outerTheme.set('corporate');
    fixture.detectChanges();

    expect(section.getAttribute('data-theme')).toBe('corporate');
    expect(nested.getAttribute('data-theme')).toBe('cupcake');
    expect(section.classList.contains('consumer-class')).toBe(true);
    expect(section.getAttribute('data-consumer')).toBe('kept');
  });

  it('removes empty and nullish boundaries so descendants inherit the nearest remaining scope', () => {
    const fixture = createThemeFixture();
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;
    const nested = fixture.nativeElement.querySelector('[data-testid="nested"]') as HTMLElement;
    const component = fixture.nativeElement.querySelector(
      '[data-testid="component"]',
    ) as HTMLElement;

    fixture.componentInstance.outerTheme.set('');
    fixture.componentInstance.nestedTheme.set(null);
    fixture.componentInstance.componentTheme.set(undefined);
    fixture.detectChanges();

    expect(section.hasAttribute('data-theme')).toBe(false);
    expect(nested.hasAttribute('data-theme')).toBe(false);
    expect(component.hasAttribute('data-theme')).toBe(false);
  });

  it('preserves whitespace and punctuation because custom theme names are exact', () => {
    const fixture = createThemeFixture();
    const section = fixture.nativeElement.querySelector('section') as HTMLElement;

    fixture.componentInstance.outerTheme.set(' brand theme/v2 ');
    fixture.detectChanges();

    expect(section.getAttribute('data-theme')).toBe(' brand theme/v2 ');
  });

  it('does not promise precedence when two bindings target data-theme on the same host', () => {
    const fixture = createThemeFixture();
    const element = fixture.nativeElement.querySelector('[data-testid="collision"]') as HTMLElement;

    expect(element.getAttribute('data-theme')).toBe('directive-owned');

    fixture.componentInstance.consumerTheme.set('updated-consumer');
    fixture.detectChanges();
    expect(element.getAttribute('data-theme')).toBe('updated-consumer');

    fixture.componentInstance.directiveTheme.set('updated-directive');
    fixture.detectChanges();
    expect(element.getAttribute('data-theme')).toBe('updated-directive');
  });

  it('leaves a native data-theme binding consumer-owned when the directive is absent', () => {
    const fixture = createThemeFixture();
    const element = fixture.nativeElement.querySelector(
      '[data-testid="consumer-owned"]',
    ) as HTMLElement;

    expect(element.getAttribute('data-theme')).toBe('consumer-owned');

    fixture.componentInstance.consumerTheme.set('updated-consumer');
    fixture.detectChanges();
    expect(element.getAttribute('data-theme')).toBe('updated-consumer');

    fixture.componentInstance.consumerTheme.set(null);
    fixture.detectChanges();
    expect(element.hasAttribute('data-theme')).toBe(false);
  });
});
