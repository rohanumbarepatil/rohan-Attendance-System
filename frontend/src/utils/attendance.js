import { ATTENDANCE_CATEGORY, COUNTED_AS_PRESENT, DEFAULTER_THRESHOLD } from '../constants';

/**
 * Attendance % = (present lectures / total conducted lectures) * 100
 */
export function calculatePercentage(presentLectures, totalConductedLectures) {
  if (!totalConductedLectures || totalConductedLectures <= 0) return 0;
  return Math.round((presentLectures / totalConductedLectures) * 10000) / 100;
}

export function categorize(percentage) {
  if (percentage > 90) return ATTENDANCE_CATEGORY.EXCELLENT;
  if (percentage > 75) return ATTENDANCE_CATEGORY.GOOD;
  if (percentage >= 60) return ATTENDANCE_CATEGORY.WARNING;
  return ATTENDANCE_CATEGORY.CRITICAL;
}

export function isDefaulter(percentage) {
  return percentage < DEFAULTER_THRESHOLD;
}

export function isCountedPresent(status) {
  return COUNTED_AS_PRESENT.includes(status);
}

/**
 * Aggregates raw attendance records into per-subject statistics.
 * records: [{ subjectId, subjectName, status, date }]
 */
export function summarizeRecords(records) {
  const bySubject = {};
  for (const r of records) {
    if (!bySubject[r.subjectId]) {
      bySubject[r.subjectId] = {
        subjectId: r.subjectId,
        subjectName: r.subjectName || r.subjectId,
        total: 0,
        present: 0,
      };
    }
    bySubject[r.subjectId].total += 1;
    if (isCountedPresent(r.status)) bySubject[r.subjectId].present += 1;
  }
  const subjects = Object.values(bySubject).map((s) => ({
    ...s,
    percentage: calculatePercentage(s.present, s.total),
  }));
  const total = records.length;
  const present = records.filter((r) => isCountedPresent(r.status)).length;
  const percentage = calculatePercentage(present, total);
  return { subjects, total, present, percentage, category: categorize(percentage) };
}

/** Groups records by month key YYYY-MM for monthly views. */
export function groupByMonth(records) {
  const byMonth = {};
  for (const r of records) {
    const key = (r.date || '').slice(0, 7);
    if (!byMonth[key]) byMonth[key] = { month: key, total: 0, present: 0 };
    byMonth[key].total += 1;
    if (isCountedPresent(r.status)) byMonth[key].present += 1;
  }
  return Object.values(byMonth)
    .map((m) => ({ ...m, percentage: calculatePercentage(m.present, m.total) }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
