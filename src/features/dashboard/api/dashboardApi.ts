import { apiClient } from '../../../api/client';
import type { AdminDashboardData, FacultyDashboardData, StudentDashboardData } from '../types';

export const dashboardApi = {
  getAdminDashboard: () => apiClient.get<AdminDashboardData>('/admin/dashboard'),
  getFacultyDashboard: () => apiClient.get<FacultyDashboardData>('/faculty/dashboard'),
  getStudentDashboard: () => apiClient.get<StudentDashboardData>('/student/dashboard'),
};
