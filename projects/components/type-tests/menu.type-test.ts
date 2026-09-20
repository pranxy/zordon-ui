import {
  ZdMenu,
  ZdMenuTree,
  type ZdMenuItem,
  type ZdMenuNode,
  type ZdMenuSize,
} from '@pranxy/zordon-ui/menu';
declare const menu: ZdMenu;
declare const tree: ZdMenuTree;
const items: readonly ZdMenuItem[] = menu.items();
const nodes: readonly ZdMenuNode[] = tree.items();
tree.selectedIds.set(['file']);
menu.expandedIds.set(['resources']);
// @ts-expect-error Nodes require accessible labels.
const invalid: ZdMenuNode = { id: 'x' };
// @ts-expect-error Five supported sizes.
const size: ZdMenuSize = 'xxl';
void items;
void nodes;
void invalid;
void size;
