import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdTextInputColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdTextInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdTextInputVariant = 'ghost';

@Directive({ selector: 'input[zdTextInput]', host: { '[class]': 'hostClasses()' } })
export class ZdTextInput {
  readonly color = input<ZdTextInputColor | undefined>();
  /** Named zdSize because an input's native size attribute sets its width in characters. */
  readonly zdSize = input<ZdTextInputSize | undefined>();
  readonly variant = input<ZdTextInputVariant | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('input'),
      this.color() && this.classNames.daisyUi(`input-${this.color()}`),
      this.zdSize() && this.classNames.daisyUi(`input-${this.zdSize()}`),
      this.variant() && this.classNames.daisyUi(`input-${this.variant()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
