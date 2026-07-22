import apiClient from './client';
import { Vehicle, CreateVehiclePayload, UpdateVehiclePayload, SearchFilters } from '../types';

export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const res = await apiClient.get('/vehicles');
    return res.data;
  },

  search: async (filters: SearchFilters): Promise<Vehicle[]> => {
    const params = new URLSearchParams();
    if (filters.make) params.append('make', filters.make);
    if (filters.model) params.append('model', filters.model);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    const res = await apiClient.get(`/vehicles/search?${params.toString()}`);
    return res.data;
  },

  create: async (payload: CreateVehiclePayload): Promise<Vehicle> => {
    const res = await apiClient.post('/vehicles', payload);
    return res.data;
  },

  update: async (id: string, payload: UpdateVehiclePayload): Promise<Vehicle> => {
    const res = await apiClient.put(`/vehicles/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`);
  },

  purchase: async (id: string): Promise<{ message: string; vehicle: Vehicle }> => {
    const res = await apiClient.post(`/vehicles/${id}/purchase`);
    return res.data;
  },

  restock: async (id: string, quantity: number): Promise<{ message: string; vehicle: Vehicle }> => {
    const res = await apiClient.post(`/vehicles/${id}/restock`, { quantity });
    return res.data;
  },
};
