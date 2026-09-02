import { Directive, inject } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdDiff]', host: { '[class]': 'hostClass' } })
export class ZdDiff {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('diff');
}

@Directive({ selector: '[zdDiffItem1]', host: { '[class]': 'hostClass' } })
export class ZdDiffItem1 {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('diff-item-1');
}

@Directive({ selector: '[zdDiffItem2]', host: { '[class]': 'hostClass' } })
export class ZdDiffItem2 {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('diff-item-2');
}

@Directive({ selector: '[zdDiffResizer]', host: { '[class]': 'hostClass' } })
export class ZdDiffResizer {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('diff-resizer');
}
