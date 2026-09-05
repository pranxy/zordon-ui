import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdStack } from './stack';

@Component({
  imports: [ZdStack],
  template: `<section zdStack verticalAlignment="top" horizontalAlignment="end" aria-label="Cards">
    <article>First card</article>
    <article>Second card</article>
  </section>`,
})
class Host {}

describe('ZdStack', () => {
  it('preserves the consumer-owned host while applying documented alignment classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const stack = fixture.nativeElement.querySelector('[zdStack]') as HTMLElement;
    expect(stack.tagName).toBe('SECTION');
    expect(stack.classList.contains('stack')).toBe(true);
    expect(stack.classList.contains('stack-top')).toBe(true);
    expect(stack.classList.contains('stack-end')).toBe(true);
    expect(stack.hasAttribute('role')).toBe(false);
  });
});
