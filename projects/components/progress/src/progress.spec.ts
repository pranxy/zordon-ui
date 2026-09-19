import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdProgress } from './progress';

describe('Progress', () => {
  afterEach(() => TestBed.resetTestingModule());
  function setup() {
    const fixture = TestBed.createComponent(ZdProgress);
    fixture.componentRef.setInput('label', 'Upload');
    fixture.detectChanges();
    return fixture;
  }
  it('uses named native indeterminate semantics without a focus stop or live region', () => {
    const fixture = setup();
    const host = fixture.nativeElement as HTMLElement;
    const progress = host.querySelector('progress')!;
    expect(progress.hasAttribute('value')).toBe(false);
    expect(progress.max).toBe(100);
    expect(progress.getAttribute('aria-label')).toBe('Upload');
    expect(progress.getAttribute('aria-valuetext')).toBe('In progress');
    expect(progress.className).toBe('progress');
    expect(host.querySelector('.zd-progress-label')?.getAttribute('aria-hidden')).toBe('true');
    expect(host.querySelector('[tabindex], [role], [aria-live]')).toBeNull();
    expect(fixture.componentInstance.state()).toEqual({
      value: null,
      max: 100,
      percent: null,
      buffer: null,
      complete: false,
    });
    fixture.componentRef.setInput('buffer', 80);
    fixture.componentRef.setInput('value', undefined);
    fixture.detectChanges();
    expect(host.querySelector('.zd-progress-buffer')).toBeNull();
  });
  it('clamps values and buffers, derives completion and resets it when work restarts', () => {
    const fixture = setup();
    const host = fixture.nativeElement as HTMLElement;
    const progress = host.querySelector('progress')!;
    fixture.componentRef.setInput('max', 200);
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('buffer', 140);
    fixture.detectChanges();
    expect(progress.value).toBe(50);
    expect(progress.max).toBe(200);
    expect(fixture.componentInstance.text()).toBe('25%');
    expect((host.querySelector('.zd-progress-buffer') as HTMLElement).style.inlineSize).toBe('70%');
    fixture.componentRef.setInput('buffer', -20);
    fixture.detectChanges();
    expect(fixture.componentInstance.state().buffer).toBe(50);
    fixture.componentRef.setInput('buffer', 300);
    fixture.componentRef.setInput('value', 250);
    fixture.detectChanges();
    expect(fixture.componentInstance.state()).toEqual({
      value: 200,
      max: 200,
      percent: 100,
      buffer: 200,
      complete: true,
    });
    expect(fixture.componentInstance.complete()).toBe(true);
    expect(host.getAttribute('data-zd-progress-complete')).toBe('true');
    fixture.componentRef.setInput('value', -1);
    fixture.componentRef.setInput('buffer', undefined);
    fixture.detectChanges();
    expect(progress.value).toBe(0);
    expect(fixture.componentInstance.complete()).toBe(false);
    expect(host.querySelector('.zd-progress-buffer')).toBeNull();
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();
    expect(progress.hasAttribute('value')).toBe(false);
  });
  it('derives completion on initial render and recomputes fractions when max changes', () => {
    const fixture = TestBed.createComponent(ZdProgress);
    fixture.componentRef.setInput('label', 'Small task');
    fixture.componentRef.setInput('max', 0.5);
    fixture.componentRef.setInput('value', 0.5);
    fixture.detectChanges();
    expect(fixture.componentInstance.complete()).toBe(true);
    fixture.componentRef.setInput('max', 2);
    fixture.detectChanges();
    expect(fixture.componentInstance.complete()).toBe(false);
    expect(fixture.componentInstance.text()).toBe('25%');
  });
  it('supports prefixes, hidden visual labels, animation opt-out and localized formatting', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = setup();
    fixture.componentRef.setInput('color', 'primary');
    fixture.componentRef.setInput('showLabel', false);
    fixture.componentRef.setInput('animated', false);
    fixture.componentRef.setInput('format', (state: { value: number | null }) =>
      state.value === null ? 'A carregar' : `${state.value} ficheiros`,
    );
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('progress')?.className).toBe('tw:d-progress tw:d-progress-primary');
    expect(host.style.getPropertyValue('--zd-progress-color')).toBe('var(--color-primary)');
    expect(host.querySelector('.zd-progress-label')).toBeNull();
    expect(host.querySelector('progress')?.getAttribute('aria-valuetext')).toBe('A carregar');
    expect(host.getAttribute('data-zd-progress-animated')).toBe('false');
    fixture.componentRef.setInput('value', 3);
    fixture.detectChanges();
    expect(fixture.componentInstance.text()).toBe('3 ficheiros');
  });
  it('rejects nonfinite numbers, nonpositive maxima and blank labels', () => {
    const fixture = setup();
    for (const value of [NaN, Infinity, -Infinity]) {
      for (const input of ['value', 'buffer', 'max'])
        expect(() => fixture.componentRef.setInput(input, value)).toThrow(RangeError);
    }
    for (const value of [0, -1])
      expect(() => fixture.componentRef.setInput('max', value)).toThrow(RangeError);
    expect(() => fixture.componentRef.setInput('label', '  ')).toThrow(RangeError);
  });
});
