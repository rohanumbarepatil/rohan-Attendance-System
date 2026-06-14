export const isRequired = (v) => (v === undefined || v === null || String(v).trim() === '' ? 'Required' : '');

export const isEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '')) ? '' : 'Invalid email address';

export const minLength = (n) => (v) =>
  String(v || '').length >= n ? '' : `Must be at least ${n} characters`;

export const isDate = (v) =>
  /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')) ? '' : 'Use YYYY-MM-DD format';

/** Strips HTML to mitigate stored XSS in free-text fields. */
export const sanitize = (v) => String(v ?? '').replace(/<[^>]*>/g, '').trim();

export function validate(values, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const error = rule(values[field]);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  }
  return { errors, valid: Object.keys(errors).length === 0 };
}
