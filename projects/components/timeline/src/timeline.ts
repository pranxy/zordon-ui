import { booleanAttribute, computed, Directive, inject, input } from '@angular/core';
import { ZdClassNames } from '@pranxy/zordon-ui';
export type ZdTimelineOrientation = 'horizontal' | 'vertical';
@Directive({ selector: '[zdTimeline]', host: { '[class]': 'hostClasses()' } })
export class ZdTimeline {
  readonly orientation = input<ZdTimelineOrientation | undefined>(undefined);
  readonly compact = input(false, { transform: booleanAttribute });
  private readonly classNames = inject(ZdClassNames);
  protected readonly hostClasses = computed(() =>
    [
      this.classNames.daisyUi('timeline'),
      this.orientation() && this.classNames.daisyUi(`timeline-${this.orientation()}`),
      this.compact() && this.classNames.daisyUi('timeline-compact'),
    ]
      .filter(Boolean)
      .join(' '),
  );
}
@Directive({ selector: '[zdTimelineStart]', host: { '[class]': 'hostClass' } })
export class ZdTimelineStart {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('timeline-start');
}
@Directive({ selector: '[zdTimelineMiddle]', host: { '[class]': 'hostClass' } })
export class ZdTimelineMiddle {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('timeline-middle');
}
@Directive({ selector: '[zdTimelineEnd]', host: { '[class]': 'hostClass' } })
export class ZdTimelineEnd {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('timeline-end');
}
@Directive({ selector: '[zdTimelineBox]', host: { '[class]': 'hostClass' } })
export class ZdTimelineBox {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('timeline-box');
}
@Directive({ selector: '[zdTimelineSnapIcon]', host: { '[class]': 'hostClass' } })
export class ZdTimelineSnapIcon {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('timeline-snap-icon');
}
