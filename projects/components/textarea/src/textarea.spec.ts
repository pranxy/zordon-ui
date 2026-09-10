import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ZdTextarea } from './textarea';

@Component({
  imports: [ReactiveFormsModule, ZdTextarea],
  template:
    '<textarea zdTextarea color="primary" size="lg" [style]="\'ghost\'" rows="4" maxlength="280" [formControl]="notes"></textarea>',
})
class Host {
  readonly notes = new FormControl('Initial note', { nonNullable: true });
}

describe('ZdTextarea', () => {
  it('preserves native rows, constraints, and Reactive Forms behavior while applying modifiers', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const textarea = fixture.nativeElement.querySelector('[zdTextarea]') as HTMLTextAreaElement;
    textarea.value = 'Updated note';
    textarea.dispatchEvent(new Event('input'));
    expect(textarea.rows).toBe(4);
    expect(textarea.maxLength).toBe(280);
    expect(textarea.className).toContain('textarea-primary');
    expect(textarea.className).toContain('textarea-lg');
    expect(textarea.className).toContain('textarea-ghost');
    expect(fixture.componentInstance.notes.value).toBe('Updated note');
  });
});
