import type { ZdColor, ZdSize } from '@pranxy/zordon-ui';
import {
  ZdButton,
  type ZdButtonDefaults,
  type ZdButtonLayout,
  type ZdButtonVariant,
  withButtonDefaults,
} from '@pranxy/zordon-ui/button';

const color: ZdColor = 'primary';
const size: ZdSize = 'lg';
const variant: ZdButtonVariant = 'outline';
const layout: ZdButtonLayout = 'circle';
const defaults: ZdButtonDefaults = { color, size, variant, layout };

withButtonDefaults(defaults);
void ZdButton;

// @ts-expect-error Button variant intentionally excludes generic `border`.
const invalidVariant: ZdButtonVariant = 'border';
// @ts-expect-error Button layout accepts one documented modifier only.
const invalidLayout: ZdButtonLayout = 'wide circle';
// @ts-expect-error Button defaults reject stateful inputs.
const invalidDefaults: ZdButtonDefaults = { loading: true };

void invalidVariant;
void invalidLayout;
void invalidDefaults;
