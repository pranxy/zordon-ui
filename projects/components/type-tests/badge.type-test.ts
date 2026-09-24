import {
  type ZdBadgeColor,
  type ZdBadgeSize,
  type ZdBadgeVariant,
  ZdBadge,
} from '@pranxy/zordon-ui/badge';

const color: ZdBadgeColor = 'success';
const size: ZdBadgeSize = 'xl';
const variant: ZdBadgeVariant = 'soft';
void color;
void size;
void variant;
void ZdBadge;

// @ts-expect-error Badge color is limited to upstream candidates.
const invalidColor: ZdBadgeColor = 'brand';
// @ts-expect-error Badge size is limited to upstream candidates.
const invalidSize: ZdBadgeSize = '2xl';
// @ts-expect-error Badge variant is limited to upstream candidates.
const invalidVariant: ZdBadgeVariant = 'solid';
void invalidColor;
void invalidSize;
void invalidVariant;
