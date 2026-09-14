import { Directive, inject, TemplateRef, ViewContainerRef, DestroyRef } from '@angular/core';
import { ZdDropdown } from './dropdown';

@Directive({ selector: 'ng-template[zdDropdownPanel]' })
export class ZdDropdownPanel {
  /** @internal */ readonly template = inject<TemplateRef<object>>(TemplateRef);
  /** @internal */ readonly container = inject(ViewContainerRef);
  private readonly root = inject(ZdDropdown);
  private readonly register = this.root.registerPanel(this);
  private readonly cleanup = inject(DestroyRef).onDestroy(() => this.root.unregisterPanel());
}
