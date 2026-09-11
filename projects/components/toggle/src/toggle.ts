import { computed, Directive, inject, input } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';
export type ZdToggleColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdToggleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
@Directive({ selector: 'input[type="checkbox"][zdToggle]', host: { '[class]': 'hostClasses()' } })
export class ZdToggle {
  readonly color = input<ZdToggleColor | undefined>();
  readonly size = input<ZdToggleSize | undefined>();
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('toggle'),
      this.color() && this.classNames.daisyUi(`toggle-${this.color()}`),
      this.size() && this.classNames.daisyUi(`toggle-${this.size()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
