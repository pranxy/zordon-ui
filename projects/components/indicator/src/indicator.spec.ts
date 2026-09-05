import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdIndicator, ZdIndicatorItem } from './indicator';

@Component({
  imports: [ZdIndicator, ZdIndicatorItem],
  template: `<div zdIndicator>
    <span zdIndicatorItem horizontalPlacement="start" verticalPlacement="bottom">New</span>
    <button type="button">Inbox</button>
  </div>`,
})
class Host {}

describe('ZdIndicator', () => {
  it('preserves consumer-owned semantics while applying documented wrapper and item classes', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const indicator = fixture.nativeElement.querySelector('[zdIndicator]') as HTMLElement;
    const item = indicator.querySelector('[zdIndicatorItem]') as HTMLElement;

    expect(indicator.tagName).toBe('DIV');
    expect(indicator.classList.contains('indicator')).toBe(true);
    expect(item.classList.contains('indicator-item')).toBe(true);
    expect(item.classList.contains('indicator-start')).toBe(true);
    expect(item.classList.contains('indicator-bottom')).toBe(true);
    expect(indicator.hasAttribute('role')).toBe(false);
  });
});
