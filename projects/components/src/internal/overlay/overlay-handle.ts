import type { OverlayRef } from '@angular/cdk/overlay';
import type { Subscription } from 'rxjs';

import type {
  ZdOverlayCloseReason,
  ZdOverlayHandle,
  ZdOverlayLifecycle,
} from './overlay-contracts';
import type { ZdOverlayStack, ZdOverlayStackRegistration } from './overlay-stack';

export class ZdInternalOverlayHandle implements ZdOverlayHandle {
  private state: ZdOverlayLifecycle = 'opening';
  private readonly subscriptions: Subscription[] = [];
  private registration?: ZdOverlayStackRegistration;

  constructor(
    private readonly overlayRef: OverlayRef,
    private readonly stack: ZdOverlayStack,
    private readonly onCloseRequest: (reason: ZdOverlayCloseReason, event?: Event) => void,
  ) {}

  get lifecycle(): ZdOverlayLifecycle {
    return this.state;
  }

  bind(
    registration: ZdOverlayStackRegistration,
    createSubscriptions: () => readonly Subscription[],
  ): void {
    if (this.registration || this.state !== 'opening') {
      throw new Error('Zordon UI overlay handle can only be bound once while opening.');
    }
    this.registration = registration;
    this.subscriptions.push(...createSubscriptions());
    this.state = 'open';
    this.stack.markOpen(registration);
  }

  requestClose(reason: ZdOverlayCloseReason, event?: Event): boolean {
    const registration = this.registration;
    if (!registration || !this.stack.markClosing(registration)) return false;
    this.state = 'closing';
    this.onCloseRequest(reason, event);
    return true;
  }

  finalizeClose(): void {
    if (this.state === 'closed') return;
    this.disposeOwnedResources();
  }

  destroy(): void {
    if (this.state === 'closed') return;
    if (this.state !== 'closing') this.requestClose('destroy');
    this.disposeOwnedResources();
  }

  updateTheme(theme: string | null): void {
    if (theme === null || theme === '') {
      this.overlayRef.overlayElement.removeAttribute('data-theme');
    } else {
      this.overlayRef.overlayElement.setAttribute('data-theme', theme);
    }
  }

  private disposeOwnedResources(): void {
    if (this.registration) {
      this.stack.unregister(this.registration);
      this.registration = undefined;
    }
    for (const subscription of this.subscriptions.splice(0)) subscription.unsubscribe();
    this.overlayRef.dispose();
    this.state = 'closed';
  }
}
