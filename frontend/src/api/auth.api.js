import apiClient from './client';

export const authApi = {
  register: async (email, password, role) => {
    const res = await apiClient.post('/auth/register', { email, password, role });
    return res.data;
  },

  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};
