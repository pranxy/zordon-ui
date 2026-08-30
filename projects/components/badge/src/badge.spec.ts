import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { resolveBadgeColor, resolveBadgeSize, resolveBadgeStyle, ZdBadge } from './badge';

@Component({
  imports: [ZdBadge],
  template: `<button
    zdBadge
    class="consumer"
    type="button"
    [color]="color()"
    [size]="size()"
    [style]="style()"
  >
    New
  </button>`,
})
class TestBadgeHost {
  readonly color = signal<'success' | undefined>(undefined);
  readonly size = signal<'xl' | undefined>(undefined);
  readonly style = signal<'soft' | undefined>(undefined);
}

describe('ZdBadge', () => {
  it('adds candidates while preserving consumer button semantics', () => {
    TestBed.configureTestingModule({ imports: [TestBadgeHost] });
    const fixture = TestBed.createComponent(TestBadgeHost);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.style.set('soft');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('[zdBadge]') as HTMLButtonElement;
    for (const token of ['badge', 'badge-success', 'badge-xl', 'badge-soft', 'consumer']) {
      expect(badge.classList.contains(token)).toBe(true);
    }
    expect(badge.type).toBe('button');
    expect(badge.hasAttribute('role')).toBe(false);
    expect(badge.hasAttribute('tabindex')).toBe(false);
  });

  it('removes stale modifiers when local inputs are cleared', () => {
    TestBed.configureTestingModule({ imports: [TestBadgeHost] });
    const fixture = TestBed.createComponent(TestBadgeHost);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.style.set('soft');
    fixture.detectChanges();
    fixture.componentInstance.color.set(undefined);
    fixture.componentInstance.size.set(undefined);
    fixture.componentInstance.style.set(undefined);
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('[zdBadge]') as HTMLButtonElement;
    expect(badge.classList.contains('badge')).toBe(true);
    for (const token of ['badge-success', 'badge-xl', 'badge-soft']) {
      expect(badge.classList.contains(token)).toBe(false);
    }
  });

  it('uses complete configured prefix tokens', () => {
    TestBed.configureTestingModule({
      imports: [TestBadgeHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestBadgeHost);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.style.set('soft');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('[zdBadge]') as HTMLButtonElement;
    for (const token of ['tw:d-badge', 'tw:d-badge-success', 'tw:d-badge-xl', 'tw:d-badge-soft']) {
      expect(badge.classList.contains(token)).toBe(true);
    }
  });

  it('rejects unknown candidate values', () => {
    expect(() => resolveBadgeColor('brand')).toThrowError(/Badge color/);
    expect(() => resolveBadgeSize('2xl')).toThrowError(/Badge size/);
    expect(() => resolveBadgeStyle('solid')).toThrowError(/Badge style/);
  });
});
