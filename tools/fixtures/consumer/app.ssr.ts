import { DOCUMENT, isPlatformServer } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdIdGenerator } from '@pranxy/zordon-ui';
import { ZdTabs } from '@pranxy/zordon-ui/tabs';
import { entryCount } from './entries';

@Component({
  selector: 'zd-consumer',
  imports: [FormsModule, ZdButton, ZdTabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-render-origin]': 'origin' },
  template: `
    <p data-testid="entries">{{ entries }}</p>
    <button zdButton (click)="count.set(count() + 1)">Increment</button>
    <p data-testid="count">{{ count() }}</p>
    <label [id]="labelId" [for]="inputId">Name</label>
    <input
      [id]="inputId"
      [attr.aria-labelledby]="labelId"
      [attr.aria-describedby]="hintId"
      [(ngModel)]="name"
    />
    <p [id]="hintId">Consumer name</p>
    <p data-testid="name">{{ name() }}</p>
    <zd-tabs
      label="Consumer tabs"
      [items]="items"
      [activeId]="active()"
      (activeIdChange)="active.set($event)"
    />
  `,
})
export class Consumer {
  private readonly ids = inject(ZdIdGenerator);
  readonly inputId = this.ids.next('consumer-input');
  readonly labelId = this.ids.next('consumer-label');
  readonly hintId = this.ids.next('consumer-hint');
  readonly origin = isPlatformServer(inject(PLATFORM_ID)) ? 'server' : 'browser';
  readonly entries = entryCount;
  readonly count = signal(0);
  readonly name = signal('Server consumer');
  readonly active = signal('first');
  readonly items = [
    { id: 'first', label: 'First', content: 'First panel' },
    { id: 'second', label: 'Second', content: 'Second panel' },
  ];

  constructor() {
    const document = inject(DOCUMENT);
    afterNextRender(() => document.documentElement.setAttribute('data-consumer-ready', 'true'));
  }
}
