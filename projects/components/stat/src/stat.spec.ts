import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveStatsOrientation,
  type ZdStatsOrientation,
  ZdStat,
  ZdStatActions,
  ZdStatDesc,
  ZdStatFigure,
  ZdStatTitle,
  ZdStats,
  ZdStatValue,
} from './stat';

@Component({
  imports: [ZdStat, ZdStatActions, ZdStatDesc, ZdStatFigure, ZdStatTitle, ZdStats, ZdStatValue],
  template: `<section zdStats class="consumer" [orientation]="orientation()">
    <article zdStat class="consumer-stat">
      <p zdStatTitle class="consumer-title">Downloads</p>
      <p zdStatValue>31K</p>
      <p zdStatDesc>Up 400, 22%</p>
      <span zdStatFigure aria-hidden="true">↗</span>
      <div zdStatActions><button type="button">Open report</button></div>
    </article>
  </section>`,
})
class TestStatsHost {
  readonly orientation = signal<ZdStatsOrientation | undefined>(undefined);
}

describe('ZdStats', () => {
  it('adds Stat anatomy candidates while preserving consumer semantics', () => {
    TestBed.configureTestingModule({ imports: [TestStatsHost] });
    const fixture = TestBed.createComponent(TestStatsHost);
    fixture.detectChanges();
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();

    const stats = fixture.nativeElement.querySelector('[zdStats]') as HTMLElement;
    const stat = fixture.nativeElement.querySelector('[zdStat]') as HTMLElement;
    for (const token of ['stats', 'stats-vertical', 'consumer']) {
      expect(stats.classList.contains(token)).toBe(true);
    }
    expect(stats.tagName).toBe('SECTION');
    expect(stats.hasAttribute('role')).toBe(false);
    expect(stats.hasAttribute('tabindex')).toBe(false);
    expect(stat.classList.contains('stat')).toBe(true);
    expect(stat.classList.contains('consumer-stat')).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatTitle]').classList.contains('stat-title'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatValue]').classList.contains('stat-value'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatDesc]').classList.contains('stat-desc'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatFigure]').classList.contains('stat-figure'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatActions]').classList.contains('stat-actions'),
    ).toBe(true);
    expect(fixture.nativeElement.querySelector('button').type).toBe('button');
  });

  it('removes a stale optional orientation candidate when the input is cleared', () => {
    TestBed.configureTestingModule({ imports: [TestStatsHost] });
    const fixture = TestBed.createComponent(TestStatsHost);
    fixture.detectChanges();
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    fixture.componentInstance.orientation.set(undefined);
    fixture.detectChanges();

    const stats = fixture.nativeElement.querySelector('[zdStats]') as HTMLElement;
    expect(stats.classList.contains('stats')).toBe(true);
    expect(stats.classList.contains('stats-vertical')).toBe(false);
  });

  it('uses complete configured prefix tokens for every Stat directive', () => {
    TestBed.configureTestingModule({
      imports: [TestStatsHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestStatsHost);
    fixture.detectChanges();
    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();

    const stats = fixture.nativeElement.querySelector('[zdStats]') as HTMLElement;
    for (const token of ['tw:d-stats', 'tw:d-stats-horizontal']) {
      expect(stats.classList.contains(token)).toBe(true);
    }
    expect(fixture.nativeElement.querySelector('[zdStat]').classList.contains('tw:d-stat')).toBe(
      true,
    );
    expect(
      fixture.nativeElement.querySelector('[zdStatTitle]').classList.contains('tw:d-stat-title'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatValue]').classList.contains('tw:d-stat-value'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatDesc]').classList.contains('tw:d-stat-desc'),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('[zdStatFigure]').classList.contains('tw:d-stat-figure'),
    ).toBe(true);
    expect(
      fixture.nativeElement
        .querySelector('[zdStatActions]')
        .classList.contains('tw:d-stat-actions'),
    ).toBe(true);
  });

  it('rejects unknown orientation candidates', () => {
    expect(() => resolveStatsOrientation('diagonal')).toThrowError(/Stats orientation/);
  });
});
