import type { ElementRef, Injector, TemplateRef, Type, ViewContainerRef } from '@angular/core';

export type ZdOverlayLifecycle = 'opening' | 'open' | 'closing' | 'closed';

export type ZdOverlayCloseReason =
  | 'trigger'
  | 'selection'
  | 'backdrop'
  | 'outside-pointer'
  | 'escape'
  | 'programmatic'
  | 'navigation'
  | 'destroy';

export type ZdOverlayScrollPolicy = 'noop' | 'reposition';

export interface ZdOverlayConnectedPosition {
  readonly originX: 'start' | 'center' | 'end';
  readonly originY: 'top' | 'center' | 'bottom';
  readonly overlayX: 'start' | 'center' | 'end';
  readonly overlayY: 'top' | 'center' | 'bottom';
  readonly offsetX?: number;
  readonly offsetY?: number;
  readonly panelClass?: string | readonly string[];
}

export interface ZdOverlayConnectedPlacement {
  readonly kind: 'connected';
  readonly origin: ElementRef<HTMLElement> | HTMLElement;
  readonly positions: readonly ZdOverlayConnectedPosition[];
  readonly viewportMargin?: number;
  readonly push?: boolean;
  readonly flexibleDimensions?: boolean;
  readonly growAfterOpen?: boolean;
}

export interface ZdOverlayGlobalPlacement {
  readonly kind: 'global';
  readonly horizontal?: 'start' | 'center' | 'end';
  readonly vertical?: 'top' | 'center' | 'bottom';
  readonly offsetX?: string;
  readonly offsetY?: string;
}

export type ZdOverlayPlacement = ZdOverlayConnectedPlacement | ZdOverlayGlobalPlacement;

export interface ZdOverlayTemplateContent<TContext extends object = object> {
  readonly kind: 'template';
  readonly template: TemplateRef<TContext>;
  readonly viewContainerRef: ViewContainerRef;
  readonly context?: TContext;
  readonly injector?: Injector;
}

export interface ZdOverlayComponentContent<TComponent> {
  readonly kind: 'component';
  readonly component: Type<TComponent>;
  readonly viewContainerRef?: ViewContainerRef;
  readonly injector?: Injector;
}

export type ZdOverlayContent<TComponent = unknown, TContext extends object = object> =
  ZdOverlayTemplateContent<TContext> | ZdOverlayComponentContent<TComponent>;

export interface ZdOverlayOpenConfig<TComponent = unknown, TContext extends object = object> {
  readonly content: ZdOverlayContent<TComponent, TContext>;
  readonly placement: ZdOverlayPlacement;
  readonly scrollPolicy?: ZdOverlayScrollPolicy;
  readonly parent?: ZdOverlayHandle;
  readonly origin?: HTMLElement;
  readonly safeElements?: readonly HTMLElement[];
  readonly hasBackdrop?: boolean;
  readonly panelClass?: string | readonly string[];
  readonly backdropClass?: string | readonly string[];
  readonly theme?: string | null;
  readonly onCloseRequest: (reason: ZdOverlayCloseReason, event?: Event) => void;
}

export interface ZdOverlayHandle {
  readonly lifecycle: ZdOverlayLifecycle;
  requestClose(reason: ZdOverlayCloseReason, event?: Event): boolean;
  finalizeClose(): void;
  destroy(): void;
  updateTheme(theme: string | null): void;
}
