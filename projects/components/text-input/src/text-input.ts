import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdTextInputColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdTextInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdTextInputStyle = 'ghost';

@Directive({ selector: 'input[zdTextInput]', host: { '[class]': 'hostClasses()' } })
export class ZdTextInput {
  readonly color = input<ZdTextInputColor | undefined>();
  readonly size = input<ZdTextInputSize | undefined>();
  readonly style = input<ZdTextInputStyle | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('input'),
      this.color() && this.classNames.daisyUi(`input-${this.color()}`),
      this.size() && this.classNames.daisyUi(`input-${this.size()}`),
      this.style() && this.classNames.daisyUi(`input-${this.style()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
