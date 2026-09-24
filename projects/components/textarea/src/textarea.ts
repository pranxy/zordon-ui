import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdTextareaColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdTextareaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdTextareaVariant = 'ghost';

@Directive({ selector: 'textarea[zdTextarea]', host: { '[class]': 'hostClasses()' } })
export class ZdTextarea {
  readonly color = input<ZdTextareaColor | undefined>();
  readonly size = input<ZdTextareaSize | undefined>();
  readonly variant = input<ZdTextareaVariant | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('textarea'),
      this.color() && this.classNames.daisyUi(`textarea-${this.color()}`),
      this.size() && this.classNames.daisyUi(`textarea-${this.size()}`),
      this.variant() && this.classNames.daisyUi(`textarea-${this.variant()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
