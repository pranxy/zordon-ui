import { OverlayRef } from '@angular/cdk/overlay';
import { Signal, signal } from '@angular/core';

export class DialogRef<T = unknown> {
    private readonly closed = signal<T | undefined>(undefined);
    readonly afterClosed: Signal<T | undefined> = this.closed.asReadonly();

    constructor(private readonly overlayRef: OverlayRef) {}

    close(result?: T) {
        this.overlayRef.dispose();
        this.closed.set(result);
    }
}
