import type { Overlay } from '@angular/cdk/overlay';

import { createZdPositionStrategy, createZdScrollStrategy } from './overlay-positioning';

describe('overlay positioning policy', () => {
  it('maps ordered connected positions and explicit collision defaults', () => {
    const strategy = {
      withFlexibleDimensions: vi.fn().mockReturnThis(),
      withGrowAfterOpen: vi.fn().mockReturnThis(),
      withPositions: vi.fn().mockReturnThis(),
      withPush: vi.fn().mockReturnThis(),
      withViewportMargin: vi.fn().mockReturnThis(),
    };
    const overlay = {
      position: () => ({ flexibleConnectedTo: vi.fn(() => strategy) }),
    } as unknown as Overlay;
    const positions = [
      {
        offsetY: 4,
        originX: 'start' as const,
        originY: 'bottom' as const,
        overlayX: 'start' as const,
        overlayY: 'top' as const,
        panelClass: 'below',
      },
      {
        originX: 'start' as const,
        originY: 'top' as const,
        overlayX: 'start' as const,
        overlayY: 'bottom' as const,
      },
    ];

    expect(
      createZdPositionStrategy(overlay, {
        kind: 'connected',
        origin: document.createElement('button'),
        positions,
      }),
    ).toBe(strategy);
    expect(strategy.withPositions).toHaveBeenCalledWith([
      { ...positions[0], panelClass: ['below'] },
      { ...positions[1], panelClass: undefined },
    ]);
    expect(strategy.withViewportMargin).toHaveBeenCalledWith(8);
    expect(strategy.withPush).toHaveBeenCalledWith(true);
    expect(strategy.withFlexibleDimensions).toHaveBeenCalledWith(true);
    expect(strategy.withGrowAfterOpen).toHaveBeenCalledWith(false);
  });

  it('preserves an array of connected-position panel classes', () => {
    const strategy = {
      withFlexibleDimensions: vi.fn().mockReturnThis(),
      withGrowAfterOpen: vi.fn().mockReturnThis(),
      withPositions: vi.fn().mockReturnThis(),
      withPush: vi.fn().mockReturnThis(),
      withViewportMargin: vi.fn().mockReturnThis(),
    };
    const overlay = {
      position: () => ({ flexibleConnectedTo: vi.fn(() => strategy) }),
    } as unknown as Overlay;
    createZdPositionStrategy(overlay, {
      kind: 'connected',
      origin: document.createElement('button'),
      positions: [
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          panelClass: ['one', 'two'],
        },
      ],
    });
    expect(strategy.withPositions).toHaveBeenCalledWith([
      expect.objectContaining({ panelClass: ['one', 'two'] }),
    ]);
  });

  it('rejects an empty connected fallback list', () => {
    const overlay = {
      position: () => ({ flexibleConnectedTo: vi.fn() }),
    } as unknown as Overlay;
    expect(() =>
      createZdPositionStrategy(overlay, {
        kind: 'connected',
        origin: document.createElement('button'),
        positions: [],
      }),
    ).toThrowError(/at least one/);
  });

  it.each([
    ['start', 'top', '1rem', '2rem', 'start', 'top'],
    ['end', 'bottom', '3px', '4px', 'end', 'bottom'],
    [undefined, undefined, undefined, undefined, 'centerHorizontally', 'centerVertically'],
  ] as const)(
    'maps global horizontal %s and vertical %s placement',
    (horizontal, vertical, offsetX, offsetY, horizontalMethod, verticalMethod) => {
      const strategy = {
        bottom: vi.fn().mockReturnThis(),
        centerHorizontally: vi.fn().mockReturnThis(),
        centerVertically: vi.fn().mockReturnThis(),
        end: vi.fn().mockReturnThis(),
        start: vi.fn().mockReturnThis(),
        top: vi.fn().mockReturnThis(),
      };
      const overlay = { position: () => ({ global: () => strategy }) } as unknown as Overlay;
      expect(
        createZdPositionStrategy(overlay, {
          horizontal,
          kind: 'global',
          offsetX,
          offsetY,
          vertical,
        }),
      ).toBe(strategy);
      expect(strategy[horizontalMethod]).toHaveBeenCalledWith(offsetX ?? '');
      expect(strategy[verticalMethod]).toHaveBeenCalledWith(offsetY ?? '');
    },
  );

  it('creates only noop or non-auto-closing reposition scroll strategies', () => {
    const noop = {};
    const reposition = {};
    const overlay = {
      scrollStrategies: {
        noop: vi.fn(() => noop),
        reposition: vi.fn(() => reposition),
      },
    } as unknown as Overlay;

    expect(createZdScrollStrategy(overlay, 'noop')).toBe(noop);
    expect(createZdScrollStrategy(overlay)).toBe(reposition);
    expect(overlay.scrollStrategies.reposition).toHaveBeenCalledWith({
      autoClose: false,
      scrollThrottle: 0,
    });
  });
});
