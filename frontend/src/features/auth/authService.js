import api from '../../services/api';

export const authService = {
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    
    // Parse JWT to get user info
    const tokenParts = res.data.accessToken.split('.');
    const payload = JSON.parse(atob(tokenParts[1]));
    
    return {
      uid: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  },

  async logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  },

  async resetPassword(email) {
    await api.post('/auth/reset-password', { email });
  },

  async verifyEmail() {
    await api.post('/auth/verify-email');
  },

  async fetchProfile(uid) {
    const res = await api.get(`/users/${uid}`);
    return res.data;
  },

  async touchLastLogin(uid) {
    try {
      await api.put(`/users/${uid}/touch`);
    } catch { /* non-critical */ }
  },

  observe(callback) {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      callback({
        uid: payload.sub,
        email: payload.email,
        emailVerified: true
      });
    } else {
      callback(null);
    }
    return () => {}; // Cleanup function mock
  },
};
