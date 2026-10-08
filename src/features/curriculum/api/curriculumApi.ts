import { apiClient } from '../../../api/client';
import type {
  CourseOffering,
  CreateCourseOfferingRequest,
  FacultyCourseAssignment,
  CreateFacultyAssignmentRequest,
  StudentCourseEnrollment,
  CreateStudentEnrollmentRequest,
} from '../types';

export const curriculumApi = {
  // Course Offerings
  getCourseOfferings: () => apiClient.get<CourseOffering[]>('/admin/course-offerings'),
  createCourseOffering: (data: CreateCourseOfferingRequest) =>
    apiClient.post<CourseOffering>('/admin/course-offerings', data),
  updateCourseOfferingStatus: (id: number, status: CourseOffering['status']) =>
    apiClient.patch<CourseOffering>(`/admin/course-offerings/${id}/status?status=${status}`),
  deleteCourseOffering: (id: number) =>
    apiClient.delete<void>(`/admin/course-offerings/${id}`),

  // Faculty Course Assignments
  getFacultyAssignments: () => apiClient.get<FacultyCourseAssignment[]>('/admin/faculty-course-assignments'),
  createFacultyAssignment: (data: CreateFacultyAssignmentRequest) =>
    apiClient.post<FacultyCourseAssignment>('/admin/faculty-course-assignments', data),
  deleteFacultyAssignment: (id: number) =>
    apiClient.delete<void>(`/admin/faculty-course-assignments/${id}`),

  // Student Course Enrollments
  getStudentEnrollments: () => apiClient.get<StudentCourseEnrollment[]>('/admin/student-course-enrollments'),
  createStudentEnrollment: (data: CreateStudentEnrollmentRequest) =>
    apiClient.post<StudentCourseEnrollment>('/admin/student-course-enrollments', data),
  deleteStudentEnrollment: (id: number) =>
    apiClient.delete<void>(`/admin/student-course-enrollments/${id}`),
};
