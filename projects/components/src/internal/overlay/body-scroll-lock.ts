import { Overlay, type ScrollStrategy } from '@angular/cdk/overlay';
import { DestroyRef, inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ZdBodyScrollLock {
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);
  private owner?: ScrollStrategy;
  private leases = 0;
  private destroyed = false;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.leases = 0;
      this.owner?.disable();
      this.owner = undefined;
    });
  }

  createLease(): ScrollStrategy {
    let enabled = false;
    return {
      attach(): void {},
      disable: (): void => {
        if (!enabled) return;
        enabled = false;
        if (this.destroyed || this.leases === 0) return;
        this.leases--;
        if (this.leases === 0) {
          this.owner?.disable();
          this.owner = undefined;
        }
      },
      enable: (): void => {
        if (enabled || this.destroyed) return;
        enabled = true;
        if (this.leases++ === 0) {
          this.owner = this.overlay.scrollStrategies.block();
          this.owner.enable();
        }
      },
    };
  }
}
