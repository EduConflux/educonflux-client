import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'admin'],
    queryFn: () => dashboardApi.getAdminDashboard(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useFacultyDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'faculty'],
    queryFn: () => dashboardApi.getFacultyDashboard(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'student'],
    queryFn: () => dashboardApi.getStudentDashboard(),
    staleTime: 1000 * 60 * 2,
  });
}
