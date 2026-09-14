import type { ZdSwap, ZdSwapEffect } from '@pranxy/zordon-ui/swap';
const effect: ZdSwapEffect = 'flip';
// @ts-expect-error unsupported effect
const invalid: ZdSwapEffect = 'spin';
declare const swap: ZdSwap;
const value: boolean = swap.active();
// @ts-expect-error controlled input is not writable
swap.active.set(true);
void [effect, invalid, value];
