import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { ZdBaseClassHander } from '../core';
import { BADGE_COLOR, BADGE_SIZE, BADGE_STYLE } from './badge-tokens';
import { ZdBadgeColor, ZdBadgeSize, ZdBadgeType } from './badge.model';

@Component({
    selector: 'zd-badge',
    host: {
        class: 'badge',
    },
    template: `<ng-content />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZdBadge extends ZdBaseClassHander {
    color = input<ZdBadgeColor>('primary');

    size = input<ZdBadgeSize>('md');

    type = input<ZdBadgeType>();

    animatePulse = input<boolean>(false);

    private colorEft = effect(() => {
        const color = this.color();
        this.updateItemClass('color', BADGE_COLOR[color]);
    });

    private sizeEft = effect(() => {
        const size = this.size();
        this.updateItemClass('size', BADGE_SIZE[size]);
    });

    private typeEft = effect(() => {
        const type = this.type();
        // Handle null case: remove the class if width is null
        if (!type) {
            this.removeItemClass('type');
        } else {
            this.updateItemClass('type', BADGE_STYLE[type]);
        }
    });
}
