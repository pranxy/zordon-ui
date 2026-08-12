import type { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';

import { ZdInternalOverlayHandle } from './overlay-handle';
import { ZdOverlayStack } from './overlay-stack';

describe('ZdInternalOverlayHandle', () => {
  function setup() {
    const overlayElement = document.createElement('div');
    const overlayRef = {
      dispose: vi.fn(),
      overlayElement,
    } as unknown as OverlayRef;
    const stack = new ZdOverlayStack();
    const request = vi.fn();
    const handle = new ZdInternalOverlayHandle(overlayRef, stack, request);
    const registration = stack.register({
      backdrop: () => null,
      pane: overlayElement,
      requestClose: (reason, event) => handle.requestClose(reason, event),
    });
    const subscription = new Subscription();
    vi.spyOn(subscription, 'unsubscribe');
    return { handle, overlayElement, overlayRef, registration, request, stack, subscription };
  }

  it('owns opening, close request, final disposal, subscriptions, and theme state', () => {
    const { handle, overlayElement, overlayRef, registration, request, stack, subscription } =
      setup();
    handle.bind(registration, () => [subscription]);
    expect(handle.lifecycle).toBe('open');

    handle.updateTheme('night');
    expect(overlayElement.getAttribute('data-theme')).toBe('night');
    handle.updateTheme('day');
    expect(overlayElement.getAttribute('data-theme')).toBe('day');
    handle.updateTheme('');
    expect(overlayElement.hasAttribute('data-theme')).toBe(false);
    handle.updateTheme(null);

    const event = new Event('close');
    expect(handle.requestClose('programmatic', event)).toBe(true);
    expect(handle.requestClose('programmatic')).toBe(false);
    expect(request).toHaveBeenCalledWith('programmatic', event);
    expect(handle.lifecycle).toBe('closing');

    handle.finalizeClose();
    handle.finalizeClose();
    expect(handle.lifecycle).toBe('closed');
    expect(subscription.unsubscribe).toHaveBeenCalledOnce();
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
    expect(stack.size()).toBe(0);
  });

  it('rejects duplicate binding and makes destroy idempotent', () => {
    const { handle, overlayRef, registration, request, subscription } = setup();
    handle.bind(registration, () => [subscription]);
    expect(() => handle.bind(registration, () => [])).toThrowError(/only be bound once/);
    handle.destroy();
    handle.destroy();
    expect(request).toHaveBeenCalledWith('destroy', undefined);
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });

  it('can dispose an unbound handle after partial setup fails', () => {
    const { handle, overlayRef } = setup();
    handle.finalizeClose();
    expect(handle.lifecycle).toBe('closed');
    expect(handle.requestClose('destroy')).toBe(false);
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });

  it('can unwind a registration when event subscription setup fails', () => {
    const { handle, overlayRef, registration, stack } = setup();
    expect(() =>
      handle.bind(registration, () => {
        throw new Error('subscription failed');
      }),
    ).toThrowError('subscription failed');
    handle.finalizeClose();
    expect(stack.size()).toBe(0);
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });

  it('retains owned resources when child-first finalization rejects disposal', () => {
    const { handle, overlayRef, registration, stack, subscription } = setup();
    handle.bind(registration, () => [subscription]);
    const child = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      parent: registration,
      requestClose: vi.fn(),
    });

    expect(() => handle.finalizeClose()).toThrowError(/child overlays/);
    expect(handle.lifecycle).toBe('open');
    expect(subscription.unsubscribe).not.toHaveBeenCalled();
    expect(overlayRef.dispose).not.toHaveBeenCalled();
    expect(stack.size()).toBe(2);

    stack.unregister(child);
    handle.finalizeClose();
    expect(subscription.unsubscribe).toHaveBeenCalledOnce();
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });

  it('does not issue a destroy request after close was already requested', () => {
    const { handle, registration, request } = setup();
    handle.bind(registration, () => []);
    handle.requestClose('navigation');
    handle.destroy();
    expect(request).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledWith('navigation', undefined);
  });
});
