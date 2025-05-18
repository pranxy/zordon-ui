import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable, TemplateRef } from '@angular/core';

export interface ZdModalConfig {
    data?: any;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
    position?: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };
    backdropClass?: string;
    panelClass?: string | string[];
    hasBackdrop?: boolean;
    disableClose?: boolean;
}

const DEFAULT_CONFIG: ZdModalConfig = {
    width: '500px',
    hasBackdrop: true,
    backdropClass: 'bg-black/50',
    panelClass: ['modal', 'modal-box'],
    disableClose: false,
};

@Injectable({ providedIn: 'root' })
export class ZdModal {
    dialog = inject(Dialog);

    open<T = any, R = any>(
        content: ComponentType<T> | TemplateRef<T>,
        config?: ZdModalConfig
    ): DialogRef<R> {
        const finalConfig = { ...DEFAULT_CONFIG, ...config };

        const panelClass: string[] = [
            ...((Array.isArray(finalConfig.panelClass)
                ? finalConfig.panelClass // If it's an array, spread it
                : [finalConfig.panelClass]
            ) // If it's not an array, put it in an array
                .filter(className => className !== undefined) as string[]), // Filter out undefined and assert type
            'modal-open',
        ];

        return this.dialog.open<R>(content, { ...finalConfig, panelClass });
    }

    getDialogById<R, C>(id: string): DialogRef<R, C> | undefined {
        return this.dialog.getDialogById(id);
    }

    closeAll(): void {
        this.dialog.closeAll();
    }
}
