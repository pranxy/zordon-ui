import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ButtonAnimation,
    ButtonColor,
    ButtonDirective,
    ButtonShape,
    ButtonSize,
    ButtonStyle,
    ButtonWidth,
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
    colors: ButtonColor[] = [
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
    sizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg'];

    // Style options
    styles: ButtonStyle[] = ['default', 'outline', 'ghost', 'link'];

    // Animation options
    animations: ButtonAnimation[] = ['none', 'pulse'];

    // Button configuration signal
    color = model<ButtonColor>('primary');
    size = model<ButtonSize>('md');
    style = model<ButtonStyle>('default');
    shape = model<ButtonShape | null>(null);
    width = model<ButtonWidth | null>(null);
    animation = model<ButtonAnimation>('none');
    loading = model(false);
    disabled = model(false);
    glass = model(false);
    noAnimation = model(false);
}
