import { firestoreService } from './firestoreService';
import { COLLECTIONS } from '../constants';

function getCurrentUser() {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { uid: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/** Writes an immutable audit log entry for every sensitive mutation. */
export async function logAudit({ action, entity, entityId, before = null, after = null }) {
  try {
    const user = getCurrentUser();
    await firestoreService.create(COLLECTIONS.AUDIT_LOGS, {
      action,
      entity,
      entityId: entityId || '',
      before: before ? JSON.stringify(before) : null,
      after: after ? JSON.stringify(after) : null,
      performedBy: user?.uid || 'system',
      performedByEmail: user?.email || '',
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Audit log failed', e);
  }
}
