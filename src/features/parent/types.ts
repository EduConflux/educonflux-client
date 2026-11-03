export interface ParentResponse {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  relationship?: string;
  occupation?: string;
  address?: string;
  studentId?: number;
  studentName?: string;
  enrollmentNumber?: string;
}

export interface ParentRequest {
  studentId: number;
  email: string;
  personalEmail: string;
  firstName: string;
  lastName: string;
  phone?: string;
  relationship?: string;
  occupation?: string;
  address?: string;
}

export interface LinkStudentRequest {
  studentId: number;
  relationship?: string;
}

export interface ParentAttendanceSummaryResponse {
  studentId: number;
  studentName: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

