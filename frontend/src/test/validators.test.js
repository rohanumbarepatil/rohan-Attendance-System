import { describe, it, expect } from 'vitest';
import { isRequired, isEmail, minLength, isDate, sanitize, validate } from '../utils/validators';

describe('input validation & XSS protection', () => {
  it('validates required fields', () => {
    expect(isRequired('')).toBeTruthy();
    expect(isRequired('  ')).toBeTruthy();
    expect(isRequired('value')).toBe('');
  });

  it('validates email format', () => {
    expect(isEmail('student@college.edu')).toBe('');
    expect(isEmail('not-an-email')).toBeTruthy();
  });

  it('validates minimum length', () => {
    expect(minLength(6)('12345')).toBeTruthy();
    expect(minLength(6)('123456')).toBe('');
  });

  it('validates ISO date format', () => {
    expect(isDate('2026-06-12')).toBe('');
    expect(isDate('12/06/2026')).toBeTruthy();
  });

  it('strips HTML tags to prevent stored XSS', () => {
    expect(sanitize('<script>alert(1)</script>Hello')).toBe('alert(1)Hello');
    expect(sanitize('<img src=x onerror=alert(1)>name')).toBe('name');
  });

  it('runs a schema and reports the first failing rule per field', () => {
    const { errors, valid } = validate(
      { email: 'bad', name: '' },
      { email: [isRequired, isEmail], name: [isRequired] }
    );
    expect(valid).toBe(false);
    expect(errors.email).toBeTruthy();
    expect(errors.name).toBeTruthy();
  });
});
