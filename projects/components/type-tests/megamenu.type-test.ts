import { ZdMegamenu, ZdMegamenuPanel } from '@pranxy/zordon-ui/megamenu';
declare const root: ZdMegamenu;
declare const panel: ZdMegamenuPanel;
const expanded: boolean = root.expanded();
const columns: 1 | 2 | 3 | 4 = panel.columns();
root.show();
root.close('navigation');
// @ts-expect-error Close reasons are finite.
root.close('unknown');
// @ts-expect-error Panel width is not an arbitrary CSS string.
const width: ReturnType<typeof panel.width> = '200px';
void expanded;
void columns;
void width;
