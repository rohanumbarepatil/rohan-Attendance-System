import api from './api';

const buildQueryParams = (constraints) => {
  if (!constraints || constraints.length === 0) return '';
  const params = new URLSearchParams();
  constraints.forEach(c => {
    if (c.field && c.val !== undefined) params.append(c.field, c.val);
  });
  const str = params.toString();
  return str ? `?${str}` : '';
};

export const firestoreService = {
  async list(col, constraints = []) {
    const query = buildQueryParams(constraints);
    const res = await api.get(`/${col}${query}`);
    return res.data;
  },

  async get(col, id) {
    const res = await api.get(`/${col}/${id}`);
    return res.data;
  },

  async create(col, data) {
    const res = await api.post(`/${col}`, data);
    return res.data?.id || res.data;
  },

  async set(col, id, data) {
    const res = await api.put(`/${col}/${id}`, data);
    return id;
  },

  async update(col, id, data) {
    await api.put(`/${col}/${id}`, data);
  },

  async remove(col, id) {
    await api.delete(`/${col}/${id}`);
  },

  listen(col, constraints, callback, onError) {
    this.list(col, constraints).then(callback).catch(onError);
    const interval = setInterval(() => {
      this.list(col, constraints).then(callback).catch(onError);
    }, 5000);
    return () => clearInterval(interval);
  },
};

export const where = (field, op, val) => ({ field, op, val });
export const orderBy = (field, dir) => ({ field, dir });
export const limit = (num) => ({ limit: num });
export const serverTimestamp = () => new Date().toISOString();
