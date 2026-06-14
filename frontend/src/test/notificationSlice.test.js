import { describe, it, expect } from 'vitest';
import reducer, { notificationsUpdated } from '../features/notifications/notificationSlice';

describe('notification slice', () => {
  it('tracks unread count from the realtime stream', () => {
    const state = reducer(undefined, notificationsUpdated([
      { id: '1', read: false },
      { id: '2', read: true },
      { id: '3', read: false },
    ]));
    expect(state.items).toHaveLength(3);
    expect(state.unread).toBe(2);
  });
});
