import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveCardSize,
  resolveCardStyle,
  ZdCard,
  ZdCardActions,
  ZdCardBody,
  ZdCardTitle,
} from './card';

@Component({
  imports: [ZdCard, ZdCardActions, ZdCardBody, ZdCardTitle],
  template: `<article
    zdCard
    class="consumer"
    [imageFull]="imageFull()"
    [side]="side()"
    [size]="size()"
    [style]="style()"
  >
    <figure><img alt="Card media" src="/card.png" /></figure>
    <div zdCardBody class="consumer-body">
      <h2 zdCardTitle class="consumer-title">Card title</h2>
      <div zdCardActions class="consumer-actions"><button type="button">Open</button></div>
    </div>
  </article>`,
})
class TestCardHost {
  readonly imageFull = signal(false);
  readonly side = signal(false);
  readonly size = signal<'xl' | undefined>(undefined);
  readonly style = signal<'dash' | undefined>(undefined);
}

describe('ZdCard', () => {
  it('adds every native Card candidate while preserving consumer composition', () => {
    TestBed.configureTestingModule({ imports: [TestCardHost] });
    const fixture = TestBed.createComponent(TestCardHost);
    fixture.detectChanges();
    fixture.componentInstance.imageFull.set(true);
    fixture.componentInstance.side.set(true);
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.style.set('dash');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('[zdCard]') as HTMLElement;
    const body = fixture.nativeElement.querySelector('[zdCardBody]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('[zdCardTitle]') as HTMLHeadingElement;
    const actions = fixture.nativeElement.querySelector('[zdCardActions]') as HTMLElement;

    for (const token of ['card', 'card-dash', 'card-xl', 'card-side', 'image-full', 'consumer']) {
      expect(card.classList.contains(token)).toBe(true);
    }
    expect(body.classList.contains('card-body')).toBe(true);
    expect(body.classList.contains('consumer-body')).toBe(true);
    expect(title.classList.contains('card-title')).toBe(true);
    expect(title.tagName).toBe('H2');
    expect(actions.classList.contains('card-actions')).toBe(true);
    expect(card.querySelector('figure img')?.getAttribute('alt')).toBe('Card media');
    expect(card.hasAttribute('role')).toBe(false);
    expect(card.hasAttribute('tabindex')).toBe(false);
  });

  it('removes stale optional Card candidates when inputs are cleared', () => {
    TestBed.configureTestingModule({ imports: [TestCardHost] });
    const fixture = TestBed.createComponent(TestCardHost);
    fixture.detectChanges();
    fixture.componentInstance.imageFull.set(true);
    fixture.componentInstance.side.set(true);
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.style.set('dash');
    fixture.detectChanges();
    fixture.componentInstance.imageFull.set(false);
    fixture.componentInstance.side.set(false);
    fixture.componentInstance.size.set(undefined);
    fixture.componentInstance.style.set(undefined);
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('[zdCard]') as HTMLElement;
    expect(card.classList.contains('card')).toBe(true);
    for (const token of ['card-dash', 'card-xl', 'card-side', 'image-full']) {
      expect(card.classList.contains(token)).toBe(false);
    }
  });

  it('uses complete configured prefix tokens for every Card directive', () => {
    TestBed.configureTestingModule({
      imports: [TestCardHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestCardHost);
    fixture.detectChanges();
    fixture.componentInstance.imageFull.set(true);
    fixture.componentInstance.side.set(true);
    fixture.componentInstance.size.set('xl');
    fixture.componentInstance.style.set('dash');
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('[zdCard]') as HTMLElement;
    const body = fixture.nativeElement.querySelector('[zdCardBody]') as HTMLElement;
    const title = fixture.nativeElement.querySelector('[zdCardTitle]') as HTMLElement;
    const actions = fixture.nativeElement.querySelector('[zdCardActions]') as HTMLElement;
    for (const token of [
      'tw:d-card',
      'tw:d-card-dash',
      'tw:d-card-xl',
      'tw:d-card-side',
      'tw:d-image-full',
    ]) {
      expect(card.classList.contains(token)).toBe(true);
    }
    expect(body.classList.contains('tw:d-card-body')).toBe(true);
    expect(title.classList.contains('tw:d-card-title')).toBe(true);
    expect(actions.classList.contains('tw:d-card-actions')).toBe(true);
  });

  it('rejects unknown Card candidate values', () => {
    expect(() => resolveCardSize('2xl')).toThrowError(/Card size/);
    expect(() => resolveCardStyle('solid')).toThrowError(/Card style/);
  });
});
