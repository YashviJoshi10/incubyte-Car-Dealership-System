import apiClient from './client';
import { AuthResponse } from '../types';

export const authApi = {
  register: async (email: string, password: string, role?: 'ADMIN' | 'USER'): Promise<{ message: string; user: AuthResponse['user'] }> => {
    const res = await apiClient.post('/auth/register', { email, password, role });
    return res.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },
};
