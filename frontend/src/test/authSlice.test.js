import { describe, it, expect } from 'vitest';
import reducer, { sessionRestored, sessionCleared, clearError } from '../features/auth/authSlice';

describe('auth slice (session management)', () => {
  const initial = reducer(undefined, { type: 'init' });

  it('starts uninitialized and unauthenticated', () => {
    expect(initial.user).toBeNull();
    expect(initial.initialized).toBe(false);
  });

  it('restores a session with role profile', () => {
    const state = reducer(initial, sessionRestored({
      user: { uid: 'u1', email: 'a@b.c' },
      profile: { role: 'ADMIN', active: true },
    }));
    expect(state.user.uid).toBe('u1');
    expect(state.profile.role).toBe('ADMIN');
    expect(state.initialized).toBe(true);
  });

  it('clears the session on sign-out', () => {
    const signedIn = reducer(initial, sessionRestored({ user: { uid: 'u1' }, profile: { role: 'STUDENT' } }));
    const state = reducer(signedIn, sessionCleared());
    expect(state.user).toBeNull();
    expect(state.profile).toBeNull();
  });

  it('clears errors', () => {
    const state = reducer({ ...initial, error: 'boom' }, clearError());
    expect(state.error).toBeNull();
  });
});
