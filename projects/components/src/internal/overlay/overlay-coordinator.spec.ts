import { Overlay, OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ZdOverlayCoordinator } from './overlay-coordinator';
import type { ZdOverlayOpenConfig } from './overlay-contracts';
import { ZdOverlayStack } from './overlay-stack';

@Component({ template: `<span data-testid="component-portal">Component portal</span>` })
class TestPortalComponent implements OnDestroy {
  static destroyed = 0;
  ngOnDestroy(): void {
    TestPortalComponent.destroyed++;
  }
}

@Component({
  template: `
    <section data-theme="forest">
      <button #origin type="button">Origin</button>
    </section>
    <ng-template #content let-label="label">
      <span data-testid="template-portal">{{ label }}</span>
    </ng-template>
  `,
})
class TestPortalHost {
  @ViewChild('content', { static: true }) content!: TemplateRef<{ label: string }>;
  @ViewChild('origin', { static: true }) origin!: { nativeElement: HTMLButtonElement };
  readonly viewContainerRef = inject(ViewContainerRef);
}

function globalConfig(
  content: ZdOverlayOpenConfig<unknown, { label: string }>['content'],
  overrides: Partial<ZdOverlayOpenConfig<unknown, { label: string }>> = {},
): ZdOverlayOpenConfig<unknown, { label: string }> {
  return {
    content,
    onCloseRequest: vi.fn(),
    placement: { kind: 'global' },
    ...overrides,
  };
}

