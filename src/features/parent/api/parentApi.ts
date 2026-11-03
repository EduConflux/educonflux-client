import { apiClient } from '../../../api/client';
import type {
  ParentResponse,
  ParentRequest,
  LinkStudentRequest,
  ParentAttendanceSummaryResponse,
} from '../types';
import type { AttendanceResponse } from '../../attendance/types';
import type { Assignment } from '../../assignments/types';
import type { TimetableEntry } from '../../timetable/types';
import type { PageResponse } from '../../users/types';

export const parentApi = {
  // Parent Portal endpoints (/api/parents/me/...)
  getMyStudents: () => apiClient.get<ParentResponse[]>('/parents/me/students'),

  getStudentAttendanceSummary: (studentId: number) =>
    apiClient.get<ParentAttendanceSummaryResponse>(
      `/parents/me/students/${studentId}/attendance/summary`
    ),

  getStudentAttendanceHistory: (studentId: number) =>
    apiClient.get<AttendanceResponse[]>(
      `/parents/me/students/${studentId}/attendance`
    ),

  getStudentAssignments: (studentId: number, page = 0, size = 20) =>
    apiClient.get<PageResponse<Assignment>>(
      `/parents/me/students/${studentId}/assignments?page=${page}&size=${size}`
    ),

  getStudentTodayTimetable: (studentId: number) =>
    apiClient.get<TimetableEntry[]>(
      `/parents/me/students/${studentId}/timetable/today`
    ),

  getStudentWeeklyTimetable: (studentId: number) =>
    apiClient.get<TimetableEntry[]>(
      `/parents/me/students/${studentId}/timetable`
    ),

  // Admin Management endpoints (/api/parents/...)
  createParent: (data: ParentRequest) =>
    apiClient.post<ParentResponse>('/parents', data),

  linkStudent: (parentId: number, data: LinkStudentRequest) =>
    apiClient.post<ParentResponse>(`/parents/${parentId}/students`, data),

  getParentsForStudent: (studentId: number) =>
    apiClient.get<ParentResponse[]>(`/parents/student/${studentId}`),

  getStudentsForParent: (parentId: number) =>
    apiClient.get<ParentResponse[]>(`/parents/${parentId}/students`),
};

