import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { resolveKbdSize, ZdKbd } from './kbd';

@Component({
  imports: [ZdKbd],
  template: `<kbd zdKbd class="consumer" [size]="size()">Ctrl</kbd>`,
})
class TestKbdHost {
  readonly size = signal<'xl' | undefined>(undefined);
}

describe('ZdKbd', () => {
  it('adds keycap candidates while preserving native kbd semantics', () => {
    TestBed.configureTestingModule({ imports: [TestKbdHost] });
    const fixture = TestBed.createComponent(TestKbdHost);
    fixture.detectChanges();
    fixture.componentInstance.size.set('xl');
    fixture.detectChanges();

    const kbd = fixture.nativeElement.querySelector('[zdKbd]') as HTMLElement;
    for (const token of ['kbd', 'kbd-xl', 'consumer']) {
      expect(kbd.classList.contains(token)).toBe(true);
    }
    expect(kbd.tagName).toBe('KBD');
    expect(kbd.hasAttribute('role')).toBe(false);
    expect(kbd.hasAttribute('tabindex')).toBe(false);
  });

  it('removes a stale optional size candidate when the input is cleared', () => {
    TestBed.configureTestingModule({ imports: [TestKbdHost] });
    const fixture = TestBed.createComponent(TestKbdHost);
    fixture.detectChanges();
    fixture.componentInstance.size.set('xl');
    fixture.detectChanges();
    fixture.componentInstance.size.set(undefined);
    fixture.detectChanges();

    const kbd = fixture.nativeElement.querySelector('[zdKbd]') as HTMLElement;
    expect(kbd.classList.contains('kbd')).toBe(true);
    expect(kbd.classList.contains('kbd-xl')).toBe(false);
  });

  it('uses complete configured prefix tokens', () => {
    TestBed.configureTestingModule({
      imports: [TestKbdHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestKbdHost);
    fixture.detectChanges();
    fixture.componentInstance.size.set('xl');
    fixture.detectChanges();

    const kbd = fixture.nativeElement.querySelector('[zdKbd]') as HTMLElement;
    for (const token of ['tw:d-kbd', 'tw:d-kbd-xl']) {
      expect(kbd.classList.contains(token)).toBe(true);
    }
  });

  it('rejects unknown size candidates', () => {
    expect(() => resolveKbdSize('2xl')).toThrowError(/Kbd size/);
  });
});
