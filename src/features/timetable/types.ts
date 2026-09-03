export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type TimetableStatus = 'ACTIVE' | 'CANCELLED';

export interface TimetableEntry {
  id: number;
  institutionId?: number;
  classSectionId: number;
  classSectionName?: string;
  courseOfferingId?: number;
  courseId: number;
  courseCode?: string;
  courseName?: string;
  facultyAssignmentId?: number;
  facultyId?: number;
  facultyName?: string;
  facultyEmployeeId?: string;
  programId?: number;
  programName?: string;
  semesterId?: number;
  semesterNumber?: number;
  semesterName?: string;
  academicYearId?: number;
  academicYearName?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
  status: TimetableStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimetableEntryRequest {
  classSectionId: number;
  courseOfferingId?: number;
  courseId: number;
  facultyAssignmentId?: number;
  facultyId?: number;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room: string;
  status?: TimetableStatus;
}
