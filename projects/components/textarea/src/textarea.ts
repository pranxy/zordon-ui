import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdTextareaColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdTextareaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdTextareaStyle = 'ghost';

@Directive({ selector: 'textarea[zdTextarea]', host: { '[class]': 'hostClasses()' } })
export class ZdTextarea {
  readonly color = input<ZdTextareaColor | undefined>();
  readonly size = input<ZdTextareaSize | undefined>();
  readonly style = input<ZdTextareaStyle | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('textarea'),
      this.color() && this.classNames.daisyUi(`textarea-${this.color()}`),
      this.size() && this.classNames.daisyUi(`textarea-${this.size()}`),
      this.style() && this.classNames.daisyUi(`textarea-${this.style()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
