import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { firestoreService, where } from '../../services/firestoreService';
import { COLLECTIONS, ROLES } from '../../constants';
import { calculatePercentage, isCountedPresent, categorize } from '../../utils/attendance';

dayjs.extend(isoWeek);

const PERIODS = {
  DAILY: (d) => [d.startOf('day'), d.endOf('day')],
  WEEKLY: (d) => [d.startOf('isoWeek'), d.endOf('isoWeek')],
  MONTHLY: (d) => [d.startOf('month'), d.endOf('month')],
  SEMESTER: (d) => [d.subtract(6, 'month'), d],
  YEARLY: (d) => [d.startOf('year'), d.endOf('year')],
};

export const reportService = {
  /**
   * Builds a per-student attendance report for the selected period.
   * Students only ever receive their own rows (enforced again by Firestore rules).
   */
  async buildReport({ period, referenceDate, role, userId }) {
    const [start, end] = PERIODS[period](dayjs(referenceDate));
    const constraints = role === ROLES.STUDENT ? [where('studentUserId', '==', userId)] : [];
    const records = await firestoreService.list(COLLECTIONS.ATTENDANCE_RECORDS, constraints);

    const inRange = records.filter((r) => {
      const d = dayjs(r.date);
      return (d.isAfter(start) || d.isSame(start, 'day')) && (d.isBefore(end) || d.isSame(end, 'day'));
    });

    const byStudent = {};
    for (const r of inRange) {
      const key = r.studentId;
      if (!byStudent[key]) {
        byStudent[key] = {
          id: key, rollNumber: r.rollNumber, name: r.studentName,
          total: 0, present: 0, absent: 0, late: 0, leave: 0,
        };
      }
      const s = byStudent[key];
      s.total += 1;
      if (r.status === 'PRESENT') s.present += 1;
      else if (r.status === 'ABSENT') s.absent += 1;
      else if (r.status === 'LATE') { s.late += 1; s.present += 0; }
      else s.leave += 1;
    }

    return Object.values(byStudent).map((s) => {
      const counted = inRange.filter((r) => r.studentId === s.id && isCountedPresent(r.status)).length;
      const percentage = calculatePercentage(counted, s.total);
      return { ...s, attended: counted, percentage, category: categorize(percentage).label };
    }).sort((a, b) => String(a.rollNumber).localeCompare(String(b.rollNumber)));
  },

  /** Persists report metadata so generated reports are tracked in Firestore. */
  async recordReport({ period, generatedBy, studentUserId = '', rowCount, format }) {
    await firestoreService.create(COLLECTIONS.REPORTS, {
      period, generatedBy, studentUserId, rowCount, format,
      generatedAt: new Date().toISOString(),
    });
  },
};
