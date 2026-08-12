import { Component } from '@angular/core';
import { Overlay, OverlayConfig, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

@Component({
  template: `<button data-testid="inside" type="button">Inside overlay</button>`,
})
class TestOverlayContent {}

describe('CDK overlay dismissal compatibility', () => {
  const overlayRefs: OverlayRef[] = [];

  function attachOverlay(config?: OverlayConfig): OverlayRef {
    const overlayRef = TestBed.inject(Overlay).create(config);
    overlayRef.attach(new ComponentPortal(TestOverlayContent));
    overlayRefs.push(overlayRef);
    return overlayRef;
  }

  function dispatchPrimaryClick(target: EventTarget, pointerDownTarget = target): MouseEvent {
    pointerDownTarget.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, composed: true }),
    );
    const event = new MouseEvent('click', { bubbles: true, composed: true });
    target.dispatchEvent(event);
    return event;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OverlayModule, TestOverlayContent] });
  });

  afterEach(() => {
    for (const overlayRef of overlayRefs.splice(0)) {
      overlayRef.dispose();
    }
  });

  it('routes keyboard events to only the newest subscribed eligible overlay', () => {
    const lower = attachOverlay();
    const upper = attachOverlay();
    const lowerEvents: KeyboardEvent[] = [];
    const upperEvents: KeyboardEvent[] = [];
    lower.keydownEvents().subscribe(event => lowerEvents.push(event));
    const upperSubscription = upper.keydownEvents().subscribe(event => upperEvents.push(event));

    const firstEscape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.body.dispatchEvent(firstEscape);

    expect(upperEvents).toEqual([firstEscape]);
    expect(lowerEvents).toEqual([]);

    upperSubscription.unsubscribe();
    const secondEscape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.body.dispatchEvent(secondEscape);

    expect(lowerEvents).toEqual([secondEscape]);
  });

  it('lets an event predicate pass keyboard ownership to the next eligible overlay', () => {
    const lower = attachOverlay();
    const upper = attachOverlay(
      new OverlayConfig({ eventPredicate: event => event.type !== 'keydown' }),
    );
    const lowerEvents: KeyboardEvent[] = [];
    const upperEvents: KeyboardEvent[] = [];
    lower.keydownEvents().subscribe(event => lowerEvents.push(event));
    upper.keydownEvents().subscribe(event => upperEvents.push(event));

    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    document.body.dispatchEvent(escape);

    expect(lowerEvents).toEqual([escape]);
    expect(upperEvents).toEqual([]);
  });

  it('characterizes outside routing, containment, drag boundaries, and detach cleanup', () => {
    const lower = attachOverlay();
    const upper = attachOverlay();
    const lowerEvents: MouseEvent[] = [];
    const upperEvents: MouseEvent[] = [];
    lower.outsidePointerEvents().subscribe(event => lowerEvents.push(event));
    const upperSubscription = upper
      .outsidePointerEvents()
      .subscribe(event => upperEvents.push(event));

    const outsideBoth = dispatchPrimaryClick(document.body);
    expect(upperEvents).toEqual([outsideBoth]);
    expect(lowerEvents).toEqual([outsideBoth]);

    upperEvents.length = 0;
    lowerEvents.length = 0;
    const upperInside = upper.overlayElement.querySelector('[data-testid="inside"]')!;
    dispatchPrimaryClick(upperInside);
    expect(upperEvents).toEqual([]);
    expect(lowerEvents).toEqual([]);

    const lowerInside = lower.overlayElement.querySelector('[data-testid="inside"]')!;
    const insideLowerOnly = dispatchPrimaryClick(lowerInside);
    expect(upperEvents).toEqual([insideLowerOnly]);
    expect(lowerEvents).toEqual([]);

    upperEvents.length = 0;
    dispatchPrimaryClick(document.body, upperInside);
    expect(upperEvents).toEqual([]);
    expect(lowerEvents).toEqual([]);

    dispatchPrimaryClick(upperInside, document.body);
    expect(upperEvents).toEqual([]);
    expect(lowerEvents).toEqual([]);

    upperSubscription.unsubscribe();
    const unshieldedUpper = dispatchPrimaryClick(upperInside);
    expect(lowerEvents).toEqual([unshieldedUpper]);

    lowerEvents.length = 0;
    upper.detach();
    lower.detach();
    dispatchPrimaryClick(document.body);
    expect(lowerEvents).toEqual([]);
  });
});
