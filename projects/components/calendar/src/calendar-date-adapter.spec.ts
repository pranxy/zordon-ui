import { TestBed } from '@angular/core/testing';
import { ZdCalendarDateAdapter, ZD_CALENDAR_STRINGS } from './calendar-date-adapter';

describe('Calendar civil-date adapter', () => {
  const adapter = new ZdCalendarDateAdapter();
  it('validates actual Gregorian dates without year-1900 coercion', () => {
    for (const date of ['0001-01-01', '0099-12-31', '2000-02-29', '2024-02-29', '9999-12-31'])
      expect(adapter.isValid(date)).toBe(true);
    for (const date of [
      null,
      20260914,
      '',
      '2026-9-14',
      '2026-02-29',
      '1900-02-29',
      '0000-01-01',
      '2026-13-01',
      '2026-00-00',
    ])
      expect(adapter.isValid(date)).toBe(false);
    expect(() => adapter.weekday('invalid')).toThrow(RangeError);
  });
  it('adds days and clamps month arithmetic across leap years and supported boundaries', () => {
    expect(adapter.addDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(adapter.addDays('2026-03-29', 1)).toBe('2026-03-30');
    expect(adapter.addDays('0001-01-01', -1)).toBeNull();
    expect(adapter.addDays('9999-12-31', 1)).toBeNull();
    expect(adapter.addMonths('2024-01-31', 1)).toBe('2024-02-29');
    expect(adapter.addMonths('2024-02-29', 12)).toBe('2025-02-28');
    expect(adapter.addMonths('2026-01-15', -1)).toBe('2025-12-15');
    expect(adapter.addMonths('0001-01-01', -1)).toBeNull();
    expect(adapter.addMonths('9999-12-31', 1)).toBeNull();
    expect(adapter.startOfMonth('0099-12-31')).toBe('0099-12-01');
    expect(adapter.weekday('2026-09-14')).toBe(1);
  });
  it('formats in an explicit Gregorian UTC frame with replaceable labels', () => {
    expect(adapter.format('2026-09-14', 'en-US', { dateStyle: 'full' })).toBe(
      'Monday, September 14, 2026',
    );
    expect(adapter.format('2026-09-14', 'pt-PT', { month: 'long' })).toBe('setembro');
    expect(TestBed.inject(ZD_CALENDAR_STRINGS).close).toBe('Close calendar');
    expect(TestBed.inject(ZdCalendarDateAdapter)).toBeInstanceOf(ZdCalendarDateAdapter);
  });
});
