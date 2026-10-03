import { apiClient } from '../../../api/client';
import type {
  AcademicYear,
  CreateAcademicYearRequest,
  Department,
  CreateDepartmentRequest,
  Program,
  CreateProgramRequest,
  Semester,
  CreateSemesterRequest,
  Course,
  CreateCourseRequest,
  ClassSection,
  CreateClassSectionRequest,
  AcademicStatus,
} from '../types';

export const academicApi = {
  // Academic Years
  getAcademicYears: () => apiClient.get<AcademicYear[]>('/admin/academic-years'),
  createAcademicYear: (data: CreateAcademicYearRequest) =>
    apiClient.post<AcademicYear>('/admin/academic-years', data),
  updateAcademicYearStatus: (id: number, status: AcademicStatus) =>
    apiClient.patch<AcademicYear>(`/admin/academic-years/${id}/status?status=${status}`),
  deleteAcademicYear: (id: number) => apiClient.delete<void>(`/admin/academic-years/${id}`),

  // Departments
  getDepartments: () => apiClient.get<Department[]>('/admin/departments'),
  createDepartment: (data: CreateDepartmentRequest) =>
    apiClient.post<Department>('/admin/departments', data),
  updateDepartmentStatus: (id: number, status: AcademicStatus) =>
    apiClient.patch<Department>(`/admin/departments/${id}/status?status=${status}`),
  deleteDepartment: (id: number) => apiClient.delete<void>(`/admin/departments/${id}`),

  // Programs
  getPrograms: () => apiClient.get<Program[]>('/admin/programs'),
  getProgramsByDepartment: (departmentId: number) =>
    apiClient.get<Program[]>(`/admin/programs/department/${departmentId}`),
  createProgram: (data: CreateProgramRequest) =>
    apiClient.post<Program>('/admin/programs', data),
  updateProgramStatus: (id: number, status: AcademicStatus) =>
    apiClient.patch<Program>(`/admin/programs/${id}/status?status=${status}`),

  // Semesters
  getSemesters: () => apiClient.get<Semester[]>('/admin/semesters'),
  getSemestersByProgram: (programId: number) =>
    apiClient.get<Semester[]>(`/admin/semesters/program/${programId}`),
  createSemester: (data: CreateSemesterRequest) =>
    apiClient.post<Semester>('/admin/semesters', data),
  updateSemesterStatus: (id: number, status: AcademicStatus) =>
    apiClient.patch<Semester>(`/admin/semesters/${id}/status?status=${status}`),

  // Courses
  getCourses: () => apiClient.get<Course[]>('/admin/courses'),
  getCoursesBySemester: (semesterId: number) =>
    apiClient.get<Course[]>(`/admin/courses/semester/${semesterId}`),
  createCourse: (data: CreateCourseRequest) =>
    apiClient.post<Course>('/admin/courses', data),
  updateCourseStatus: (id: number, status: AcademicStatus) =>
    apiClient.patch<Course>(`/admin/courses/${id}/status?status=${status}`),

  // Class Sections
  getClassSections: () => apiClient.get<ClassSection[]>('/admin/class-sections'),
  getClassSectionsBySemester: (semesterId: number) =>
    apiClient.get<ClassSection[]>(`/admin/class-sections/semester/${semesterId}`),
  createClassSection: (data: CreateClassSectionRequest) =>
    apiClient.post<ClassSection>('/admin/class-sections', data),
  updateClassSectionStatus: (id: number, status: AcademicStatus) =>
    apiClient.patch<ClassSection>(`/admin/class-sections/${id}/status?status=${status}`),
};
