export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';

export interface AttendanceResponse {
  id: number;
  studentId: number;
  studentName?: string;
  enrollmentNumber?: string;
  timetableEntryId: number;
  classSectionId?: number;
  classSectionName?: string;
  courseId?: number;
  courseCode?: string;
  courseName?: string;
  facultyId?: number;
  facultyName?: string;
  attendanceDate: string;
  status: AttendanceStatus;
  remarks?: string;
  markedAt?: string;
  updatedAt?: string;
}

export interface MarkAttendanceRequest {
  studentId: number;
  timetableEntryId: number;
  attendanceDate: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface StudentAttendanceSummary {
  presentCount: number;
  absentCount: number;
  lateCount?: number;
  totalClasses: number;
  percentage: number;
}
