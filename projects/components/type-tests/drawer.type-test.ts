import {
  ZdDrawer,
  ZdDrawerPanel,
  type ZdDrawerMode,
  type ZdDrawerReason,
  type ZdDrawerContext,
} from '@pranxy/zordon-ui/drawer';
declare const drawer: ZdDrawer;
const mode: ZdDrawerMode = 'responsive';
const reason: ZdDrawerReason = 'swipe';
declare const context: ZdDrawerContext;
context.$implicit();
drawer.requestClose(reason);
// @ts-expect-error Arbitrary CSS placement is not a Drawer mode.
const invalid: ZdDrawerMode = 'fixed';
// @ts-expect-error Drawer requests close using a typed reason.
drawer.requestClose('submit');
void [ZdDrawerPanel, mode, invalid];
