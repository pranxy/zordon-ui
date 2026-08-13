import { isPlatformBrowser } from '@angular/common';
import { Directionality } from '@angular/cdk/bidi';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  inject,
  type InjectOptions,
  Injectable,
  Injector,
  PLATFORM_ID,
  type ProviderToken,
} from '@angular/core';
import { fromEvent, type Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import type { ZdOverlayHandle, ZdOverlayOpenConfig } from './overlay-contracts';
import { ZdBodyScrollLock } from './body-scroll-lock';
import { ZdInternalOverlayHandle } from './overlay-handle';
import { createZdPositionStrategy, createZdScrollStrategy } from './overlay-positioning';
import { ZdOverlayStack } from './overlay-stack';

@Injectable({ providedIn: 'root' })
export class ZdOverlayCoordinator {
  private readonly overlay = inject(Overlay);
  private readonly bodyScrollLock = inject(ZdBodyScrollLock);
  private readonly directionality = inject(Directionality);
  private readonly injector = inject(Injector);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly stack = inject(ZdOverlayStack);

  open<TComponent, TContext extends object>(
    config: ZdOverlayOpenConfig<TComponent, TContext>,
  ): ZdOverlayHandle | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const portalParent =
      config.content.injector ?? config.content.viewContainerRef?.injector ?? this.injector;
    const directionality = resolveZdDirectionality(config, this.directionality);
    const needsDirectionProvider = portalParent.get(Directionality, null) !== directionality;
    const portalInjector = needsDirectionProvider
      ? new NonOwningDirectionalityInjector(portalParent, directionality)
      : portalParent;
    const overlayRef = this.overlay.create({
      backdropClass: config.backdropClass ? [...asArray(config.backdropClass)] : undefined,
      hasBackdrop: config.hasBackdrop ?? false,
      panelClass: config.panelClass ? [...asArray(config.panelClass)] : undefined,
      direction: directionality.value,
      positionStrategy: createZdPositionStrategy(this.overlay, config.placement),
      scrollStrategy: createZdScrollStrategy(
        this.overlay,
        this.bodyScrollLock,
        config.scrollPolicy,
      ),
    });
    const handle = new ZdInternalOverlayHandle(overlayRef, this.stack, config.onCloseRequest);
    const directionSubscription = directionality.change
      .pipe(distinctUntilChanged())
      .subscribe(direction => {
        overlayRef.setDirection(direction);
        overlayRef.updatePosition();
      });
    const origin =
      config.origin ??
      (config.placement.kind === 'connected' ? unwrapOrigin(config.placement.origin) : undefined);

    try {
      const portal =
        config.content.kind === 'template'
          ? new TemplatePortal(
              config.content.template,
              config.content.viewContainerRef,
              config.content.context,
              portalInjector,
            )
          : new ComponentPortal(
              config.content.component,
              config.content.viewContainerRef,
              portalInjector,
            );
      overlayRef.attach(portal);
      handle.updateTheme(config.theme === undefined ? resolveTheme(origin) : config.theme);

      const parent = config.parent
        ? this.findRegistration(config.parent as ZdInternalOverlayHandle)
        : undefined;
      if (config.parent && (!parent || parent.lifecycle !== 'open')) {
        throw new Error('Zordon UI overlay parent is not open and registered in this coordinator.');
      }
      const registration = this.stack.register({
        backdrop: () => overlayRef.backdropElement,
        boundaries: [origin, ...(config.safeElements ?? [])].filter(isHTMLElement),
        pane: overlayRef.overlayElement,
        parent,
        requestClose: (reason, event) => handle.requestClose(reason, event),
      });
      this.rememberRegistration(handle, registration);
      handle.bind(registration, (): Subscription[] => {
        const boundarySubscriptions = [...registration.boundaries].flatMap(boundary => [
          fromEvent(boundary, 'pointerdown', { capture: true }).subscribe(() =>
            this.stack.markBoundaryPointerDown(registration),
          ),
          fromEvent(boundary, 'click', { capture: true }).subscribe(() =>
            this.stack.clearBoundaryPointerDown(registration),
          ),
          fromEvent(boundary, 'pointercancel', { capture: true }).subscribe(() =>
            this.stack.clearBoundaryPointerDown(registration),
          ),
        ]);
        return [
          directionSubscription,
          overlayRef
            .keydownEvents()
            .subscribe(event => this.stack.handleEscape(registration, event)),
          overlayRef
            .outsidePointerEvents()
            .subscribe(event => this.stack.handleOutside(registration, event)),
          overlayRef
            .backdropClick()
            .subscribe(event => this.stack.handleBackdrop(registration, event)),
          fromEvent(overlayRef.overlayElement, 'click').subscribe(() =>
            this.stack.clearBoundaryPointerDown(registration),
          ),
          ...boundarySubscriptions,
        ];
      });
      return handle;
    } catch (error) {
      directionSubscription.unsubscribe();
      handle.finalizeClose();
      throw error;
    }
  }

  private readonly registrations = new WeakMap<
    ZdInternalOverlayHandle,
    ReturnType<ZdOverlayStack['register']>
  >();

  private rememberRegistration(
    handle: ZdInternalOverlayHandle,
    registration: ReturnType<ZdOverlayStack['register']>,
  ): void {
    this.registrations.set(handle, registration);
  }

  private findRegistration(handle: ZdInternalOverlayHandle) {
    return this.registrations.get(handle);
  }
}

export function resolveZdDirectionality(
  config: Pick<ZdOverlayOpenConfig, 'content' | 'directionality'>,
  fallback: Directionality,
): Directionality {
  return (
    config.directionality ??
    config.content.injector?.get(Directionality, null, { self: true }) ??
    config.content.viewContainerRef?.injector.get(Directionality, fallback) ??
    fallback
  );
}

export class NonOwningDirectionalityInjector extends Injector {
  constructor(
    private readonly parent: Injector,
    private readonly directionality: Directionality,
  ) {
    super();
  }

  override get<T>(token: ProviderToken<T>, notFoundValue?: T, options?: InjectOptions): T {
    if (token === (Directionality as unknown as ProviderToken<T>)) {
      return this.directionality as unknown as T;
    }
    if (token === (Injector as unknown as ProviderToken<T>)) return this as unknown as T;
    return this.parent.get(token, notFoundValue, options);
  }
}

function resolveTheme(origin?: HTMLElement): string | null {
  for (let current: Node | null = origin ?? null; current; current = composedParent(current)) {
    if (current instanceof HTMLElement && current.hasAttribute('data-theme')) {
      return current.getAttribute('data-theme');
    }
  }
  return null;
}

function composedParent(node: Node): Node | null {
  if (node.parentNode) return node.parentNode;
  const root = node.getRootNode();
  return root instanceof ShadowRoot ? root.host : null;
}

function asArray(value: string | readonly string[]): readonly string[] {
  return typeof value === 'string' ? [value] : value;
}

function isHTMLElement(value: HTMLElement | undefined): value is HTMLElement {
  return value instanceof HTMLElement;
}

function unwrapOrigin(
  origin: Extract<ZdOverlayOpenConfig['placement'], { kind: 'connected' }>['origin'],
): HTMLElement {
  return origin instanceof HTMLElement ? origin : origin.nativeElement;
}
