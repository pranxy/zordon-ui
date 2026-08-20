import type { ZdColor } from '@pranxy/zordon-ui';
import { ZdLink, type ZdLinkDefaults, withLinkDefaults } from '@pranxy/zordon-ui/link';

const color: ZdColor = 'primary';
const defaults: ZdLinkDefaults = { color, hover: true };

withLinkDefaults(defaults);
void ZdLink;

// @ts-expect-error Link color intentionally accepts only semantic daisyUI colors.
const invalidColor: ZdLinkDefaults = { color: 'brand' };
// @ts-expect-error Link defaults reject unavailable-state behavior.
const invalidDefaults: ZdLinkDefaults = { zdDisabled: true };

void invalidColor;
void invalidDefaults;
