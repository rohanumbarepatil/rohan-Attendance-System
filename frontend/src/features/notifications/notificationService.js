import { firestoreService, where, orderBy, limit } from '../../services/firestoreService';
import { COLLECTIONS } from '../../constants';

/**
 * In-app notification system (Spark plan compatible).
 * Delivery is fully realtime via Firestore listeners; no server-side push required.
 */
export const notificationService = {
  /** Realtime in-app notifications for the signed-in user. */
  listen(userId, role, callback) {
    return firestoreService.listen(
      COLLECTIONS.NOTIFICATIONS,
      [where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50)],
      callback
    );
  },

  async markRead(id) {
    await firestoreService.update(COLLECTIONS.NOTIFICATIONS, id, {
      read: true,
      readAt: new Date().toISOString(),
    });
  },

  async send({ userId, audience = null, type, title, message }) {
    await firestoreService.create(COLLECTIONS.NOTIFICATIONS, {
      userId: userId || '',
      audience,
      type,
      title,
      message,
      read: false,
      readAt: null,
    });
  },
};
