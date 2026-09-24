import { computed, Directive, inject, input } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdSelectColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdSelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdSelectVariant = 'ghost';

@Directive({ selector: 'select[zdSelect]', host: { '[class]': 'hostClasses()' } })
export class ZdSelect {
  readonly color = input<ZdSelectColor | undefined>();
  /** Named zdSize because a select's native size attribute sets its visible rows. */
  readonly zdSize = input<ZdSelectSize | undefined>();
  readonly variant = input<ZdSelectVariant | undefined>();
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('select'),
      this.color() && this.classNames.daisyUi(`select-${this.color()}`),
      this.zdSize() && this.classNames.daisyUi(`select-${this.zdSize()}`),
      this.variant() && this.classNames.daisyUi(`select-${this.variant()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
