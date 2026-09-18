import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ZdIdGenerator } from '@pranxy/zordon-ui';
import { ZdButton } from '@pranxy/zordon-ui/button';

export type ZdFabArrangement = 'single' | 'vertical' | 'flower';
export type ZdFabCorner = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

/** The eagerly created, natively hidden disclosure content. */
@Directive({ selector: 'ng-template[zdFabActions]' })
export class ZdFabActions {
  readonly template = inject<TemplateRef<object>>(TemplateRef);
}

/** Mark native actions that request closing after an uncancelled activation. */
@Directive({
  selector: 'button[zdFabAction],a[href][zdFabAction]',
  host: { 'data-zd-fab-action': '', '[attr.data-zd-fab-keep-open]': 'keepOpen() ? "" : null' },
})
export class ZdFabAction {
  readonly keepOpen = input(false, { transform: booleanAttribute });
}

/** Native disclosure group with a persistent trigger and consumer-owned actions. */
@Component({
  selector: 'zd-fab',
  exportAs: 'zdFab',
  imports: [ZdButton, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './fab.css',
  host: {
    '[attr.data-arrangement]': 'arrangement()',
    '[attr.data-corner]': 'corner()',
    '[attr.data-inline]': 'inline() ? "" : null',
    '[style.--zd-fab-offset]': 'offset()',
    '(click)': 'activate($event)',
    '(keydown)': 'keydown($event)',
    '(focusout)': 'depart($event)',
  },
  template: `
    <button
      #trigger
      type="button"
      zdButton
      color="primary"
      layout="circle"
      class="zd-fab-trigger"
      [disabled]="disabled()"
      [attr.aria-label]="expanded() ? closeLabel() : label()"
      [attr.aria-expanded]="disclosure() ? expanded() : null"
      [attr.aria-controls]="disclosure() ? panelId : null"
      (click)="toggle()"
    >
      <ng-content select="[zdFabIcon]">{{ expanded() ? '×' : '+' }}</ng-content>
    </button>
    <div
      #panel
      class="zd-fab-actions"
      [id]="panelId"
      role="group"
      [attr.aria-label]="label()"
      [hidden]="!expanded()"
      [attr.inert]="expanded() ? null : ''"
    >
      <ng-container [ngTemplateOutlet]="actions()?.template ?? null" />
    </div>
  `,
})
export class ZdFab {
  readonly label = input.required<string>();
  readonly closeLabel = input('Close actions');
  readonly arrangement = input<ZdFabArrangement>('vertical');
  readonly corner = input<ZdFabCorner>('bottom-end');
  /** A CSS length, combined with physical safe-area insets. */
  readonly offset = input('1rem');
  readonly inline = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly open = input<boolean | undefined>();
  readonly openChange = output<boolean>();
  /** Native main action in single mode or when no action template is provided. */
  readonly mainAction = output<void>();
  protected readonly actions = contentChild(ZdFabActions);
  protected readonly disclosure = computed(
    () => this.arrangement() !== 'single' && !!this.actions(),
  );
  private readonly local = signal(false);
  readonly expanded = computed(
    () => this.disclosure() && !this.disabled() && (this.open() ?? this.local()),
  );
  readonly panelId = inject(ZdIdGenerator).next('fab-actions');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private restore = false;
  private readonly behavior = afterRenderEffect(onCleanup => {
    if (!this.expanded()) {
      if (this.restore || this.panel().nativeElement.contains(this.document.activeElement))
        this.trigger().nativeElement.focus();
      this.restore = false;
      return;
    }
    const outside = (event: PointerEvent) => {
      if (!event.composedPath().includes(this.host)) this.hide();
    };
    this.document.addEventListener('pointerdown', outside);
    onCleanup(() => this.document.removeEventListener('pointerdown', outside));
  });
  show(): void {
    this.request(true);
  }
  hide(): void {
    this.request(false);
  }
  toggle(): void {
    if (this.disabled()) return;
    if (this.disclosure()) this.request(!this.expanded());
    else this.mainAction.emit();
  }
  private request(next: boolean): void {
    if (next === this.expanded() || (next && (this.disabled() || !this.disclosure()))) return;
    this.restore = !next && this.panel().nativeElement.contains(this.document.activeElement);
    if (this.open() === undefined) this.local.set(next);
    this.openChange.emit(next);
  }
  protected activate(event: MouseEvent): void {
    const action = (event.target as Element).closest('[data-zd-fab-action]');
    if (
      !event.defaultPrevented &&
      action &&
      this.panel().nativeElement.contains(action) &&
      !action.hasAttribute('disabled') &&
      action.getAttribute('aria-disabled') !== 'true' &&
      !action.hasAttribute('data-zd-fab-keep-open')
    )
      this.hide();
  }
  protected keydown(event: KeyboardEvent): void {
    if (
      event.key === 'Escape' &&
      !event.defaultPrevented &&
      !event.isComposing &&
      this.expanded()
    ) {
      event.preventDefault();
      event.stopPropagation();
      this.hide();
    }
  }
  protected depart(event: FocusEvent): void {
    if (event.relatedTarget && !this.host.contains(event.relatedTarget as Node)) this.hide();
  }
}
