import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import { ZdList, ZdListColGrow, ZdListColWrap, ZdListRow } from './list';

@Component({
  imports: [ZdList, ZdListColGrow, ZdListColWrap, ZdListRow],
  template: `<ul zdList aria-label="Recently played" class="consumer-list">
    <li zdListRow class="consumer-row">
      <span>01</span>
      <div zdListColGrow>Moonlit Drive</div>
      <p zdListColWrap>Saved for offline listening.</p>
      <button type="button">Play</button>
    </li>
  </ul>`,
})
class Host {}

describe('ZdList directives', () => {
  it('applies every documented class while preserving native list semantics and consumer content', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[zdList]') as HTMLUListElement;
    const row = fixture.nativeElement.querySelector('[zdListRow]') as HTMLLIElement;
    const grow = fixture.nativeElement.querySelector('[zdListColGrow]') as HTMLElement;
    const wrap = fixture.nativeElement.querySelector('[zdListColWrap]') as HTMLParagraphElement;

    expect(list.tagName).toBe('UL');
    expect(list.classList.contains('list')).toBe(true);
    expect(list.classList.contains('consumer-list')).toBe(true);
    expect(list.getAttribute('aria-label')).toBe('Recently played');
    expect(list.hasAttribute('role')).toBe(false);
    expect(row.tagName).toBe('LI');
    expect(row.classList.contains('list-row')).toBe(true);
    expect(row.classList.contains('consumer-row')).toBe(true);
    expect(grow.classList.contains('list-col-grow')).toBe(true);
    expect(wrap.classList.contains('list-col-wrap')).toBe(true);
    expect(wrap.textContent).toContain('Saved for offline listening.');
  });

  it('uses complete configured prefix tokens for every part', () => {
    TestBed.configureTestingModule({
      imports: [Host],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();

    for (const [selector, token] of [
      ['[zdList]', 'tw:d-list'],
      ['[zdListRow]', 'tw:d-list-row'],
      ['[zdListColGrow]', 'tw:d-list-col-grow'],
      ['[zdListColWrap]', 'tw:d-list-col-wrap'],
    ]) {
      expect(
        (fixture.nativeElement.querySelector(selector) as HTMLElement).classList.contains(token),
      ).toBe(true);
    }
  });
});
