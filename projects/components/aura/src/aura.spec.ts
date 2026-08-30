import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { resolveAuraSize, resolveAuraVariant, ZdAura } from './aura';

@Component({
  imports: [ZdAura],
  template: `<div zdAura class="consumer" [size]="size()" [variant]="variant()">
    <button type="button">Start free trial</button>
  </div>`,
})
class TestAuraHost {
  readonly size = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined>(undefined);
  readonly variant = signal<'dual' | 'rainbow' | 'holo' | 'gold' | 'silver' | 'glow' | undefined>(
    undefined,
  );
}

describe('ZdAura', () => {
  it('adds candidates and the scoped motion marker while preserving consumer semantics', () => {
    TestBed.configureTestingModule({ imports: [TestAuraHost] });
    const fixture = TestBed.createComponent(TestAuraHost);
    fixture.detectChanges();
    fixture.componentInstance.size.set('lg');
    fixture.componentInstance.variant.set('rainbow');
    fixture.detectChanges();

    const aura = fixture.nativeElement.querySelector('[zdAura]') as HTMLElement;
    expect(aura.classList.contains('aura')).toBe(true);
    expect(aura.classList.contains('aura-lg')).toBe(true);
    expect(aura.classList.contains('aura-rainbow')).toBe(true);
    expect(aura.classList.contains('consumer')).toBe(true);
    expect(aura.getAttribute('data-zd-aura')).toBe('true');
    expect(aura.querySelector('button')?.type).toBe('button');
    expect(aura.hasAttribute('role')).toBe(false);
  });

  it('uses complete configured prefix tokens', () => {
    TestBed.configureTestingModule({
      imports: [TestAuraHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestAuraHost);
    fixture.detectChanges();
    fixture.componentInstance.size.set('xs');
    fixture.componentInstance.variant.set('glow');
    fixture.detectChanges();

    const aura = fixture.nativeElement.querySelector('[zdAura]') as HTMLElement;
    expect(aura.classList.contains('tw:d-aura')).toBe(true);
    expect(aura.classList.contains('tw:d-aura-xs')).toBe(true);
    expect(aura.classList.contains('tw:d-aura-glow')).toBe(true);
  });

  it('rejects unknown candidate values', () => {
    expect(() => resolveAuraSize('2xl')).toThrowError(/Aura size/);
    expect(() => resolveAuraVariant('plasma')).toThrowError(/Aura variant/);
  });
});
