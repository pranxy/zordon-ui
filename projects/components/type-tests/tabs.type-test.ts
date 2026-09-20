import {
  ZdTabs,
  ZdTabContent,
  type ZdTabItem,
  type ZdTabClose,
  type ZdTabReorder,
  type ZdTabsVariant,
  type ZdTabsActivation,
  type ZdTabContentContext,
  type ZdTabsLabels,
} from '@pranxy/zordon-ui/tabs';
const items: readonly ZdTabItem[] = [{ id: 'one', label: 'One', closable: true }];
const close: ZdTabClose = { id: 'one', nextId: null };
const reorder: ZdTabReorder = { id: 'one', fromIndex: 0, toIndex: 1, items };
const variant: ZdTabsVariant = 'lift';
const activation: ZdTabsActivation = 'manual';
const context: ZdTabContentContext = { $implicit: items[0], active: true };
const labels: ZdTabsLabels = {
  close: label => label,
  earlier: label => label,
  later: label => label,
};
// @ts-expect-error Tabs do not accept radio styling.
const invalid: ZdTabsVariant = 'radio';
// @ts-expect-error Identity and a visible label are required.
const missing: ZdTabItem = { id: 'one' };
void [ZdTabs, ZdTabContent, close, reorder, variant, activation, context, labels, invalid, missing];