describe('ZdOverlayCoordinator', () => {
  beforeEach(() => {
    TestPortalComponent.destroyed = 0;
    TestBed.configureTestingModule({
      imports: [OverlayModule, TestPortalHost, TestPortalComponent],
    });
  });

  afterEach(() => TestBed.inject(OverlayContainer).ngOnDestroy());

  it('attaches a template portal, forwards the composed theme, and cleans up after two-phase close', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const closeRequest = vi.fn();
    const coordinator = TestBed.inject(ZdOverlayCoordinator);
    const stack = TestBed.inject(ZdOverlayStack);

    const handle = coordinator.open(
      globalConfig(
        {
          context: { label: 'Projected value' },
          kind: 'template',
          template: host.content,
          viewContainerRef: host.viewContainerRef,
        },
        {
          backdropClass: ['test-backdrop'],
          hasBackdrop: true,
          onCloseRequest: closeRequest,
          origin: host.origin.nativeElement,
          panelClass: 'test-panel',
          safeElements: [host.origin.nativeElement],
        },
      ),
    )!;

    expect(document.querySelector('[data-testid="template-portal"]')?.textContent).toContain(
      'Projected value',
    );
    expect(document.querySelector('.cdk-overlay-pane')?.getAttribute('data-theme')).toBe('forest');
    expect(document.querySelector('.cdk-overlay-pane')?.classList.contains('test-panel')).toBe(
      true,
    );
    expect(
      document.querySelector('.cdk-overlay-backdrop')?.classList.contains('test-backdrop'),
    ).toBe(true);
    expect(stack.size()).toBe(1);
    expect(handle.requestClose('selection')).toBe(true);
    expect(closeRequest).toHaveBeenCalledWith('selection', undefined);
    expect(document.querySelector('[data-testid="template-portal"]')).not.toBeNull();
    handle.finalizeClose();
    expect(document.querySelector('[data-testid="template-portal"]')).toBeNull();
    expect(stack.size()).toBe(0);
  });

  it('attaches and destroys a component portal and permits an explicit empty theme', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const handle = TestBed.inject(ZdOverlayCoordinator).open(
      globalConfig(
        {
          component: TestPortalComponent,
          kind: 'component',
          viewContainerRef: host.viewContainerRef,
        },
        { origin: host.origin.nativeElement, theme: null },
      ),
    )!;
    expect(document.querySelector('[data-testid="component-portal"]')).not.toBeNull();
    expect(document.querySelector('.cdk-overlay-pane')?.hasAttribute('data-theme')).toBe(false);
    handle.destroy();
    expect(TestPortalComponent.destroyed).toBe(1);
  });

  it('uses the connected placement origin for theme and outside-boundary ownership', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const closeRequest = vi.fn();
    const origin = host.origin.nativeElement;
    for (const placementOrigin of [origin, new ElementRef(origin)]) {
      const handle = TestBed.inject(ZdOverlayCoordinator).open(
        globalConfig(
          {
            component: TestPortalComponent,
            kind: 'component',
            viewContainerRef: host.viewContainerRef,
          },
          {
            onCloseRequest: closeRequest,
            placement: {
              kind: 'connected',
              origin: placementOrigin,
              positions: [
                {
                  originX: 'start',
                  originY: 'bottom',
                  overlayX: 'start',
                  overlayY: 'top',
                },
              ],
            },
          },
        ),
      )!;

      expect(document.querySelector('.cdk-overlay-pane')?.getAttribute('data-theme')).toBe(
        'forest',
      );
      const descendant = document.createElement('span');
      descendant.addEventListener('pointerdown', event => event.stopPropagation());
      origin.appendChild(descendant);
      descendant.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(closeRequest).not.toHaveBeenCalled();
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      origin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      origin.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      origin.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true }));
      origin.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      document
        .querySelector('.cdk-overlay-pane')!
        .dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(closeRequest).not.toHaveBeenCalled();
      handle.finalizeClose();
    }
  });

  it('routes CDK Escape, outside, and backdrop streams through one close reason', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const coordinator = TestBed.inject(ZdOverlayCoordinator);

    const escapeRequest = vi.fn();
    const escapeHandle = coordinator.open(
      globalConfig(
        {
          component: TestPortalComponent,
          kind: 'component',
          viewContainerRef: host.viewContainerRef,
        },
        { onCloseRequest: escapeRequest },
      ),
    )!;
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }),
    );
    expect(escapeRequest).toHaveBeenCalledWith('escape', expect.any(KeyboardEvent));
    escapeHandle.finalizeClose();

    const outsideRequest = vi.fn();
    const outsideHandle = coordinator.open(
      globalConfig(
        {
          component: TestPortalComponent,
          kind: 'component',
          viewContainerRef: host.viewContainerRef,
        },
        { onCloseRequest: outsideRequest },
      ),
    )!;
    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(outsideRequest).toHaveBeenCalledWith('outside-pointer', expect.any(MouseEvent));
    outsideHandle.finalizeClose();

    const backdropRequest = vi.fn();
    const backdropHandle = coordinator.open(
      globalConfig(
        {
          component: TestPortalComponent,
          kind: 'component',
          viewContainerRef: host.viewContainerRef,
        },
        { hasBackdrop: true, onCloseRequest: backdropRequest },
      ),
    )!;
    (document.querySelector('.cdk-overlay-backdrop') as HTMLElement).click();
    expect(backdropRequest).toHaveBeenCalledTimes(1);
    expect(backdropRequest).toHaveBeenCalledWith('backdrop', expect.any(MouseEvent));
    backdropHandle.finalizeClose();
  });

  it('links a registered child to its parent and requires child-first finalization', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const coordinator = TestBed.inject(ZdOverlayCoordinator);
    const content = {
      component: TestPortalComponent,
      kind: 'component' as const,
      viewContainerRef: host.viewContainerRef,
    };
    const parent = coordinator.open(globalConfig(content))!;
    const child = coordinator.open(globalConfig(content, { parent }))!;
    expect(() => parent.finalizeClose()).toThrowError(/child overlays/);
    child.finalizeClose();
    parent.finalizeClose();
    expect(TestBed.inject(ZdOverlayStack).size()).toBe(0);
  });

  it('resolves a theme through an open ShadowRoot host boundary', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const themeHost = document.createElement('div');
    themeHost.setAttribute('data-theme', 'shadow-theme');
    const shadowRoot = themeHost.attachShadow({ mode: 'open' });
    const origin = document.createElement('button');
    shadowRoot.appendChild(origin);
    document.body.appendChild(themeHost);
    const handle = TestBed.inject(ZdOverlayCoordinator).open(
      globalConfig(
        {
          component: TestPortalComponent,
          kind: 'component',
          viewContainerRef: fixture.componentInstance.viewContainerRef,
        },
        { origin },
      ),
    )!;
    expect(document.querySelector('.cdk-overlay-pane')?.getAttribute('data-theme')).toBe(
      'shadow-theme',
    );
    handle.finalizeClose();
    themeHost.remove();
  });

  it('removes theme state when no explicit or inherited theme exists', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const origin = document.createElement('button');
    document.body.appendChild(origin);
    const handle = TestBed.inject(ZdOverlayCoordinator).open(
      globalConfig(
        {
          component: TestPortalComponent,
          kind: 'component',
          viewContainerRef: fixture.componentInstance.viewContainerRef,
        },
        { origin },
      ),
    )!;
    expect(document.querySelector('.cdk-overlay-pane')?.hasAttribute('data-theme')).toBe(false);
    handle.finalizeClose();
    origin.remove();
  });

  it('unwinds an OverlayRef when portal attachment throws', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const overlay = TestBed.inject(Overlay);
    const originalCreate = overlay.create.bind(overlay);
    let dispose: ReturnType<typeof vi.fn> | undefined;
    vi.spyOn(overlay, 'create').mockImplementation(config => {
      const ref = originalCreate(config);
      dispose = vi.spyOn(ref, 'dispose');
      vi.spyOn(ref, 'attach').mockImplementation(() => {
        throw new Error('attach failed');
      });
      return ref;
    });

    expect(() =>
      TestBed.inject(ZdOverlayCoordinator).open(
        globalConfig({
          context: { label: 'Failure' },
          kind: 'template',
          template: fixture.componentInstance.content,
          viewContainerRef: fixture.componentInstance.viewContainerRef,
        }),
      ),
    ).toThrowError('attach failed');
    expect(dispose).toHaveBeenCalledOnce();
  });

  it('refuses an unknown parent handle and unwinds the child ref', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const coordinator = TestBed.inject(ZdOverlayCoordinator);
    const fakeParent = {
      destroy: vi.fn(),
      finalizeClose: vi.fn(),
      lifecycle: 'open' as const,
      requestClose: vi.fn(),
      updateTheme: vi.fn(),
    };
    expect(() =>
      coordinator.open(
        globalConfig(
          {
            component: TestPortalComponent,
            kind: 'component',
            viewContainerRef: fixture.componentInstance.viewContainerRef,
          },
          { parent: fakeParent },
        ),
      ),
    ).toThrowError(/parent is not open and registered/);
    expect(TestBed.inject(ZdOverlayStack).size()).toBe(0);
  });

  it('refuses a finalized parent handle', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const coordinator = TestBed.inject(ZdOverlayCoordinator);
    const content = {
      component: TestPortalComponent,
      kind: 'component' as const,
      viewContainerRef: fixture.componentInstance.viewContainerRef,
    };
    const parent = coordinator.open(globalConfig(content))!;
    parent.finalizeClose();
    expect(() => coordinator.open(globalConfig(content, { parent }))).toThrowError(
      /parent is not open and registered/,
    );
    expect(TestBed.inject(ZdOverlayStack).size()).toBe(0);
  });

  it('refuses a child after its parent starts closing and unwinds the child ref', () => {
    const fixture = TestBed.createComponent(TestPortalHost);
    fixture.detectChanges();
    const coordinator = TestBed.inject(ZdOverlayCoordinator);
    const overlay = TestBed.inject(Overlay);
    const content = {
      component: TestPortalComponent,
      kind: 'component' as const,
      viewContainerRef: fixture.componentInstance.viewContainerRef,
    };
    const parent = coordinator.open(globalConfig(content))!;
    parent.requestClose('programmatic');

    const originalCreate = overlay.create.bind(overlay);
    let childDispose: ReturnType<typeof vi.fn> | undefined;
    vi.spyOn(overlay, 'create').mockImplementation(config => {
      const ref = originalCreate(config);
      childDispose = vi.spyOn(ref, 'dispose');
      return ref;
    });

    expect(() => coordinator.open(globalConfig(content, { parent }))).toThrowError(
      /parent is not open and registered/,
    );
    expect(childDispose).toHaveBeenCalledOnce();
    expect(TestBed.inject(ZdOverlayStack).size()).toBe(1);
    parent.finalizeClose();
    expect(TestBed.inject(ZdOverlayStack).size()).toBe(0);
  });
});

describe('ZdOverlayCoordinator on the server', () => {
  it('returns null before creating any CDK overlay DOM', () => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const overlay = TestBed.inject(Overlay);
    const create = vi.spyOn(overlay, 'create');
    const block = vi.spyOn(overlay.scrollStrategies, 'block');
    const config = {
      content: { component: TestPortalComponent, kind: 'component' as const },
      onCloseRequest: vi.fn(),
      placement: { kind: 'global' as const },
      scrollPolicy: 'block' as const,
    };
    expect(TestBed.inject(ZdOverlayCoordinator).open(config)).toBeNull();
    expect(create).not.toHaveBeenCalled();
    expect(block).not.toHaveBeenCalled();
    expect(document.querySelector('.cdk-overlay-container')).toBeNull();
  });
});
