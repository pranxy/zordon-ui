import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdHoverGallery } from './hover-gallery';
@Component({
  imports: [ZdHoverGallery],
  template: `<figure zdHoverGallery class="consumer">
    <img alt="First" /><img alt="Second" />
  </figure>`,
})
class Host {}
describe('ZdHoverGallery', () => {
  it('preserves consumer images while applying the documented wrapper', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdHoverGallery]') as HTMLElement;
    expect(host.classList.contains('hover-gallery')).toBe(true);
    expect(host.classList.contains('consumer')).toBe(true);
    expect(host.querySelectorAll('img')).toHaveLength(2);
  });
});
