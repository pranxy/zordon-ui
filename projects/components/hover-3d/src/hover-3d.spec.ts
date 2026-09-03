import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdHover3d } from './hover-3d';

@Component({
  imports: [ZdHover3d],
  template: `<a zdHover3d href="/details" class="consumer"><span>Card</span></a>`,
})
class Host {}

describe('ZdHover3d', () => {
  it('adds the native wrapper class without changing the consumer-selected host semantics', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('[zdHover3d]') as HTMLElement;
    expect(host.tagName).toBe('A');
    expect(host.classList.contains('hover-3d')).toBe(true);
    expect(host.classList.contains('consumer')).toBe(true);
    expect(host.getAttribute('href')).toBe('/details');
  });
});
