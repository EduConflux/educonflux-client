export type CurriculumStatus = 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface CourseOffering {
  id: number;
  institutionId?: number;
  courseId: number;
  courseName?: string;
  courseCode?: string;
  academicYearId: number;
  academicYearName?: string;
  semesterId: number;
  semesterName?: string;
  status: CurriculumStatus;
  createdAt?: string;
}

export interface CreateCourseOfferingRequest {
  courseId: number;
  academicYearId: number;
  semesterId: number;
}

export interface FacultyCourseAssignment {
  id: number;
  courseOfferingId: number;
  courseName?: string;
  courseCode?: string;
  facultyId: number;
  facultyName?: string;
  facultyEmployeeId?: string;
  classSectionId: number;
  classSectionName?: string;
  role?: string;
  status: CurriculumStatus;
  createdAt?: string;
}

export interface CreateFacultyAssignmentRequest {
  courseOfferingId: number;
  facultyId: number;
  classSectionId: number;
  role?: string;
}

export interface StudentCourseEnrollment {
  id: number;
  courseOfferingId: number;
  courseName?: string;
  courseCode?: string;
  studentId: number;
  studentName?: string;
  enrollmentNumber?: string;
  classSectionId: number;
  classSectionName?: string;
  status: CurriculumStatus;
  enrolledAt?: string;
}

export interface CreateStudentEnrollmentRequest {
  courseOfferingId: number;
  studentId: number;
  classSectionId: number;
}
