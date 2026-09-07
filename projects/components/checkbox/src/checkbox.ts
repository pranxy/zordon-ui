import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdCheckboxColor =
  | 'neutral'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';
export type ZdCheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({
  selector: 'input[type="checkbox"][zdCheckbox]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdCheckbox {
  readonly color = input<ZdCheckboxColor | undefined>();
  readonly size = input<ZdCheckboxSize | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('checkbox'),
      this.color() && this.classNames.daisyUi(`checkbox-${this.color()}`),
      this.size() && this.classNames.daisyUi(`checkbox-${this.size()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
