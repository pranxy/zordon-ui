import {
  type ZdCardSize,
  type ZdCardVariant,
  ZdCard,
  ZdCardActions,
  ZdCardBody,
  ZdCardTitle,
} from '@pranxy/zordon-ui/card';

const size: ZdCardSize = 'xl';
const variant: ZdCardVariant = 'dash';
void size;
void variant;
void ZdCard;
void ZdCardActions;
void ZdCardBody;
void ZdCardTitle;

// @ts-expect-error Card size is limited to upstream candidates.
const invalidSize: ZdCardSize = '2xl';
// @ts-expect-error Card variant is limited to upstream candidates.
const invalidVariant: ZdCardVariant = 'solid';
void invalidSize;
void invalidVariant;
