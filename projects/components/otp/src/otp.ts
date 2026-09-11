import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'zd-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZdOtp),
      multi: true,
    },
  ],
  host: {
    'class': 'zd-otp',
    'role': 'group',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    @for (digit of displayedSlots(); track $index; let index = $index) {
      <input
        #cell
        class="input zd-otp-cell"
        type="text"
        maxlength="1"
        [attr.inputmode]="inputMode()"
        [attr.pattern]="pattern()"
        [attr.autocomplete]="index === 0 ? 'one-time-code' : 'off'"
        [attr.aria-label]="ariaLabel() + ' digit ' + (index + 1) + ' of ' + length()"
        [disabled]="disabled()"
        [value]="digit"
        (input)="onInput(index, cell.value, cell)"
        (keydown)="onKeydown(index, $event, cell)"
        (paste)="onPaste(index, $event)"
      />
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      gap: 0.5rem;
    }
    .zd-otp-cell {
      inline-size: 2.75rem;
      text-align: center;
    }
  `,
})
export class ZdOtp implements ControlValueAccessor {
  readonly length = input(6, { transform: numberAttribute });
  readonly pattern = input('[0-9]');
  readonly inputMode = input('numeric');
  readonly ariaLabel = input('One-time password');
  readonly valueChange = output<string>();
  readonly completed = output<string>();

  protected readonly disabled = signal(false);
  protected readonly slots = signal<string[]>(this.emptySlots());
  protected readonly displayedSlots = computed(() => {
    const length = Math.max(1, this.length());
    return Array.from({ length }, (_, index) => this.slots()[index] ?? '');
  });
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.setValue(value ?? '', false);
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  protected onInput(index: number, value: string, cell: HTMLInputElement): void {
    const characters = this.accept(value);
    this.update(index, characters.slice(0, 1));
    if (characters && index < this.length() - 1) {
      cell.parentElement?.querySelectorAll<HTMLInputElement>('input')[index + 1]?.focus();
    }
  }

  protected onKeydown(index: number, event: KeyboardEvent, cell: HTMLInputElement): void {
    if (event.key === 'Backspace' && !cell.value && index > 0) {
      event.preventDefault();
      const cells = cell.parentElement?.querySelectorAll<HTMLInputElement>('input');
      cells?.[index - 1]?.focus();
    }
  }

  protected onPaste(index: number, event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') ?? '';
    const characters = this.accept(text);
    if (!characters) return;
    event.preventDefault();
    const next = [...this.slots()];
    characters
      .slice(0, this.length() - index)
      .split('')
      .forEach((character, offset) => {
        next[index + offset] = character;
      });
    this.commit(next);
  }

  private update(index: number, value: string): void {
    const next = [...this.slots()];
    next[index] = value;
    this.commit(next);
  }

  private setValue(value: string, emit: boolean): void {
    const next = this.emptySlots();
    this.accept(value)
      .slice(0, this.length())
      .split('')
      .forEach((character, index) => (next[index] = character));
    this.slots.set(next);
    if (emit) this.emit(next);
  }

  private commit(next: string[]): void {
    this.slots.set(next);
    this.onTouched();
    this.emit(next);
  }

  private emit(next: string[]): void {
    const digits = next.slice(0, this.length());
    const value = digits.join('');
    this.onChange(value);
    this.valueChange.emit(value);
    if (digits.length === this.length() && digits.every(Boolean)) this.completed.emit(value);
  }

  private accept(value: string): string {
    try {
      const matcher = new RegExp(this.pattern());
      return [...value].filter(character => matcher.test(character)).join('');
    } catch {
      return value;
    }
  }

  private emptySlots(): string[] {
    return Array.from({ length: Math.max(1, this.length()) }, () => '');
  }
}
