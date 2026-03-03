import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { EnvironmentInjector, Injectable, Injector, Type } from '@angular/core';
import { DialogContainerComponent } from './dialog-container';
import { DialogRef } from './dialog-ref';
import { DIALOG_DATA } from './dialog-tokens';

export interface DialogConfig<T = unknown> {
    data?: T;
    hasBackdrop?: boolean;
    backdropClass?: string;
    panelClass?: string;
    disableClose?: boolean;
    width?: string;
    height?: string;
    position?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
}

@Injectable({ providedIn: 'root' })
export class DialogService {
    constructor(
        private readonly overlay: Overlay,
        private readonly injector: EnvironmentInjector
    ) {}

    open<TComponent, TResult = unknown>(
        content: Type<TComponent>,
        config: DialogConfig = {}
    ): DialogRef<TResult> {
        const overlayRef = this.createOverlay(config);
        const dialogRef = new DialogRef<TResult>(overlayRef);

        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: DialogRef, useValue: dialogRef },
                { provide: DIALOG_DATA, useValue: config.data },
            ],
        });

        const portal = new ComponentPortal(DialogContainerComponent, null, injector);
        const containerRef = overlayRef.attach(portal);
        containerRef.instance.childComponentType.set(content);

        if (!config.disableClose) {
            overlayRef.backdropClick().subscribe(() => dialogRef.close());
        }

        return dialogRef;
    }

    private createOverlay(config: DialogConfig): OverlayRef {
        const positionBuilder = this.overlay.position();
        const positionStrategy = positionBuilder.global();

        if (config.position) {
            if (config.position.top) positionStrategy.top(config.position.top);
            if (config.position.bottom) positionStrategy.bottom(config.position.bottom);
            if (config.position.left) positionStrategy.left(config.position.left);
            if (config.position.right) positionStrategy.right(config.position.right);
        }

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop ?? true,
            backdropClass: config.backdropClass ?? 'dialog-backdrop',
            panelClass: config.panelClass ?? 'dialog-panel',
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy,
            width: config.width,
            height: config.height,
        });

        return this.overlay.create(overlayConfig);
    }
}
