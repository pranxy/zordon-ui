import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdRatingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({ selector: '[zdRating]', host: { '[class]': 'hostClasses()' } })
export class ZdRating {
  readonly size = input<ZdRatingSize | undefined>();
  readonly half = input(false, { transform: booleanAttribute });
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('rating'),
      this.size() && this.classNames.daisyUi(`rating-${this.size()}`),
      this.half() && this.classNames.daisyUi('rating-half'),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

@Directive({
  selector: 'input[type="radio"][zdRatingHidden]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdRatingHidden {
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() => this.classNames.daisyUi('rating-hidden'));
}
