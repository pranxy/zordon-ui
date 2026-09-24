import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdFileInputColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdFileInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdFileInputVariant = 'ghost';

@Directive({
  selector: 'input[type="file"][zdFileInput]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdFileInput {
  readonly color = input<ZdFileInputColor | undefined>();
  readonly size = input<ZdFileInputSize | undefined>();
  readonly variant = input<ZdFileInputVariant | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('file-input'),
      this.color() && this.classNames.daisyUi(`file-input-${this.color()}`),
      this.size() && this.classNames.daisyUi(`file-input-${this.size()}`),
      this.variant() && this.classNames.daisyUi(`file-input-${this.variant()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
