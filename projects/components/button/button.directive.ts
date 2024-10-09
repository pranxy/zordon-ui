import { Directive } from '@angular/core';

@Directive({
  selector: 'button[zdButton], a[zdButton]',
  standalone: true,
})
export class ZordonButton {}
