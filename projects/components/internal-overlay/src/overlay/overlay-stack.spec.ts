import { ZdOverlayStack } from './overlay-stack';

function pathEvent(type: string, path: EventTarget[]): MouseEvent {
  const event = new MouseEvent(type, { bubbles: true });
  vi.spyOn(event, 'composedPath').mockReturnValue(path);
  return event;
}

describe('ZdOverlayStack', () => {
  it('routes one plain Escape to the top surface and keeps a closing surface shielding its parent', () => {
    const stack = new ZdOverlayStack();
    const lowerRequests: string[] = [];
    const upperRequests: string[] = [];
    const lower = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: reason => lowerRequests.push(reason),
    });
    const upper = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: reason => upperRequests.push(reason),
    });
    stack.markOpen(lower);
    stack.markOpen(upper);
    stack.markOpen(upper);

    expect(stack.handleEscape(lower, new KeyboardEvent('keydown', { key: 'Escape' }))).toBe(false);
    const escape = new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' });
    expect(stack.handleEscape(upper, escape)).toBe(true);
    expect(stack.handleEscape(upper, escape)).toBe(false);
    expect(escape.defaultPrevented).toBe(true);
    expect(upperRequests).toEqual(['escape']);

    expect(stack.markClosing(upper)).toBe(true);
    expect(stack.markClosing(upper)).toBe(false);
    expect(stack.handleEscape(lower, new KeyboardEvent('keydown', { key: 'Escape' }))).toBe(false);
    expect(lowerRequests).toEqual([]);
  });

  it('rejects Escape delivery to a lower surface while another surface is topmost', () => {
    const stack = new ZdOverlayStack();
    const lower = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    expect(stack.handleEscape(lower, new KeyboardEvent('keydown', { key: 'Escape' }))).toBe(false);
  });

  it('rejects the same Escape event after a synchronous top-surface removal', () => {
    const stack = new ZdOverlayStack();
    const lowerRequest = vi.fn();
    const lower = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: lowerRequest,
    });
    const upperRef: { current?: ReturnType<ZdOverlayStack['register']> } = {};
    const upper = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: () => stack.unregister(upperRef.current!),
    });
    upperRef.current = upper;
    const event = new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' });
    expect(stack.handleEscape(upper, event)).toBe(true);
    expect(stack.handleEscape(lower, event)).toBe(false);
    expect(lowerRequest).not.toHaveBeenCalled();
  });

  it('does not deliver one non-cancelable Escape event twice to the same top surface', () => {
    const stack = new ZdOverlayStack();
    const request = vi.fn();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: request,
    });
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    expect(stack.handleEscape(registration, event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    expect(stack.handleEscape(registration, event)).toBe(false);
    expect(request).toHaveBeenCalledOnce();
  });

  it.each([
    new KeyboardEvent('keydown', { key: 'Enter' }),
    new KeyboardEvent('keydown', { altKey: true, key: 'Escape' }),
    new KeyboardEvent('keydown', { ctrlKey: true, key: 'Escape' }),
    new KeyboardEvent('keydown', { metaKey: true, key: 'Escape' }),
    new KeyboardEvent('keydown', { shiftKey: true, key: 'Escape' }),
    new KeyboardEvent('keydown', { isComposing: true, key: 'Escape' }),
    new KeyboardEvent('keydown', { key: 'Escape', repeat: true }),
  ])('rejects a non-plain Escape request', event => {
    const stack = new ZdOverlayStack();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    stack.markOpen(registration);
    expect(stack.handleEscape(registration, event)).toBe(false);
  });

  it('honors an already prevented Escape', () => {
    const stack = new ZdOverlayStack();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    stack.markOpen(registration);
    const event = new KeyboardEvent('keydown', { cancelable: true, key: 'Escape' });
    event.preventDefault();
    expect(stack.handleEscape(registration, event)).toBe(false);
  });

  it('claims an outside event before synchronous stack mutation', () => {
    const stack = new ZdOverlayStack();
    const lowerRequest = vi.fn();
    const lower = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: lowerRequest,
    });
    const upperRef: { current?: ReturnType<ZdOverlayStack['register']> } = {};
    const upperRequest = vi.fn(() => stack.unregister(upperRef.current!));
    const upper = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: upperRequest,
    });
    upperRef.current = upper;
    const event = pathEvent('click', [document.body, document, window]);

    expect(stack.handleOutside(upper, event)).toBe(true);
    expect(stack.handleOutside(lower, event)).toBe(false);
    expect(upperRequest).toHaveBeenCalledOnce();
    expect(lowerRequest).not.toHaveBeenCalled();
  });

  it('treats a pointer-down on a logical boundary as inside until the matching click', () => {
    const stack = new ZdOverlayStack();
    const request = vi.fn();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: request,
    });
    stack.markBoundaryPointerDown(registration);

    expect(stack.handleOutside(registration, pathEvent('click', [document.body]))).toBe(false);
    expect(request).not.toHaveBeenCalled();
    expect(stack.handleOutside(registration, pathEvent('click', [document.body]))).toBe(true);
  });

  it('clears a logical-boundary pointer origin after cancellation or an inside click', () => {
    const stack = new ZdOverlayStack();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    stack.markBoundaryPointerDown(registration);
    stack.clearBoundaryPointerDown(registration);
    expect(stack.handleOutside(registration, pathEvent('click', [document.body]))).toBe(true);
  });

  it('returns false when no top surface exists and when an outside event is already claimed', () => {
    const stack = new ZdOverlayStack();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    const event = pathEvent('click', [document.body]);
    expect(stack.handleOutside(registration, event)).toBe(true);
    expect(stack.handleOutside(registration, event)).toBe(false);
    stack.unregister(registration);
    expect(stack.handleOutside(registration, pathEvent('click', [document.body]))).toBe(false);
  });

  it('treats pane, safe element, and child pane as logical inside boundaries', () => {
    const stack = new ZdOverlayStack();
    const pane = document.createElement('div');
    const safe = document.createElement('button');
    const otherSafe = document.createElement('button');
    const request = vi.fn();
    const parent = stack.register({
      backdrop: () => null,
      boundaries: [otherSafe, safe],
      pane,
      requestClose: request,
    });
    const childPane = document.createElement('div');
    const child = stack.register({
      backdrop: () => null,
      pane: childPane,
      parent,
      requestClose: vi.fn(),
    });

    expect(stack.handleOutside(child, pathEvent('click', [childPane]))).toBe(false);
    stack.unregister(child);
    expect(stack.handleOutside(parent, pathEvent('click', [pane]))).toBe(false);
    expect(stack.handleOutside(parent, pathEvent('click', [safe]))).toBe(false);
    expect(request).not.toHaveBeenCalled();
  });

  it('deduplicates outside capture and backdrop delivery into one backdrop request', () => {
    const stack = new ZdOverlayStack();
    const backdrop = document.createElement('div');
    const request = vi.fn();
    const registration = stack.register({
      backdrop: () => backdrop,
      pane: document.createElement('div'),
      requestClose: request,
    });
    const event = pathEvent('click', [backdrop, document.body]);

    expect(stack.handleOutside(registration, event)).toBe(false);
    expect(stack.handleBackdrop(registration, event)).toBe(true);
    expect(stack.handleBackdrop(registration, event)).toBe(false);
    expect(request).toHaveBeenCalledOnce();
    expect(request).toHaveBeenCalledWith('backdrop', event);
  });

  it('delivers a direct backdrop event without a preceding outside capture', () => {
    const stack = new ZdOverlayStack();
    const request = vi.fn();
    const registration = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: request,
    });
    const event = pathEvent('click', [document.body]);
    expect(stack.handleBackdrop(registration, event)).toBe(true);
    expect(request).toHaveBeenCalledWith('backdrop', event);
  });

  it('rejects backdrop delivery to a lower or differently claimed surface', () => {
    const stack = new ZdOverlayStack();
    const lower = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    const upper = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    const event = pathEvent('click', [document.body]);
    expect(stack.handleOutside(upper, event)).toBe(true);
    expect(stack.handleBackdrop(lower, event)).toBe(false);
    expect(stack.handleBackdrop(upper, event)).toBe(false);
  });

  it('requires child overlays to finalize before their parent', () => {
    const stack = new ZdOverlayStack();
    const parent = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      requestClose: vi.fn(),
    });
    const child = stack.register({
      backdrop: () => null,
      pane: document.createElement('div'),
      parent,
      requestClose: vi.fn(),
    });

    expect(() => stack.unregister(parent)).toThrowError(/child overlays/);
    stack.unregister(child);
    stack.unregister(parent);
    stack.unregister(parent);
    expect(stack.size()).toBe(0);
    expect(parent.lifecycle).toBe('closed');
  });
});
