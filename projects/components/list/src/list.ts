import { Directive, inject } from '@angular/core';

import { ZdClassNames } from '@pranxy/zordon-ui';

@Directive({ selector: '[zdList]', host: { '[class]': 'hostClass' } })
export class ZdList {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('list');
}

@Directive({ selector: '[zdListRow]', host: { '[class]': 'hostClass' } })
export class ZdListRow {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('list-row');
}

@Directive({ selector: '[zdListColWrap]', host: { '[class]': 'hostClass' } })
export class ZdListColWrap {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('list-col-wrap');
}

@Directive({ selector: '[zdListColGrow]', host: { '[class]': 'hostClass' } })
export class ZdListColGrow {
  protected readonly hostClass = inject(ZdClassNames).daisyUi('list-col-grow');
}
