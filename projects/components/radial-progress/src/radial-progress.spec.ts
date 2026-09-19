import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdRadialProgress, type ZdRadialProgressThreshold } from './radial-progress';

@Component({
  imports: [ZdRadialProgress],
  template: `<zd-radial-progress label="Export" [value]="100"
    ><span zdRadialProgressIcon>✓</span><span zdRadialProgressLabel>Done</span></zd-radial-progress
  >`,
})
class ProjectedHost {}

describe('Radial Progress', () => {
  afterEach(() => TestBed.resetTestingModule());
  function setup() {
    const fixture = TestBed.createComponent(ZdRadialProgress);
    fixture.componentRef.setInput('label', 'Download');
    fixture.detectChanges();
    return fixture;
  }
  it('provides one named indeterminate progressbar with decorative, inert content', () => {
    const fixture = setup();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('progressbar');
    expect(host.getAttribute('aria-label')).toBe('Download');
    expect(host.getAttribute('aria-valuemin')).toBe('0');
    expect(host.getAttribute('aria-valuemax')).toBe('100');
    expect(host.hasAttribute('aria-valuenow')).toBe(false);
    expect(host.getAttribute('aria-valuetext')).toBe('In progress');
    expect(host.querySelector('[role], [tabindex], [aria-live]')).toBeNull();
    expect(host.querySelector('.zd-radial-content')?.hasAttribute('inert')).toBe(true);
    expect(host.querySelector('.zd-radial-content')?.getAttribute('aria-hidden')).toBe('true');
    expect(
      (host.querySelector('.zd-radial-ring') as HTMLElement).style.getPropertyValue('--value'),
    ).toBe('25');
    expect(fixture.componentInstance.state()).toEqual({
      value: null,
      max: 100,
      percent: null,
      complete: false,
    });
  });
  it('clamps actual units, normalizes the ring, tracks max changes and resets completion', () => {
    const fixture = setup();
    const host = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('max', 200);
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    expect(host.getAttribute('aria-valuenow')).toBe('50');
    expect(host.getAttribute('aria-valuemax')).toBe('200');
    expect(fixture.componentInstance.text()).toBe('25%');
    fixture.componentRef.setInput('value', 300);
    fixture.detectChanges();
    expect(fixture.componentInstance.complete()).toBe(true);
    expect(fixture.componentInstance.state().value).toBe(200);
    fixture.componentRef.setInput('max', 600);
    fixture.detectChanges();
    expect(fixture.componentInstance.complete()).toBe(false);
    expect(fixture.componentInstance.state().percent).toBe(50);
    fixture.componentRef.setInput('value', -2);
    fixture.detectChanges();
    expect(host.getAttribute('data-zd-radial-empty')).toBe('true');
    expect(fixture.componentInstance.state().value).toBe(0);
    fixture.componentRef.setInput('value', undefined);
    fixture.detectChanges();
    expect(host.hasAttribute('aria-valuenow')).toBe(false);
  });
  it('selects inclusive percentage thresholds without mutating caller data', () => {
    const fixture = setup();
    const levels: ZdRadialProgressThreshold[] = [
      { at: 25, color: 'warning' },
      { at: 75, color: 'success' },
    ];
    fixture.componentRef.setInput('thresholds', levels);
    fixture.componentRef.setInput('color', 'neutral');
    fixture.componentRef.setInput('max', 200);
    fixture.componentRef.setInput('value', 49);
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('neutral');
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('warning');
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('success');
    expect(fixture.componentInstance.thresholds()).not.toBe(levels);
    expect(fixture.componentInstance.thresholds()[0]).not.toBe(levels[0]);
    expect(levels).toEqual([
      { at: 25, color: 'warning' },
      { at: 75, color: 'success' },
    ]);
    fixture.componentRef.setInput('value', null);
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('neutral');
    fixture.componentRef.setInput('thresholds', []);
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    expect(fixture.componentInstance.resolvedColor()).toBe('neutral');
  });
  it('supports class prefixes, CSS dimensions, formatting, projected parts and animation opt-out', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = setup();
    fixture.componentRef.setInput('size', '8rem');
    fixture.componentRef.setInput('thickness', '2px');
    fixture.componentRef.setInput('color', 'primary');
    fixture.componentRef.setInput('animated', false);
    fixture.componentRef.setInput('format', () => 'A carregar');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const ring = host.querySelector('.zd-radial-ring') as HTMLElement;
    expect(ring.classList.contains('tw:d-radial-progress')).toBe(true);
    expect(ring.style.getPropertyValue('--size')).toBe('8rem');
    expect(ring.style.getPropertyValue('--thickness')).toBe('2px');
    expect(ring.style.getPropertyValue('--zd-radial-color')).toBe('var(--color-primary)');
    expect(host.getAttribute('aria-valuetext')).toBe('A carregar');
    expect(host.getAttribute('data-zd-radial-animated')).toBe('false');
    const projected = TestBed.createComponent(ProjectedHost);
    projected.detectChanges();
    const radial = projected.nativeElement.querySelector('zd-radial-progress') as HTMLElement;
    expect(radial.getAttribute('aria-valuetext')).toBe('100%');
    expect(radial.getAttribute('data-zd-radial-complete')).toBe('true');
    expect(radial.querySelector('.zd-radial-content')?.textContent).toBe('✓Done');
    expect(radial.querySelector('bdi')).toBeNull();
  });
  it('rejects nonfinite numbers, invalid maxima, blank labels and unordered/out-of-range thresholds', () => {
    const fixture = setup();
    for (const value of [NaN, Infinity, -Infinity]) {
      for (const input of ['value', 'max'])
        expect(() => fixture.componentRef.setInput(input, value)).toThrow(RangeError);
    }
    for (const value of [0, -1])
      expect(() => fixture.componentRef.setInput('max', value)).toThrow(RangeError);
    expect(() => fixture.componentRef.setInput('label', ' ')).toThrow(RangeError);
    for (const at of [NaN, -1, 101])
      expect(() => fixture.componentRef.setInput('thresholds', [{ at, color: 'primary' }])).toThrow(
        RangeError,
      );
    for (const at of [49, 50])
      expect(() =>
        fixture.componentRef.setInput('thresholds', [
          { at: 50, color: 'primary' },
          { at, color: 'success' },
        ]),
      ).toThrow(RangeError);
  });
});
