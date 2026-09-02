import { computed, Directive, inject, input } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';

export type ZdStatusColor = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
export type ZdStatusSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Directive({ selector: '[zdStatus]', host: { '[class]': 'hostClasses()' } })
export class ZdStatus {
  readonly color = input<ZdStatusColor | undefined, ZdStatusColor | undefined>(undefined, { transform: resolveStatusColor });
  readonly size = input<ZdStatusSize | undefined, ZdStatusSize | undefined>(undefined, { transform: resolveStatusSize });
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() => [this.classNames.daisyUi('status'), this.color() === undefined ? undefined : this.classNames.daisyUi(`status-${this.color()}`), this.size() === undefined ? undefined : this.classNames.daisyUi(`status-${this.size()}`)].filter((token): token is string => typeof token === 'string').join(' '));
}

export function resolveStatusColor(value: unknown): ZdStatusColor | undefined {
  if (value === undefined || value === 'neutral' || value === 'primary' || value === 'secondary' || value === 'accent' || value === 'info' || value === 'success' || value === 'warning' || value === 'error') return value;
  throw new RangeError(`Zordon UI Status color must be neutral, primary, secondary, accent, info, success, warning, error, or undefined; received ${String(value)}.`);
}
export function resolveStatusSize(value: unknown): ZdStatusSize | undefined {
  if (value === undefined || value === 'xs' || value === 'sm' || value === 'md' || value === 'lg' || value === 'xl') return value;
  throw new RangeError(`Zordon UI Status size must be xs, sm, md, lg, xl, or undefined; received ${String(value)}.`);
}
