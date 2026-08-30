import { type ZdAuraSize, type ZdAuraVariant, ZdAura } from '@pranxy/zordon-ui/aura';

const size: ZdAuraSize = 'lg';
const variant: ZdAuraVariant = 'rainbow';

void size;
void variant;
void ZdAura;

// @ts-expect-error Aura size is limited to upstream candidates.
const invalidSize: ZdAuraSize = '2xl';
// @ts-expect-error Aura variant is limited to upstream candidates.
const invalidVariant: ZdAuraVariant = 'plasma';
void invalidSize;
void invalidVariant;
