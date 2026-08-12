import type {
  ConnectedPosition,
  GlobalPositionStrategy,
  Overlay,
  PositionStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';

import type {
  ZdOverlayConnectedPosition,
  ZdOverlayPlacement,
  ZdOverlayScrollPolicy,
} from './overlay-contracts';

const DEFAULT_VIEWPORT_MARGIN = 8;

export function createZdPositionStrategy(
  overlay: Overlay,
  placement: ZdOverlayPlacement,
): PositionStrategy {
  if (placement.kind === 'global') return createGlobalPositionStrategy(overlay, placement);

  if (placement.positions.length === 0) {
    throw new RangeError('Zordon UI connected overlays require at least one preferred position.');
  }

  return overlay
    .position()
    .flexibleConnectedTo(placement.origin)
    .withPositions(placement.positions.map(toCdkPosition))
    .withViewportMargin(placement.viewportMargin ?? DEFAULT_VIEWPORT_MARGIN)
    .withPush(placement.push ?? true)
    .withFlexibleDimensions(placement.flexibleDimensions ?? true)
    .withGrowAfterOpen(placement.growAfterOpen ?? false);
}

export function createZdScrollStrategy(
  overlay: Overlay,
  policy: ZdOverlayScrollPolicy = 'reposition',
): ScrollStrategy {
  return policy === 'noop'
    ? overlay.scrollStrategies.noop()
    : overlay.scrollStrategies.reposition({ autoClose: false, scrollThrottle: 0 });
}

function toCdkPosition(position: ZdOverlayConnectedPosition): ConnectedPosition {
  return {
    ...position,
    panelClass: position.panelClass ? [...asArray(position.panelClass)] : undefined,
  };
}

function createGlobalPositionStrategy(
  overlay: Overlay,
  placement: Extract<ZdOverlayPlacement, { kind: 'global' }>,
): GlobalPositionStrategy {
  const strategy = overlay.position().global();
  const offsetX = placement.offsetX ?? '';
  const offsetY = placement.offsetY ?? '';

  switch (placement.horizontal) {
    case 'start':
      strategy.start(offsetX);
      break;
    case 'end':
      strategy.end(offsetX);
      break;
    default:
      strategy.centerHorizontally(offsetX);
  }

  switch (placement.vertical) {
    case 'top':
      strategy.top(offsetY);
      break;
    case 'bottom':
      strategy.bottom(offsetY);
      break;
    default:
      strategy.centerVertically(offsetY);
  }

  return strategy;
}

function asArray(value: string | readonly string[]): readonly string[] {
  return typeof value === 'string' ? [value] : value;
}
