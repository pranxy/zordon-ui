import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { resolveStatusColor, resolveStatusSize, ZdStatus } from './status';

@Component({
  imports: [ZdStatus],
  template: `<span zdStatus class="consumer" [color]="color()" [size]="size()"></span>`,
})
class Host {
  readonly color = signal<'success' | undefined>(undefined);
  readonly size = signal<'xl' | undefined>(undefined);
}

describe('ZdStatus', () => {
  it('applies documented candidates without changing native semantics', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.size.set('xl');
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdStatus]') as HTMLElement;
    for (const token of ['status', 'status-success', 'status-xl', 'consumer'])
      expect(host.classList.contains(token)).toBe(true);
    expect(host.tagName).toBe('SPAN');
    expect(host.hasAttribute('role')).toBe(false);
    expect(host.hasAttribute('tabindex')).toBe(false);
  });
  it('clears stale modifiers and honors configured prefixes', () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.size.set('xl');
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdStatus]') as HTMLElement;
    expect(host.classList.contains('tw:d-status-success')).toBe(true);
    expect(host.classList.contains('tw:d-status-xl')).toBe(true);
    fixture.componentInstance.color.set(undefined);
    fixture.componentInstance.size.set(undefined);
    fixture.detectChanges();
    expect(host.classList.contains('tw:d-status-success')).toBe(false);
    expect(host.classList.contains('tw:d-status-xl')).toBe(false);
  });
  it('rejects unsupported candidates', () => {
    expect(() => resolveStatusColor('brand')).toThrowError(/Status color/);
    expect(() => resolveStatusSize('2xl')).toThrowError(/Status size/);
  });
});
