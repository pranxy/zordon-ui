import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZdButton } from '@pranxy/zordon-ui/button';
import { ZdTabs } from '@pranxy/zordon-ui/tabs';
import { entryCount } from './entries';

@Component({
  selector: 'zd-consumer',
  imports: [FormsModule, ZdButton, ZdTabs],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p data-testid="entries">{{ entries }}</p>
    <button zdButton (click)="count.set(count() + 1)">Increment</button>
    <p data-testid="count">{{ count() }}</p>
    <label>Name <input [(ngModel)]="name" /></label>
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
  readonly entries = entryCount;
  readonly count = signal(0);
  readonly name = signal('');
  readonly active = signal('first');
  readonly items = [
    { id: 'first', label: 'First', content: 'First panel' },
    { id: 'second', label: 'Second', content: 'Second panel' },
  ];
}
