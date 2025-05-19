import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ButtonDirective,
    ZdButtonAnimation,
    ZdButtonColor,
    ZdButtonShape,
    ZdButtonSize,
    ZdButtonType,
    ZdButtonWidth,
} from '@pranxy/zordon-ui/button';

@Component({
    selector: 'dev-button-demo',
    imports: [ButtonDirective, FormsModule],
    templateUrl: 'button-demo.html',
    styleUrl: './button-demo.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ButtonDemo {
    buttonText = signal('Click me');

    // Color options
    colors: ZdButtonColor[] = [
        'primary',
        'secondary',
        'accent',
        'info',
        'success',
        'warning',
        'error',
        'neutral',
    ];

    // Size options
    sizes: ZdButtonSize[] = ['xs', 'sm', 'md', 'lg'];

    // Style options
    styles: ZdButtonType[] = ['default', 'outline', 'ghost', 'link'];

    // Animation options
    animations: ZdButtonAnimation[] = ['none', 'pulse'];

    // Button configuration signal
    color = model<ZdButtonColor>('primary');
    size = model<ZdButtonSize>('md');
    style = model<ZdButtonType>('default');
    shape = model<ZdButtonShape | null>(null);
    width = model<ZdButtonWidth | null>(null);
    animation = model<ZdButtonAnimation>('none');
    loading = model(false);
    disabled = model(false);
    glass = model(false);
    noAnimation = model(false);
}
