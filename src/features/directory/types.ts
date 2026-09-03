export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'GRADUATED';
export type FacultyStatus = 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'RETIRED';

export interface Student {
  id: number;
  institutionId?: number;
  programId?: number;
  programName?: string;
  classSectionId?: number;
  classSectionName?: string;
  academicYearId?: number;
  academicYearName?: string;
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  admissionDate?: string;
  status: StudentStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentRequest {
  institutionId?: number;
  programId?: number;
  classSectionId?: number;
  academicYearId?: number;
  enrollmentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  admissionDate?: string;
  status?: StudentStatus;
}

export interface Faculty {
  id: number;
  institutionId?: number;
  departmentId?: number;
  departmentName?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  designation?: string;
  qualification?: string;
  joiningDate?: string;
  status: FacultyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface FacultyRequest {
  institutionId?: number;
  departmentId?: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phone?: string;
  designation?: string;
  qualification?: string;
  joiningDate?: string;
  status?: FacultyStatus;
}
