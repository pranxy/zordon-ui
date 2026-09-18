import type {
  ZdModalService,
  ZdModalRef,
  ZdModalContext,
  ZdModalOptions,
  ZdModalPlacement,
} from '@pranxy/zordon-ui/modal';
import type { TemplateRef } from '@angular/core';
declare const service: ZdModalService;
declare const template: TemplateRef<ZdModalContext<number>>;
const options: ZdModalOptions<number> = {
  label: 'Editor',
  beforeClose: result => result.value !== 0,
};
const ref: ZdModalRef<number> = service.open(template, options);
ref.close(2);
// @ts-expect-error Result values retain the declared type.
ref.close('two');
// @ts-expect-error Modal requires an accessible name.
service.open(null, {});
// @ts-expect-error Placement uses logical rather than physical edges.
const invalid: ZdModalPlacement = 'left';
void invalid;
