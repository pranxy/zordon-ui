import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveCarouselAlign,
  resolveCarouselOrientation,
  type ZdCarouselAlign,
  type ZdCarouselOrientation,
  ZdCarousel,
  ZdCarouselItem,
} from './carousel';

@Component({
  imports: [ZdCarousel, ZdCarouselItem],
  template: `<ol
    zdCarousel
    class="consumer"
    aria-label="Featured articles"
    [align]="align()"
    [orientation]="orientation()"
  >
    <li zdCarouselItem class="consumer-item">First article</li>
  </ol>`,
})
class TestCarouselHost {
  readonly align = signal<ZdCarouselAlign | undefined>(undefined);
  readonly orientation = signal<ZdCarouselOrientation | undefined>(undefined);
}

describe('ZdCarousel', () => {
  it('adds native Carousel candidates while preserving consumer list semantics', () => {
    TestBed.configureTestingModule({ imports: [TestCarouselHost] });
    const fixture = TestBed.createComponent(TestCarouselHost);
    fixture.detectChanges();
    fixture.componentInstance.align.set('center');
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();

    const carousel = fixture.nativeElement.querySelector('[zdCarousel]') as HTMLOListElement;
    const item = fixture.nativeElement.querySelector('[zdCarouselItem]') as HTMLLIElement;

    for (const token of ['carousel', 'carousel-center', 'carousel-vertical', 'consumer']) {
      expect(carousel.classList.contains(token)).toBe(true);
    }
    expect(carousel.tagName).toBe('OL');
    expect(carousel.getAttribute('aria-label')).toBe('Featured articles');
    expect(carousel.hasAttribute('role')).toBe(false);
    expect(carousel.hasAttribute('tabindex')).toBe(false);
    expect(item.tagName).toBe('LI');
    expect(item.classList.contains('carousel-item')).toBe(true);
    expect(item.classList.contains('consumer-item')).toBe(true);
  });

  it('removes stale optional Carousel candidates when inputs are cleared', () => {
    TestBed.configureTestingModule({ imports: [TestCarouselHost] });
    const fixture = TestBed.createComponent(TestCarouselHost);
    fixture.detectChanges();
    fixture.componentInstance.align.set('center');
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    fixture.componentInstance.align.set(undefined);
    fixture.componentInstance.orientation.set(undefined);
    fixture.detectChanges();

    const carousel = fixture.nativeElement.querySelector('[zdCarousel]') as HTMLElement;
    expect(carousel.classList.contains('carousel')).toBe(true);
    expect(carousel.classList.contains('carousel-center')).toBe(false);
    expect(carousel.classList.contains('carousel-vertical')).toBe(false);
  });

  it('uses complete configured prefix tokens for Carousel directives', () => {
    TestBed.configureTestingModule({
      imports: [TestCarouselHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestCarouselHost);
    fixture.detectChanges();
    fixture.componentInstance.align.set('end');
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();

    const carousel = fixture.nativeElement.querySelector('[zdCarousel]') as HTMLElement;
    const item = fixture.nativeElement.querySelector('[zdCarouselItem]') as HTMLElement;
    for (const token of ['tw:d-carousel', 'tw:d-carousel-end', 'tw:d-carousel-horizontal']) {
      expect(carousel.classList.contains(token)).toBe(true);
    }
    expect(item.classList.contains('tw:d-carousel-item')).toBe(true);
  });

  it('rejects unknown Carousel candidate values', () => {
    expect(() => resolveCarouselAlign('nearest')).toThrowError(/Carousel align/);
    expect(() => resolveCarouselOrientation('diagonal')).toThrowError(/Carousel orientation/);
  });
});
