import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdFooter, ZdFooterTitle } from './footer';

@Component({
  imports: [ZdFooter, ZdFooterTitle],
  template: `<footer zdFooter direction="horizontal" center aria-label="Site footer">
    <nav aria-label="Company">
      <h2 zdFooterTitle>Company</h2>
      <a href="#about">About</a>
    </nav>
  </footer>`,
})
class Host {}

describe('ZdFooter', () => {
  it('preserves native footer and navigation semantics while applying documented classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const footer = fixture.nativeElement.querySelector('[zdFooter]') as HTMLElement;
    expect(footer.tagName).toBe('FOOTER');
    expect(footer.classList.contains('footer')).toBe(true);
    expect(footer.classList.contains('footer-horizontal')).toBe(true);
    expect(footer.classList.contains('footer-center')).toBe(true);
    expect(
      (footer.querySelector('[zdFooterTitle]') as HTMLElement).classList.contains('footer-title'),
    ).toBe(true);
    expect(footer.hasAttribute('role')).toBe(false);
  });
});
