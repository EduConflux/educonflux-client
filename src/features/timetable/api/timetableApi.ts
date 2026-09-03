import { apiClient } from '../../../api/client';
import type { TimetableEntry, TimetableEntryRequest } from '../types';

export const timetableApi = {
  // Student Timetable
  getStudentToday: () => apiClient.get<TimetableEntry[]>('/student/timetable/today'),
  getStudentWeekly: () => apiClient.get<TimetableEntry[]>('/student/timetable'),

  // Faculty Timetable
  getFacultyToday: () => apiClient.get<TimetableEntry[]>('/faculty/timetable/today'),
  getFacultyWeekly: () => apiClient.get<TimetableEntry[]>('/faculty/timetable'),

  // Admin Timetable CRUD
  getAllEntries: () => apiClient.get<TimetableEntry[]>('/admin/timetable'),
  getEntryById: (id: number) => apiClient.get<TimetableEntry>(`/admin/timetable/${id}`),
  getByClassSection: (classSectionId: number) => apiClient.get<TimetableEntry[]>(`/admin/timetable/class-section/${classSectionId}`),
  createEntry: (data: TimetableEntryRequest) => apiClient.post<TimetableEntry>('/admin/timetable', data),
  updateEntry: (id: number, data: TimetableEntryRequest) => apiClient.put<TimetableEntry>(`/admin/timetable/${id}`, data),
  updateStatus: (id: number, status: string) => apiClient.patch<TimetableEntry>(`/admin/timetable/${id}/status?status=${status}`),
  deleteEntry: (id: number) => apiClient.delete<void>(`/admin/timetable/${id}`),
};
