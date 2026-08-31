import {
  type ZdCardSize,
  type ZdCardStyle,
  ZdCard,
  ZdCardActions,
  ZdCardBody,
  ZdCardTitle,
} from '@pranxy/zordon-ui/card';

const size: ZdCardSize = 'xl';
const style: ZdCardStyle = 'dash';
void size;
void style;
void ZdCard;
void ZdCardActions;
void ZdCardBody;
void ZdCardTitle;

// @ts-expect-error Card size is limited to upstream candidates.
const invalidSize: ZdCardSize = '2xl';
// @ts-expect-error Card style is limited to upstream candidates.
const invalidStyle: ZdCardStyle = 'solid';
void invalidSize;
void invalidStyle;
