import { apiClient } from '../../../api/client';
import type { Student, StudentRequest, Faculty, FacultyRequest } from '../types';

export const directoryApi = {
  // Students
  getAllStudents: () => apiClient.get<Student[]>('/admin/students'),
  getStudentById: (id: number) => apiClient.get<Student>(`/admin/students/${id}`),
  getStudentsBySection: (sectionId: number) => apiClient.get<Student[]>(`/admin/students/section/${sectionId}`),
  createStudent: (data: StudentRequest) => apiClient.post<Student>('/admin/students', data),
  updateStudent: (id: number, data: StudentRequest) => apiClient.put<Student>(`/admin/students/${id}`, data),
  deleteStudent: (id: number) => apiClient.delete<void>(`/admin/students/${id}`),

  // Faculty
  getAllFaculty: () => apiClient.get<Faculty[]>('/admin/faculty'),
  getFacultyById: (id: number) => apiClient.get<Faculty>(`/admin/faculty/${id}`),
  getFacultyByDepartment: (deptId: number) => apiClient.get<Faculty[]>(`/admin/faculty/department/${deptId}`),
  createFaculty: (data: FacultyRequest) => apiClient.post<Faculty>('/admin/faculty', data),
  updateFaculty: (id: number, data: FacultyRequest) => apiClient.put<Faculty>(`/admin/faculty/${id}`, data),
  deleteFaculty: (id: number) => apiClient.delete<void>(`/admin/faculty/${id}`),
};
