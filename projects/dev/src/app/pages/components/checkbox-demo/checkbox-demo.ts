import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZdCheckbox } from '@pranxy/zordon-ui/checkbox';

@Component({
    selector: 'dev-checkbox-demo',
    imports: [ZdCheckbox, FormsModule],
    templateUrl: 'checkbox-demo.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckboxDemo {
    checked = model(true);
}
