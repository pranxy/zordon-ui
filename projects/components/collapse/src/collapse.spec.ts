import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveCollapseForcedState,
  resolveCollapseIndicator,
  type ZdCollapseForcedState,
  type ZdCollapseIndicator,
  ZdCollapse,
  ZdCollapseContent,
  ZdCollapseTitle,
} from './collapse';

@Component({
  imports: [ZdCollapse, ZdCollapseContent, ZdCollapseTitle],
  template: `<details
    zdCollapse
    class="consumer"
    [forcedState]="forcedState()"
    [indicator]="indicator()"
  >
    <summary zdCollapseTitle class="consumer-title">Release notes</summary>
    <div zdCollapseContent class="consumer-content">Read the complete release notes.</div>
  </details>`,
})
class TestCollapseHost {
  readonly forcedState = signal<ZdCollapseForcedState | undefined>(undefined);
  readonly indicator = signal<ZdCollapseIndicator | undefined>(undefined);
}

describe('ZdCollapse', () => {
  it('adds native Collapse candidates while preserving details and summary semantics', () => {
    TestBed.configureTestingModule({ imports: [TestCollapseHost] });
    const fixture = TestBed.createComponent(TestCollapseHost);
    fixture.detectChanges();
    fixture.componentInstance.forcedState.set('open');
    fixture.componentInstance.indicator.set('arrow');
    fixture.detectChanges();

    const collapse = fixture.nativeElement.querySelector('[zdCollapse]') as HTMLDetailsElement;
    const title = fixture.nativeElement.querySelector('[zdCollapseTitle]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[zdCollapseContent]') as HTMLElement;
    for (const token of ['collapse', 'collapse-arrow', 'collapse-open', 'consumer']) {
      expect(collapse.classList.contains(token)).toBe(true);
    }
    expect(collapse.tagName).toBe('DETAILS');
    expect(collapse.hasAttribute('open')).toBe(false);
    expect(collapse.hasAttribute('role')).toBe(false);
    expect(collapse.hasAttribute('tabindex')).toBe(false);
    expect(title.tagName).toBe('SUMMARY');
    expect(title.classList.contains('collapse-title')).toBe(true);
    expect(title.classList.contains('consumer-title')).toBe(true);
    expect(content.classList.contains('collapse-content')).toBe(true);
    expect(content.classList.contains('consumer-content')).toBe(true);
  });

  it('removes stale optional Collapse candidates when inputs are cleared', () => {
    TestBed.configureTestingModule({ imports: [TestCollapseHost] });
    const fixture = TestBed.createComponent(TestCollapseHost);
    fixture.detectChanges();
    fixture.componentInstance.forcedState.set('close');
    fixture.componentInstance.indicator.set('plus');
    fixture.detectChanges();
    fixture.componentInstance.forcedState.set(undefined);
    fixture.componentInstance.indicator.set(undefined);
    fixture.detectChanges();

    const collapse = fixture.nativeElement.querySelector('[zdCollapse]') as HTMLElement;
    expect(collapse.classList.contains('collapse')).toBe(true);
    expect(collapse.classList.contains('collapse-close')).toBe(false);
    expect(collapse.classList.contains('collapse-plus')).toBe(false);
  });

  it('uses complete configured prefix tokens for every Collapse directive', () => {
    TestBed.configureTestingModule({
      imports: [TestCollapseHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestCollapseHost);
    fixture.detectChanges();
    fixture.componentInstance.forcedState.set('close');
    fixture.componentInstance.indicator.set('plus');
    fixture.detectChanges();

    const collapse = fixture.nativeElement.querySelector('[zdCollapse]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('[zdCollapseTitle]') as HTMLElement;
    const content = fixture.nativeElement.querySelector('[zdCollapseContent]') as HTMLElement;
    for (const token of ['tw:d-collapse', 'tw:d-collapse-plus', 'tw:d-collapse-close']) {
      expect(collapse.classList.contains(token)).toBe(true);
    }
    expect(title.classList.contains('tw:d-collapse-title')).toBe(true);
    expect(content.classList.contains('tw:d-collapse-content')).toBe(true);
  });

  it('rejects unknown Collapse candidate values', () => {
    expect(() => resolveCollapseIndicator('chevron')).toThrowError(/Collapse indicator/);
    expect(() => resolveCollapseForcedState('expanded')).toThrowError(/Collapse forcedState/);
  });
});
