import { apiClient } from '../../../api/client';
import type { AcademicYear, Department, Program, Semester, Course, ClassSection } from '../types';

export const academicApi = {
  // Academic Years
  getAcademicYears: () => apiClient.get<AcademicYear[]>('/admin/academic-years'),
  createAcademicYear: (data: Partial<AcademicYear>) => apiClient.post<AcademicYear>('/admin/academic-years', data),

  // Departments
  getDepartments: () => apiClient.get<Department[]>('/admin/departments'),
  createDepartment: (data: Partial<Department>) => apiClient.post<Department>('/admin/departments', data),

  // Programs
  getPrograms: () => apiClient.get<Program[]>('/admin/programs'),
  createProgram: (data: Partial<Program>) => apiClient.post<Program>('/admin/programs', data),

  // Semesters
  getSemesters: () => apiClient.get<Semester[]>('/admin/semesters'),
  createSemester: (data: Partial<Semester>) => apiClient.post<Semester>('/admin/semesters', data),

  // Courses
  getCourses: () => apiClient.get<Course[]>('/admin/courses'),
  createCourse: (data: Partial<Course>) => apiClient.post<Course>('/admin/courses', data),

  // Class Sections
  getClassSections: () => apiClient.get<ClassSection[]>('/admin/class-sections'),
  createClassSection: (data: Partial<ClassSection>) => apiClient.post<ClassSection>('/admin/class-sections', data),
};
