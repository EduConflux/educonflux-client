import { apiClient } from '../../../api/client';
import type { Institution, InstitutionRequest, InstitutionStatus } from '../types';

export const institutionApi = {
  getAll: () => apiClient.get<Institution[]>('/institutions'),
  getById: (id: number) => apiClient.get<Institution>(`/institutions/${id}`),
  create: (data: InstitutionRequest) => apiClient.post<Institution>('/institutions', data),
  update: (id: number, data: InstitutionRequest) => apiClient.put<Institution>(`/institutions/${id}`, data),
  delete: (id: number) => apiClient.delete<void>(`/institutions/${id}`),
  updateStatus: (id: number, status: InstitutionStatus) =>
    apiClient.patch<Institution>(`/institutions/${id}/status?status=${status}`),
};
