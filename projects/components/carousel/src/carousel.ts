import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdCarouselAlign = 'start' | 'center' | 'end';
export type ZdCarouselOrientation = 'horizontal' | 'vertical';

@Directive({
  selector: '[zdCarousel]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdCarousel {
  readonly orientation = input<
    ZdCarouselOrientation | undefined,
    ZdCarouselOrientation | undefined
  >(undefined, { transform: resolveCarouselOrientation });
  readonly align = input<ZdCarouselAlign | undefined, ZdCarouselAlign | undefined>(undefined, {
    transform: resolveCarouselAlign,
  });

  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('carousel'),
      this.orientation() === undefined
        ? undefined
        : this.classNames.daisyUi(`carousel-${this.orientation()}`),
      this.align() === undefined ? undefined : this.classNames.daisyUi(`carousel-${this.align()}`),
    ]
      .filter((token): token is string => typeof token === 'string')
      .join(' '),
  );
}

@Directive({ selector: '[zdCarouselItem]', host: { '[class]': 'hostClass' } })
export class ZdCarouselItem {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('carousel-item');
}

export function resolveCarouselOrientation(value: unknown): ZdCarouselOrientation | undefined {
  if (value === undefined || value === 'horizontal' || value === 'vertical') return value;
  throw new RangeError(
    `Zordon UI Carousel orientation must be horizontal, vertical, or undefined; received ${String(value)}.`,
  );
}

export function resolveCarouselAlign(value: unknown): ZdCarouselAlign | undefined {
  if (value === undefined || value === 'start' || value === 'center' || value === 'end')
    return value;
  throw new RangeError(
    `Zordon UI Carousel align must be start, center, end, or undefined; received ${String(value)}.`,
  );
}
