import { Overlay, type OverlayRef, type ScrollStrategy } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { ZdBodyScrollLock } from './body-scroll-lock';

describe('ZdBodyScrollLock', () => {
  function setup() {
    const owner: ScrollStrategy = {
      attach: vi.fn(),
      disable: vi.fn(),
      enable: vi.fn(),
    };
    const block = vi.fn(() => owner);
    TestBed.configureTestingModule({
      providers: [
        ZdBodyScrollLock,
        { provide: Overlay, useValue: { scrollStrategies: { block } } },
      ],
    });
    return { block, manager: TestBed.inject(ZdBodyScrollLock), owner };
  }

  it('shares one underlying owner until the last lease releases in any order', () => {
    const { block, manager, owner } = setup();
    const first = manager.createLease();
    const second = manager.createLease();
    first.attach({} as OverlayRef);
    first.enable();
    first.enable();
    second.enable();
    expect(block).toHaveBeenCalledOnce();
    expect(owner.enable).toHaveBeenCalledOnce();

    first.disable();
    first.disable();
    expect(owner.disable).not.toHaveBeenCalled();
    second.disable();
    expect(owner.disable).toHaveBeenCalledOnce();

    const next = manager.createLease();
    next.enable();
    expect(block).toHaveBeenCalledTimes(2);
    next.disable();
  });

  it('disables the owner on application destruction and ignores late lease calls', () => {
    const { block, manager, owner } = setup();
    const lease = manager.createLease();
    lease.enable();
    TestBed.resetTestingModule();
    expect(owner.disable).toHaveBeenCalledOnce();
    lease.disable();
    lease.enable();
    expect(owner.disable).toHaveBeenCalledOnce();
    expect(block).toHaveBeenCalledOnce();
  });

  it('does not create an owner for a lease that never enables', () => {
    const { block, manager } = setup();
    const lease = manager.createLease();
    lease.disable();
    expect(block).not.toHaveBeenCalled();
  });
});
