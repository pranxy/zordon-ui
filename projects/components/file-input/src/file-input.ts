import { computed, Directive, inject, input } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdFileInputColor =
  'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdFileInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ZdFileInputStyle = 'ghost';

@Directive({
  selector: 'input[type="file"][zdFileInput]',
  host: { '[class]': 'hostClasses()' },
})
export class ZdFileInput {
  readonly color = input<ZdFileInputColor | undefined>();
  readonly size = input<ZdFileInputSize | undefined>();
  readonly style = input<ZdFileInputStyle | undefined>();

  private readonly classNames = inject(ZdClassNames);

  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('file-input'),
      this.color() && this.classNames.daisyUi(`file-input-${this.color()}`),
      this.size() && this.classNames.daisyUi(`file-input-${this.size()}`),
      this.style() && this.classNames.daisyUi(`file-input-${this.style()}`),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
