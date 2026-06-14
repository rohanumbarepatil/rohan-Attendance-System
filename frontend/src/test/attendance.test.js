import { describe, it, expect } from 'vitest';
import {
  calculatePercentage, categorize, isDefaulter, isCountedPresent, summarizeRecords, groupByMonth,
} from '../utils/attendance';
import { ATTENDANCE_STATUS } from '../constants';

describe('attendance percentage engine', () => {
  it('computes percentage with the documented formula', () => {
    expect(calculatePercentage(45, 60)).toBe(75);
    expect(calculatePercentage(1, 3)).toBe(33.33);
  });

  it('returns 0 when no lectures conducted', () => {
    expect(calculatePercentage(0, 0)).toBe(0);
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it('categorizes correctly across boundaries', () => {
    expect(categorize(95).key).toBe('EXCELLENT');
    expect(categorize(90).key).toBe('GOOD');
    expect(categorize(80).key).toBe('GOOD');
    expect(categorize(75).key).toBe('WARNING');
    expect(categorize(60).key).toBe('WARNING');
    expect(categorize(59.9).key).toBe('CRITICAL');
  });

  it('flags defaulters below 75%', () => {
    expect(isDefaulter(74.99)).toBe(true);
    expect(isDefaulter(75)).toBe(false);
  });

  it('counts leave statuses as attended', () => {
    expect(isCountedPresent(ATTENDANCE_STATUS.PRESENT)).toBe(true);
    expect(isCountedPresent(ATTENDANCE_STATUS.LATE)).toBe(true);
    expect(isCountedPresent(ATTENDANCE_STATUS.MEDICAL_LEAVE)).toBe(true);
    expect(isCountedPresent(ATTENDANCE_STATUS.AUTHORIZED_LEAVE)).toBe(true);
    expect(isCountedPresent(ATTENDANCE_STATUS.ABSENT)).toBe(false);
  });

  it('summarizes records per subject and overall', () => {
    const records = [
      { subjectId: 'm', subjectName: 'Maths', status: 'PRESENT', date: '2026-01-05' },
      { subjectId: 'm', subjectName: 'Maths', status: 'ABSENT', date: '2026-01-06' },
      { subjectId: 'p', subjectName: 'Physics', status: 'PRESENT', date: '2026-01-05' },
      { subjectId: 'p', subjectName: 'Physics', status: 'PRESENT', date: '2026-01-06' },
    ];
    const summary = summarizeRecords(records);
    expect(summary.total).toBe(4);
    expect(summary.present).toBe(3);
    expect(summary.percentage).toBe(75);
    const maths = summary.subjects.find((s) => s.subjectId === 'm');
    expect(maths.percentage).toBe(50);
  });

  it('groups records by month in chronological order', () => {
    const records = [
      { status: 'PRESENT', date: '2026-02-01' },
      { status: 'ABSENT', date: '2026-01-15' },
      { status: 'PRESENT', date: '2026-01-20' },
    ];
    const months = groupByMonth(records);
    expect(months.map((m) => m.month)).toEqual(['2026-01', '2026-02']);
    expect(months[0].percentage).toBe(50);
    expect(months[1].percentage).toBe(100);
  });
});
