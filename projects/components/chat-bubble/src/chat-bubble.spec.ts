import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideZordonUi } from '@pranxy/zordon-ui';

import {
  resolveChatBubbleColor,
  resolveChatPlacement,
  ZdChat,
  ZdChatBubble,
  ZdChatFooter,
  ZdChatHeader,
  ZdChatImage,
} from './chat-bubble';

@Component({
  imports: [ZdChat, ZdChatBubble, ZdChatFooter, ZdChatHeader, ZdChatImage],
  template: `<li zdChat class="consumer" [placement]="placement()">
    <div zdChatImage class="consumer-image"><img alt="Ava Chen" src="/ava.png" /></div>
    <div zdChatHeader class="consumer-header">Ava <time datetime="2026-09-01T10:45">10:45</time></div>
    <div zdChatBubble class="consumer-bubble" [color]="color()">Ready for review.</div>
    <div zdChatFooter class="consumer-footer">Delivered</div>
  </li>`,
})
class TestChatHost {
  readonly color = signal<'success' | undefined>(undefined);
  readonly placement = signal<'start' | 'end'>('start');
}

describe('ZdChat', () => {
  it('adds native Chat candidates while preserving consumer message structure', () => {
    TestBed.configureTestingModule({ imports: [TestChatHost] });
    const fixture = TestBed.createComponent(TestChatHost);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.placement.set('end');
    fixture.detectChanges();

    const chat = fixture.nativeElement.querySelector('[zdChat]') as HTMLLIElement;
    const image = fixture.nativeElement.querySelector('[zdChatImage]') as HTMLElement;
    const header = fixture.nativeElement.querySelector('[zdChatHeader]') as HTMLElement;
    const bubble = fixture.nativeElement.querySelector('[zdChatBubble]') as HTMLElement;
    const footer = fixture.nativeElement.querySelector('[zdChatFooter]') as HTMLElement;
    for (const token of ['chat', 'chat-end', 'consumer']) {
      expect(chat.classList.contains(token)).toBe(true);
    }
    expect(image.classList.contains('chat-image')).toBe(true);
    expect(header.classList.contains('chat-header')).toBe(true);
    expect(bubble.classList.contains('chat-bubble')).toBe(true);
    expect(bubble.classList.contains('chat-bubble-success')).toBe(true);
    expect(footer.classList.contains('chat-footer')).toBe(true);
    expect(image.querySelector('img')?.getAttribute('alt')).toBe('Ava Chen');
    expect(header.querySelector('time')?.dateTime).toBe('2026-09-01T10:45');
    expect(chat.hasAttribute('role')).toBe(false);
    expect(chat.hasAttribute('tabindex')).toBe(false);
  });

  it('updates placement and removes stale Bubble color candidates', () => {
    TestBed.configureTestingModule({ imports: [TestChatHost] });
    const fixture = TestBed.createComponent(TestChatHost);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.placement.set('end');
    fixture.detectChanges();
    fixture.componentInstance.color.set(undefined);
    fixture.componentInstance.placement.set('start');
    fixture.detectChanges();

    const chat = fixture.nativeElement.querySelector('[zdChat]') as HTMLElement;
    const bubble = fixture.nativeElement.querySelector('[zdChatBubble]') as HTMLElement;
    expect(chat.classList.contains('chat-start')).toBe(true);
    expect(chat.classList.contains('chat-end')).toBe(false);
    expect(bubble.classList.contains('chat-bubble')).toBe(true);
    expect(bubble.classList.contains('chat-bubble-success')).toBe(false);
  });

  it('uses complete configured prefix tokens for every Chat directive', () => {
    TestBed.configureTestingModule({
      imports: [TestChatHost],
      providers: [provideZordonUi({ classPrefixes: { daisyUi: 'd-', tailwind: 'tw' } })],
    });
    const fixture = TestBed.createComponent(TestChatHost);
    fixture.detectChanges();
    fixture.componentInstance.color.set('success');
    fixture.componentInstance.placement.set('end');
    fixture.detectChanges();

    const chat = fixture.nativeElement.querySelector('[zdChat]') as HTMLElement;
    const image = fixture.nativeElement.querySelector('[zdChatImage]') as HTMLElement;
    const header = fixture.nativeElement.querySelector('[zdChatHeader]') as HTMLElement;
    const bubble = fixture.nativeElement.querySelector('[zdChatBubble]') as HTMLElement;
    const footer = fixture.nativeElement.querySelector('[zdChatFooter]') as HTMLElement;
    expect(chat.classList.contains('tw:d-chat')).toBe(true);
    expect(chat.classList.contains('tw:d-chat-end')).toBe(true);
    expect(image.classList.contains('tw:d-chat-image')).toBe(true);
    expect(header.classList.contains('tw:d-chat-header')).toBe(true);
    expect(bubble.classList.contains('tw:d-chat-bubble')).toBe(true);
    expect(bubble.classList.contains('tw:d-chat-bubble-success')).toBe(true);
    expect(footer.classList.contains('tw:d-chat-footer')).toBe(true);
  });

  it('rejects unknown placement and Bubble color candidates', () => {
    expect(() => resolveChatPlacement('middle')).toThrowError(/Chat placement/);
    expect(() => resolveChatBubbleColor('brand')).toThrowError(/Chat Bubble color/);
  });
});
