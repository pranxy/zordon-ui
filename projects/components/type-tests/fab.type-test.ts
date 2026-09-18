import { ZdFab, type ZdFabArrangement, type ZdFabCorner } from '@pranxy/zordon-ui/fab';
const arrangement: ZdFabArrangement = 'flower';
const corner: ZdFabCorner = 'top-start';
declare const fab: ZdFab;
const expanded: boolean = fab.expanded();
fab.openChange.subscribe((open: boolean) => void open);
// @ts-expect-error Physical placement is not part of the logical API.
const invalidCorner: ZdFabCorner = 'bottom-right';
// @ts-expect-error Menus are a separate component.
const invalidArrangement: ZdFabArrangement = 'menu';
void [arrangement, corner, expanded, invalidCorner, invalidArrangement];
