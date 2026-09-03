import { apiClient } from '../../../api/client';
import type { AttendanceResponse, MarkAttendanceRequest } from '../types';

export const attendanceApi = {
  // FACULTY: Mark attendance for a single student or multiple
  markAttendance: (data: MarkAttendanceRequest) => {
    return apiClient.post<AttendanceResponse>('/faculty/attendance', data);
  },

  // FACULTY: View attendance marked for a timetable entry on a given date
  getFacultyAttendance: (timetableEntryId: number, date: string) => {
    return apiClient.get<AttendanceResponse[]>(`/faculty/attendance?timetableEntryId=${timetableEntryId}&date=${date}`);
  },

  // STUDENT: View complete personal attendance
  getStudentAttendance: () => {
    return apiClient.get<AttendanceResponse[]>('/student/attendance');
  },

  // STUDENT: View personal attendance for a specific date
  getStudentAttendanceByDate: (date: string) => {
    return apiClient.get<AttendanceResponse[]>(`/student/attendance/date?date=${date}`);
  },
};
