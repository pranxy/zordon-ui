import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  booleanAttribute,
  computed,
  input,
  viewChild,
  inject,
} from '@angular/core';
import { RouterLink, type Params, type UrlTree } from '@angular/router';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdBreadcrumbOverflow = 'collapse' | 'scroll';
export interface ZdBreadcrumbIconContext {
  readonly $implicit: ZdBreadcrumbItem;
}
export interface ZdBreadcrumbItem {
  readonly id: string;
  readonly label: string;
  readonly shortLabel?: string;
  readonly href?: string;
  readonly routerLink?: string | unknown[] | UrlTree;
  readonly queryParams?: Params;
  readonly fragment?: string;
  readonly icon?: TemplateRef<ZdBreadcrumbIconContext>;
  /** Absolute HTTP(S) canonical URL for opt-in structured data. */
  readonly canonicalUrl?: string;
}

@Component({
  selector: 'zd-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink],
  host: { '(document:click)': 'outside($event)', '(keydown.escape)': 'escape($event)' },
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    nav {
      max-width: 100%;
      padding-block: 0.5rem;
    }
    nav[data-overflow='collapse'] {
      overflow: visible;
    }
    nav[data-overflow='scroll'] {
      overflow-x: auto;
    }
    ol,
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .zd-trail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .zd-trail > li {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 0.5rem;
    }
    .zd-trail > li::before {
      display: none !important;
    }
    .zd-trail > li:last-child {
      min-width: 3rem;
    }
    a,
    .zd-current,
    .zd-label {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      min-width: 0;
    }
    a {
      color: inherit;
      text-decoration: underline;
      min-height: 2.75rem;
    }
    .zd-current {
      min-height: 2.75rem;
      cursor: default;
      text-decoration: none;
    }
    .zd-label > .zd-full,
    .zd-short {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .zd-short {
      display: none;
    }
    .zd-icon {
      display: inline-flex;
      flex: none;
    }
    .zd-separator {
      flex: none;
      pointer-events: none;
    }
    details {
      position: relative;
      text-decoration: none;
    }
    summary {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 2.75rem;
      min-height: 2.75rem;
      cursor: pointer;
      border: 1px solid currentColor;
      border-radius: 0.35rem;
    }
    summary::-webkit-details-marker {
      display: none;
    }
    .zd-overflow {
      position: absolute;
      z-index: 20;
      inset-block-start: 100%;
      inset-inline-start: 0;
      width: max-content;
      max-width: min(20rem, 60vw);
      max-height: 16rem;
      overflow: auto;
      padding: 0.5rem;
      border: 1px solid currentColor;
      border-radius: 0.35rem;
      color: var(--color-base-content, CanvasText);
      background: var(--color-base-100, Canvas);
      box-shadow: 0 0.3rem 1rem #0002;
    }
    .zd-overflow li {
      display: block;
    }
    .zd-overflow a,
    .zd-overflow .zd-current {
      display: flex;
      padding-inline: 0.5rem;
    }
    .zd-overflow .zd-full {
      white-space: normal;
      overflow-wrap: anywhere;
    }
    a:focus-visible,
    summary:focus-visible,
    nav:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    .zd-sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
    nav[data-overflow='scroll'] .zd-trail > li {
      flex: none;
    }
    @media (max-width: 40rem) {
      .zd-label[data-short='true'] > .zd-full {
        display: none;
      }
      .zd-label[data-short='true'] > .zd-short {
        display: inline;
      }
      .zd-overflow .zd-label > .zd-full {
        display: inline;
      }
      .zd-overflow .zd-label > .zd-short {
        display: none;
      }
    }
    @media (prefers-reduced-motion: reduce), (forced-colors: active) {
      *,
      *::before {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    }
  `,
  template: `
    <nav
      [class]="classes"
      [attr.aria-label]="label()"
      [attr.data-overflow]="overflow()"
      [attr.tabindex]="overflow() === 'scroll' ? 0 : null"
    >
      <ol class="zd-trail">
        @for (entry of visible(); track entry ? 'crumb:' + entry.item.id : 'overflow') {
          <li>
            @if (!$first) {
              <span class="zd-separator" aria-hidden="true">{{ separator() }}</span>
            }
            @if (entry) {
              <ng-container
                [ngTemplateOutlet]="crumb"
                [ngTemplateOutletContext]="{
                  $implicit: entry.item,
                  current: entry.index === checked().length - 1,
                }"
              />
            } @else {
              <details #disclosure>
                <summary #summary [attr.aria-label]="overflowLabel()">
                  <span aria-hidden="true">…</span>
                </summary>
                <ul class="zd-overflow">
                  @for (entry of hidden(); track entry.item.id) {
                    <li>
                      <ng-container
                        [ngTemplateOutlet]="crumb"
                        [ngTemplateOutletContext]="{ $implicit: entry.item, current: false }"
                      />
                    </li>
                  }
                </ul>
              </details>
            }
          </li>
        }
      </ol>
    </nav>
    <ng-template #crumb let-item let-current="current">
      @if ((!current || linkCurrent()) && item.routerLink !== undefined) {
        <a
          [routerLink]="item.routerLink"
          [queryParams]="item.queryParams"
          [fragment]="item.fragment"
          [attr.aria-current]="current ? 'page' : null"
          (click)="close()"
          ><ng-container
            [ngTemplateOutlet]="caption"
            [ngTemplateOutletContext]="{ $implicit: item }"
        /></a>
      } @else if ((!current || linkCurrent()) && item.href !== undefined) {
        <a [href]="item.href" [attr.aria-current]="current ? 'page' : null" (click)="close()"
          ><ng-container
            [ngTemplateOutlet]="caption"
            [ngTemplateOutletContext]="{ $implicit: item }"
        /></a>
      } @else {
        <span class="zd-current" [attr.aria-current]="current ? 'page' : null"
          ><ng-container
            [ngTemplateOutlet]="caption"
            [ngTemplateOutletContext]="{ $implicit: item }"
        /></span>
      }
    </ng-template>
    <ng-template #caption let-item>
      @if (item.icon) {
        <span class="zd-icon" aria-hidden="true"
          ><ng-container
            [ngTemplateOutlet]="item.icon"
            [ngTemplateOutletContext]="{ $implicit: item }"
        /></span>
      }
      <span class="zd-label" [attr.data-short]="!!item.shortLabel"
        ><span class="zd-sr">{{ item.label }}</span
        ><span class="zd-full" aria-hidden="true">{{ item.label }}</span>
        @if (item.shortLabel) {
          <span class="zd-short" aria-hidden="true">{{ item.shortLabel }}</span>
        }
      </span>
    </ng-template>
    @if (structuredData()) {
      <div hidden itemscope itemtype="https://schema.org/BreadcrumbList">
        @for (item of structured(); track item.id) {
          <div itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
            <meta itemprop="position" [attr.content]="$index + 1" /><meta
              itemprop="name"
              [attr.content]="item.label"
            />
            @if (item.canonicalUrl) {
              <a itemprop="item" [href]="item.canonicalUrl">{{ item.label }}</a>
            }
          </div>
        }
      </div>
    }
  `,
})
export class ZdBreadcrumbs {
  readonly items = input<readonly ZdBreadcrumbItem[]>([]);
  readonly label = input('Breadcrumb');
  readonly overflowLabel = input('Show hidden breadcrumbs');
  readonly separator = input('›');
  readonly overflow = input<ZdBreadcrumbOverflow>('collapse');
  readonly maxItems = input(4, {
    transform: (value: number) => {
      if (!Number.isInteger(value) || value < 3)
        throw new RangeError('Breadcrumb maxItems must be an integer of at least 3.');
      return value;
    },
  });
  readonly linkCurrent = input(false, { transform: booleanAttribute });
  readonly structuredData = input(false, { transform: booleanAttribute });
  protected readonly classes = inject(ZdClassNames).daisyUi('breadcrumbs');
  private readonly disclosure = viewChild<ElementRef<HTMLDetailsElement>>('disclosure');
  private readonly summary = viewChild<ElementRef<HTMLElement>>('summary');
  protected readonly checked = computed(() => {
    const items = this.items();
    const ids = new Set<string>();
    for (const item of items) {
      if (
        !item.id.trim() ||
        !item.label.trim() ||
        ids.has(item.id) ||
        (item.href !== undefined && item.routerLink !== undefined)
      )
        throw new RangeError(
          'Breadcrumbs require unique nonempty IDs, labels and at most one link destination.',
        );
      ids.add(item.id);
    }
    return items;
  });
  private readonly entries = computed(() => this.checked().map((item, index) => ({ item, index })));
  protected readonly hidden = computed(() =>
    this.overflow() === 'collapse' && this.entries().length > this.maxItems()
      ? this.entries().slice(1, this.entries().length - this.maxItems() + 2)
      : [],
  );
  protected readonly visible = computed(() =>
    this.hidden().length
      ? [this.entries()[0], null, ...this.entries().slice(this.hidden().length + 1)]
      : this.entries(),
  );
  protected readonly structured = computed(() => {
    const items = this.checked();
    for (const [index, item] of items.entries()) {
      if (!item.canonicalUrl) {
        if (index < items.length - 1)
          throw new RangeError('Structured ancestor breadcrumbs require canonicalUrl.');
      } else {
        const url = new URL(item.canonicalUrl);
        if (url.protocol !== 'https:' && url.protocol !== 'http:')
          throw new RangeError('Breadcrumb canonicalUrl must use HTTP(S).');
      }
    }
    return items;
  });
  protected close(): void {
    const details = this.disclosure()?.nativeElement;
    if (details) {
      const restore = details.contains(details.ownerDocument.activeElement);
      details.open = false;
      if (restore) this.summary()!.nativeElement.focus();
    }
  }
  protected escape(event: Event): void {
    if (this.disclosure()?.nativeElement.open) {
      event.preventDefault();
      event.stopPropagation();
      this.close();
      this.summary()!.nativeElement.focus();
    }
  }
  protected outside(event: Event): void {
    const details = this.disclosure()?.nativeElement;
    if (details?.open && !details.contains(event.target as Node)) this.close();
  }
}
