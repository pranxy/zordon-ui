import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdSelectColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdSelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({ selector: 'select[zdSelect]', host: { '[class]': 'hostClasses()' } })
export class ZdSelect {
  readonly color = input<ZdSelectColor | undefined>();
  readonly size = input<ZdSelectSize | undefined>();
  readonly ghost = input(false, { transform: booleanAttribute });
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('select'),
      this.color() && this.classNames.daisyUi(`select-${this.color()}`),
      this.size() && this.classNames.daisyUi(`select-${this.size()}`),
      this.ghost() && this.classNames.daisyUi('select-ghost'),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
