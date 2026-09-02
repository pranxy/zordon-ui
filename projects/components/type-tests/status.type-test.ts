import { type ZdStatusColor, type ZdStatusSize, ZdStatus } from '@pranxy/zordon-ui/status';
const color: ZdStatusColor = 'success'; const size: ZdStatusSize = 'xl'; void color; void size; void ZdStatus;
// @ts-expect-error Status colors are upstream candidates.
const invalidColor: ZdStatusColor = 'brand'; void invalidColor;
