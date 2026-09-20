import {
  ZdDock,
  type ZdDockItem,
  type ZdDockSize,
  type ZdDockPosition,
} from '@pranxy/zordon-ui/dock';
declare const dock: ZdDock;
const items: readonly ZdDockItem[] = dock.items();
const route: ZdDockItem = { id: 'home', label: 'Home', routerLink: ['/home'] };
const size: ZdDockSize = 'xl';
const position: ZdDockPosition = 'sticky';
// @ts-expect-error Dock requires a human-readable name.
const invalid: ZdDockItem = { id: 'x', href: '/' };
// @ts-expect-error Supported sizes are xs through xl.
const invalidSize: ZdDockSize = 'xxl';
void items;
void route;
void size;
void position;
void invalid;
void invalidSize;
