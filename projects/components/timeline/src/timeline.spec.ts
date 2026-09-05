import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  ZdTimeline,
  ZdTimelineBox,
  ZdTimelineEnd,
  ZdTimelineMiddle,
  ZdTimelineStart,
} from './timeline';
@Component({
  imports: [ZdTimeline, ZdTimelineBox, ZdTimelineEnd, ZdTimelineMiddle, ZdTimelineStart],
  template: `<ol zdTimeline orientation="vertical" compact aria-label="Releases">
    <li>
      <div zdTimelineStart>2026</div>
      <div zdTimelineMiddle>●</div>
      <div zdTimelineEnd zdTimelineBox>Release</div>
    </li>
  </ol>`,
})
class Host {}
describe('ZdTimeline', () => {
  it('preserves native event semantics while applying parts', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const f = TestBed.createComponent(Host);
    f.detectChanges();
    const t = f.nativeElement.querySelector('[zdTimeline]') as HTMLElement;
    expect(t.tagName).toBe('OL');
    for (const c of ['timeline', 'timeline-vertical', 'timeline-compact'])
      expect(t.classList.contains(c)).toBe(true);
    expect(t.hasAttribute('role')).toBe(false);
    expect(
      f.nativeElement.querySelector('[zdTimelineStart]').classList.contains('timeline-start'),
    ).toBe(true);
    expect(
      f.nativeElement.querySelector('[zdTimelineEnd]').classList.contains('timeline-end'),
    ).toBe(true);
    expect(
      f.nativeElement.querySelector('[zdTimelineBox]').classList.contains('timeline-box'),
    ).toBe(true);
  });
});
