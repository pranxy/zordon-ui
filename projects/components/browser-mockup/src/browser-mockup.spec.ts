import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdBrowserMockup, ZdBrowserMockupToolbar } from './browser-mockup';
@Component({
  imports: [ZdBrowserMockup, ZdBrowserMockupToolbar],
  template: '<section zdBrowserMockup><div zdBrowserMockupToolbar>example.test</div></section>',
})
class Host {}
describe('ZdBrowserMockup', () => {
  it('keeps consumer semantics while adding mockup classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdBrowserMockup]') as HTMLElement;
    expect(host.tagName).toBe('SECTION');
    expect(host.classList.contains('mockup-browser')).toBe(true);
    expect(
      host.querySelector('[zdBrowserMockupToolbar]')?.classList.contains('mockup-browser-toolbar'),
    ).toBe(true);
  });
});
