import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZordonUi } from '@pranxy/zordon-ui';

import { ZdDiff, ZdDiffItem1, ZdDiffItem2, ZdDiffResizer } from './diff';

@Component({
  imports: [ZdDiff, ZdDiffItem1, ZdDiffItem2, ZdDiffResizer],
  template: `<figure zdDiff class="consumer" tabindex="0">
    <div zdDiffItem1 tabindex="0"><span>Before</span></div>
    <div zdDiffItem2><span>After</span></div>
    <div zdDiffResizer></div>
  </figure>`,
})
class Host {}

describe('ZdDiff directives', () => {
  it('applies every documented class while preserving consumer semantics and content', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const diff = fixture.nativeElement.querySelector('[zdDiff]') as HTMLElement;
    const item1 = fixture.nativeElement.querySelector('[zdDiffItem1]') as HTMLElement;
    const item2 = fixture.nativeElement.querySelector('[zdDiffItem2]') as HTMLElement;
    const resizer = fixture.nativeElement.querySelector('[zdDiffResizer]') as HTMLElement;

    expect(diff.tagName).toBe('FIGURE');
    expect(diff.classList.contains('diff')).toBe(true);
    expect(diff.classList.contains('consumer')).toBe(true);
    expect(diff.getAttribute('tabindex')).toBe('0');
    expect(item1.classList.contains('diff-item-1')).toBe(true);
    expect(item1.getAttribute('tabindex')).toBe('0');
    expect(item1.textContent).toContain('Before');
    expect(item2.classList.contains('diff-item-2')).toBe(true);
    expect(item2.textContent).toContain('After');
    expect(resizer.classList.contains('diff-resizer')).toBe(true);
    expect(resizer.hasAttribute('role')).toBe(false);
  });

  it('uses complete configured prefix tokens for every part', () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    for (const [selector, token] of [
      ['[zdDiff]', 'tw:d-diff'],
      ['[zdDiffItem1]', 'tw:d-diff-item-1'],
      ['[zdDiffItem2]', 'tw:d-diff-item-2'],
      ['[zdDiffResizer]', 'tw:d-diff-resizer'],
    ]) {
      expect(
        (fixture.nativeElement.querySelector(selector) as HTMLElement).classList.contains(token),
      ).toBe(true);
    }
  });
});
