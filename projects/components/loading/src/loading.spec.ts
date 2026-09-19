import { Component, PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdLoading } from './loading';

@Component({
  imports: [ZdLoading],
  template: `<zd-loading variant="custom" label="Custom wait" showLabel
    ><span zdLoadingCustom>Custom artwork</span></zd-loading
  >`,
})
class CustomHost {}

describe('Loading', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });
  it('keeps status text separate from decorative artwork and honors prefixes, colors and size', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(ZdLoading);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('status');
    expect(host.querySelector('.zd-loading-status')?.textContent).toBe('Loading');
    expect(
      host.querySelector('.zd-loading-animated')?.classList.contains('tw:d-loading-spinner'),
    ).toBe(true);
    fixture.componentRef.setInput('variant', 'dots');
    fixture.componentRef.setInput('size', 'xl');
    fixture.componentRef.setInput('color', 'primary');
    fixture.componentRef.setInput('label', 'Chargement');
    fixture.componentRef.setInput('showLabel', true);
    fixture.detectChanges();
    expect(host.querySelector('.zd-loading-animated')?.classList.contains('tw:d-loading-xl')).toBe(
      true,
    );
    expect(host.querySelector('.zd-loading-label')?.textContent).toBe('Chargement');
    expect(host.style.getPropertyValue('--zd-loading-color')).toBe('var(--color-primary)');
    expect(host.style.getPropertyValue('--zd-loading-size')).toBe('8');
    expect(host.querySelector('.zd-loading-view')?.hasAttribute('inert')).toBe(true);
    fixture.componentRef.setInput('decorative', true);
    fixture.detectChanges();
    expect(host.hasAttribute('role')).toBe(false);
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.querySelector('.zd-loading-status')?.textContent).toBe('');
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(false);
    const custom = TestBed.createComponent(CustomHost);
    custom.detectChanges();
    expect(custom.nativeElement.querySelector('.zd-loading-custom').textContent).toBe(
      'Custom artwork',
    );
    expect(custom.nativeElement.querySelector('.zd-loading-animated')).toBeNull();
  });
  it('cancels short work, resets changed delays, hides immediately and cleans up on destruction', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(ZdLoading);
    fixture.componentRef.setInput('delay', 100);
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(false);
    vi.advanceTimersByTime(50);
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    vi.advanceTimersByTime(100);
    expect(fixture.componentInstance.visible()).toBe(false);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    vi.advanceTimersByTime(99);
    expect(fixture.componentInstance.visible()).toBe(false);
    vi.advanceTimersByTime(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(true);
    fixture.componentRef.setInput('delay', '200');
    expect(fixture.componentInstance.visible()).toBe(false);
    fixture.detectChanges();
    vi.advanceTimersByTime(199);
    expect(fixture.componentInstance.visible()).toBe(false);
    vi.advanceTimersByTime(1);
    expect(fixture.componentInstance.visible()).toBe(true);
    fixture.componentRef.setInput('delay', 0);
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(true);
    fixture.componentRef.setInput('delay', 500);
    fixture.detectChanges();
    fixture.destroy();
    vi.advanceTimersByTime(1000);
    expect(fixture.componentInstance.visible()).toBe(false);
  });
  it('validates delay/label and renders deterministic immediate or delayed server state', () => {
    TestBed.configureTestingModule({ providers: [{ provide: PLATFORM_ID, useValue: 'server' }] });
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(ZdLoading);
    for (const value of [-1, NaN, Infinity, 2147483648])
      expect(() => fixture.componentRef.setInput('delay', value)).toThrow(/Loading delay/);
    expect(() => fixture.componentRef.setInput('label', '  ')).toThrow(/label/);
    fixture.componentRef.setInput('delay', 0);
    fixture.detectChanges();
    expect(fixture.componentInstance.visible()).toBe(true);
    fixture.componentRef.setInput('delay', 10);
    fixture.detectChanges();
    vi.advanceTimersByTime(100);
    expect(fixture.componentInstance.visible()).toBe(false);
    expect(fixture.nativeElement.querySelector('.zd-loading-status').textContent).toBe('');
  });
});
