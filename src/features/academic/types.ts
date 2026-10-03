export type AcademicStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED';

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: AcademicStatus;
  // Legacy alias support
  yearName?: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description?: string;
  status: AcademicStatus;
  // Legacy aliases
  departmentCode?: string;
  departmentName?: string;
}

export interface Program {
  id: number;
  code: string;
  name: string;
  description?: string;
  durationYears: number;
  departmentId: number;
  departmentName?: string;
  status: AcademicStatus;
  // Legacy aliases
  programCode?: string;
  programName?: string;
}

export interface Semester {
  id: number;
  name: string;
  semesterNumber: number;
  programId: number;
  programName?: string;
  status: AcademicStatus;
  // Legacy aliases
  semesterName?: string;
  academicYearId?: number;
}

export type CourseType = 'CORE' | 'ELECTIVE' | 'LAB' | 'PROJECT';

export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  courseType: CourseType;
  departmentId: number;
  departmentName?: string;
  programId: number;
  programName?: string;
  semesterId: number;
  semesterName?: string;
  semesterNumber?: number;
  status: AcademicStatus;
  // Legacy aliases
  courseCode?: string;
  courseTitle?: string;
}

export interface ClassSection {
  id: number;
  name: string;
  description?: string;
  semesterId: number;
  semesterName?: string;
  semesterNumber?: number;
  programId?: number;
  programName?: string;
  status: AcademicStatus;
  // Legacy aliases
  sectionName?: string;
  capacity?: number;
  courseId?: number;
}

export interface CreateAcademicYearRequest {
  name: string;
  startDate: string;
  endDate: string;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description?: string;
}

export interface CreateProgramRequest {
  code: string;
  name: string;
  description?: string;
  durationYears: number;
  departmentId: number;
}

export interface CreateSemesterRequest {
  name: string;
  semesterNumber: number;
  programId: number;
}

export interface CreateCourseRequest {
  code: string;
  name: string;
  description?: string;
  credits: number;
  courseType: CourseType;
  departmentId: number;
  programId: number;
  semesterId: number;
}

export interface CreateClassSectionRequest {
  name: string;
  description?: string;
  semesterId: number;
}
