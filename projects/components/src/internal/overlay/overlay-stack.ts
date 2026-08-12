import { Injectable } from '@angular/core';

import type { ZdOverlayCloseReason, ZdOverlayLifecycle } from './overlay-contracts';

interface ZdOverlayStackEntryConfig {
  readonly pane: HTMLElement;
  readonly backdrop: () => HTMLElement | null;
  readonly parent?: ZdOverlayStackRegistration;
  readonly boundaries?: readonly HTMLElement[];
  readonly requestClose: (reason: ZdOverlayCloseReason, event?: Event) => void;
}

interface ZdEventClaim {
  readonly owner: ZdOverlayStackRegistration;
  readonly channel: 'escape' | 'outside-pointer' | 'backdrop';
  delivered: boolean;
}

export class ZdOverlayStackRegistration {
  lifecycle: ZdOverlayLifecycle = 'opening';
  readonly boundaries = new Set<HTMLElement>();

  constructor(
    readonly pane: HTMLElement,
    readonly backdrop: () => HTMLElement | null,
    readonly parent: ZdOverlayStackRegistration | undefined,
    readonly requestClose: (reason: ZdOverlayCloseReason, event?: Event) => void,
    boundaries: readonly HTMLElement[],
  ) {
    for (const boundary of boundaries) this.boundaries.add(boundary);
  }
}

@Injectable({ providedIn: 'root' })
export class ZdOverlayStack {
  private readonly entries: ZdOverlayStackRegistration[] = [];
  private readonly claims = new WeakMap<Event, ZdEventClaim>();

  register(config: ZdOverlayStackEntryConfig): ZdOverlayStackRegistration {
    const registration = new ZdOverlayStackRegistration(
      config.pane,
      config.backdrop,
      config.parent,
      config.requestClose,
      config.boundaries ?? [],
    );
    this.entries.push(registration);
    return registration;
  }

  markOpen(registration: ZdOverlayStackRegistration): void {
    if (registration.lifecycle === 'opening') registration.lifecycle = 'open';
  }

  markClosing(registration: ZdOverlayStackRegistration): boolean {
    if (registration.lifecycle === 'closing' || registration.lifecycle === 'closed') return false;
    registration.lifecycle = 'closing';
    return true;
  }

  unregister(registration: ZdOverlayStackRegistration): void {
    if (this.entries.some(entry => entry.parent === registration)) {
      throw new Error('Zordon UI child overlays must close before their parent can be finalized.');
    }
    const index = this.entries.indexOf(registration);
    if (index !== -1) this.entries.splice(index, 1);
    registration.boundaries.clear();
    registration.lifecycle = 'closed';
  }

  handleEscape(registration: ZdOverlayStackRegistration, event: KeyboardEvent): boolean {
    if (!this.isPlainEscape(event) || this.top() !== registration) return false;
    if (!this.claim(event, registration, 'escape')) return false;
    event.preventDefault();
    registration.requestClose('escape', event);
    return true;
  }

  handleOutside(registration: ZdOverlayStackRegistration, event: MouseEvent): boolean {
    const owner = this.top();
    if (!owner || owner !== registration) return false;
    const path = event.composedPath();
    const backdrop = owner.backdrop();
    if (backdrop && path.includes(backdrop)) {
      this.claim(event, owner, 'backdrop', false);
      return false;
    }
    if (this.isInside(owner, path)) return false;
    if (!this.claim(event, owner, 'outside-pointer')) return false;
    owner.requestClose('outside-pointer', event);
    return true;
  }

  handleBackdrop(registration: ZdOverlayStackRegistration, event: MouseEvent): boolean {
    if (this.top() !== registration) return false;
    const existing = this.claims.get(event);
    if (existing && (existing.owner !== registration || existing.channel !== 'backdrop'))
      return false;
    if (existing?.delivered) return false;
    if (existing) {
      existing.delivered = true;
    } else {
      this.claims.set(event, { channel: 'backdrop', delivered: true, owner: registration });
    }
    registration.requestClose('backdrop', event);
    return true;
  }

  size(): number {
    return this.entries.length;
  }

  private top(): ZdOverlayStackRegistration | undefined {
    return this.entries.at(-1);
  }

  private claim(
    event: Event,
    owner: ZdOverlayStackRegistration,
    channel: ZdEventClaim['channel'],
    delivered = true,
  ): boolean {
    if (this.claims.has(event)) return false;
    this.claims.set(event, { channel, delivered, owner });
    return true;
  }

  private isInside(owner: ZdOverlayStackRegistration, path: readonly EventTarget[]): boolean {
    if (path.includes(owner.pane)) return true;
    for (const boundary of owner.boundaries) {
      if (path.includes(boundary)) return true;
    }
    return false;
  }

  private isPlainEscape(event: KeyboardEvent): boolean {
    return (
      event.key === 'Escape' &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.defaultPrevented &&
      !event.isComposing &&
      !event.repeat
    );
  }
}
