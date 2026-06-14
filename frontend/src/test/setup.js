import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Firebase SDKs require browser APIs and live config; mock the app-level module
// so unit/component tests run without a Firebase project.
vi.mock('../config/firebase', () => ({
  app: {},
  auth: { currentUser: { uid: 'test-uid', email: 'test@example.com' } },
  db: {},
}));
