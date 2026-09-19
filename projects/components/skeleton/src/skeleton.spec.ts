import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';
import { ZdSkeleton, ZdSkeletonRegion } from './skeleton';
@Component({
  imports: [ZdSkeleton, ZdSkeletonRegion],
  template: `<section aria-label="Results" [zdSkeletonRegion]="loading()">
    <zd-skeleton [active]="loading()" /><button type="button">Action</button>
  </section>`,
})
class RegionHost {
  readonly loading = signal(true);
}
describe('Skeleton', () => {
  afterEach(() => TestBed.resetTestingModule());
  it('renders decorative defaults and hides inactive artwork without adding semantics', () => {
    const fixture = TestBed.createComponent(ZdSkeleton);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.hasAttribute('inert')).toBe(true);
    expect(host.querySelector('[role], [aria-live], [tabindex]')).toBeNull();
    expect(host.style.inlineSize).toBe('100%');
    const part = host.querySelector('.skeleton') as HTMLElement;
    expect(part.style.blockSize).toBe('8rem');
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    expect(host.hidden).toBe(true);
  });
  it('supports shapes, CSS overrides, custom clipping and prefixed classes', () => {
    TestBed.configureTestingModule({
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(ZdSkeleton);
    fixture.componentRef.setInput('shape', 'circle');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const part = host.querySelector('.zd-skeleton-part') as HTMLElement;
    expect(part.classList.contains('tw:d-skeleton')).toBe(true);
    expect(host.style.inlineSize).toBe('3rem');
    expect(part.style.blockSize).toBe('3rem');
    expect(part.style.borderRadius).toBe('50%');
    fixture.componentRef.setInput('shape', 'custom');
    fixture.componentRef.setInput('width', '10rem');
    fixture.componentRef.setInput('height', '4rem');
    fixture.componentRef.setInput('radius', '2px');
    fixture.componentRef.setInput('clipPath', 'polygon(50% 0, 100% 100%, 0 100%)');
    fixture.componentRef.setInput('animation', 'pulse');
    fixture.componentRef.setInput('speed', 2500);
    fixture.detectChanges();
    expect(host.style.inlineSize).toBe('10rem');
    expect(part.style.blockSize).toBe('4rem');
    expect(part.style.borderRadius).toBe('2px');
    expect(part.style.clipPath).toContain('polygon');
    expect(host.getAttribute('data-zd-skeleton-animation')).toBe('pulse');
    expect(host.style.getPropertyValue('--zd-skeleton-duration')).toBe('2500ms');
  });
  it('renders multiline text and composition presets with the requested last line', () => {
    const fixture = TestBed.createComponent(ZdSkeleton);
    fixture.componentRef.setInput('shape', 'text');
    fixture.componentRef.setInput('lines', 4);
    fixture.componentRef.setInput('lastLineWidth', '75%');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const lines = host.querySelectorAll<HTMLElement>('.zd-skeleton-lines > span');
    expect(lines.length).toBe(4);
    expect(lines[0].style.inlineSize).toBe('100%');
    expect(lines[3].style.inlineSize).toBe('75%');
    expect(lines[0].style.blockSize).toBe('1rem');
    fixture.componentRef.setInput('height', '2rem');
    fixture.componentRef.setInput('preset', 'avatar-text');
    fixture.detectChanges();
    expect(host.querySelector('.zd-skeleton-avatar')).not.toBeNull();
    expect(lines[0].style.blockSize).toBe('2rem');
    fixture.componentRef.setInput('preset', 'card');
    fixture.detectChanges();
    expect(host.querySelector('.zd-skeleton-image')).not.toBeNull();
    expect(host.querySelector('.zd-skeleton-avatar')).toBeNull();
    fixture.componentRef.setInput('preset', 'paragraph');
    fixture.detectChanges();
    expect(host.querySelectorAll('.zd-skeleton-part').length).toBe(4);
  });
  it('reflects controlled region busy state without hiding content or disabling actions', () => {
    const fixture = TestBed.createComponent(RegionHost);
    fixture.detectChanges();
    const region = fixture.nativeElement.querySelector('section') as HTMLElement;
    expect(region.getAttribute('aria-busy')).toBe('true');
    expect(region.querySelector('button')?.disabled).toBe(false);
    expect(region.hasAttribute('aria-hidden')).toBe(false);
    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    expect(region.getAttribute('aria-busy')).toBe('false');
    expect((region.querySelector('zd-skeleton') as HTMLElement).hidden).toBe(true);
  });
  it('rejects invalid line counts and animation durations', () => {
    const fixture = TestBed.createComponent(ZdSkeleton);
    for (const lines of [0, -1, 101, 1.5, NaN, Infinity])
      expect(() => fixture.componentRef.setInput('lines', lines)).toThrow(RangeError);
    for (const speed of [0, -1, NaN, Infinity])
      expect(() => fixture.componentRef.setInput('speed', speed)).toThrow(RangeError);
  });
});
