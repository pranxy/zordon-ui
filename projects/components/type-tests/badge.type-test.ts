import {
  type ZdBadgeColor,
  type ZdBadgeSize,
  type ZdBadgeStyle,
  ZdBadge,
} from '@pranxy/zordon-ui/badge';

const color: ZdBadgeColor = 'success';
const size: ZdBadgeSize = 'xl';
const style: ZdBadgeStyle = 'soft';
void color;
void size;
void style;
void ZdBadge;

// @ts-expect-error Badge color is limited to upstream candidates.
const invalidColor: ZdBadgeColor = 'brand';
// @ts-expect-error Badge size is limited to upstream candidates.
const invalidSize: ZdBadgeSize = '2xl';
// @ts-expect-error Badge style is limited to upstream candidates.
const invalidStyle: ZdBadgeStyle = 'solid';
void invalidColor;
void invalidSize;
void invalidStyle;
