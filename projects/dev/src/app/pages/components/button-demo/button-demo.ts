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
import { ComponentCard } from '../../../ui';

@Component({
    selector: 'dev-button-demo',
    imports: [ButtonDirective, FormsModule, ComponentCard],
    templateUrl: 'button-demo.html',
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

    buttonStylesCode = `<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>
<button class="btn btn-info">Info</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-error">Error</button>
<button class="btn btn-neutral">Neutral</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>`;

    buttonSizesCode = `<button class="btn btn-xs">Tiny</button>
<button class="btn btn-sm">Small</button>
<button class="btn">Normal</button>
<button class="btn btn-lg">Large</button>`;

    buttonVariantsCode = `<button class="btn btn-outline">Outline</button>
<button class="btn btn-primary btn-outline">Primary</button>
<button class="btn btn-secondary btn-outline">Secondary</button>
<button class="btn btn-accent btn-outline">Accent</button>
<button class="btn btn-wide btn-primary">Wide Button</button>
<button class="btn btn-circle">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
<button class="btn btn-square">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
  </svg>
</button>`;

    buttonStatesCode = `<button class="btn" disabled>Disabled</button>
<button class="btn btn-primary btn-disabled">Disabled Style</button>
<button class="btn loading">Loading</button>
<button class="btn btn-square loading"></button>
<button class="btn btn-primary loading">Loading</button>`;

    buttonIconsCode = `<button class="btn gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
  Button
</button>
<button class="btn gap-2">
  Download
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
</button>`;

    buttonGroupsCode = `<div class="btn-group">
  <button class="btn">Previous</button>
  <button class="btn btn-active">1</button>
  <button class="btn">2</button>
  <button class="btn">3</button>
  <button class="btn">4</button>
  <button class="btn">Next</button>
</div>`;
}
