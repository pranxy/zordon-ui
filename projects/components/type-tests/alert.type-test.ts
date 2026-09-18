import {
  ZdAlert,
  type ZdAlertColor,
  type ZdAlertDirection,
  type ZdAlertDismissReason,
} from '@pranxy/zordon-ui/alert';
declare const alert: ZdAlert;
alert.dismiss();
const direction: ZdAlertDirection = 'responsive';
void direction;
// @ts-expect-error Alert supports semantic feedback colors only.
const color: ZdAlertColor = 'primary';
void color;
// @ts-expect-error Escape is not an inline Alert dismissal trigger.
const reason: ZdAlertDismissReason = 'escape';
void reason;
// @ts-expect-error Open state is a consumer-owned input.
alert.open.set(false);
