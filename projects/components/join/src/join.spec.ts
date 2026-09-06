import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdJoin, ZdJoinItem } from './join';

@Component({
  imports: [ZdJoin, ZdJoinItem],
  template: `<nav zdJoin direction="vertical" aria-label="Page navigation">
    <button zdJoinItem type="button">Previous</button>
    <button zdJoinItem type="button">Next</button>
  </nav>`,
})
class Host {}

describe('ZdJoin', () => {
  it('preserves consumer-owned navigation semantics while applying documented classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const join = fixture.nativeElement.querySelector('[zdJoin]') as HTMLElement;
    expect(join.tagName).toBe('NAV');
    expect(join.classList.contains('join')).toBe(true);
    expect(join.classList.contains('join-vertical')).toBe(true);
    expect(join.querySelectorAll('[zdJoinItem].join-item').length).toBe(2);
    expect(join.hasAttribute('role')).toBe(false);
  });
});
