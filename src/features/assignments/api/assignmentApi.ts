import { apiClient } from '../../../api/client';
import type { 
  Assignment, 
  CreateAssignmentRequest, 
  AssignmentSubmission, 
  CreateSubmissionRequest, 
  GradeSubmissionRequest 
} from '../types';

export const assignmentApi = {
  // Faculty: Create assignment
  createAssignment: (classroomId: number, request: CreateAssignmentRequest) =>
    apiClient.post<Assignment>(`/faculty/classrooms/${classroomId}/assignments`, request),

  // Faculty: Get classroom assignments
  getFacultyAssignments: async (classroomId: number, page = 0, size = 50): Promise<Assignment[]> => {
    const res = await apiClient.get<any>(`/faculty/classrooms/${classroomId}/assignments?page=${page}&size=${size}`);
    return Array.isArray(res) ? res : (res?.content || []);
  },

  // Student: Get classroom assignments
  getStudentAssignments: async (classroomId: number, page = 0, size = 50): Promise<Assignment[]> => {
    const res = await apiClient.get<any>(`/student/classrooms/${classroomId}/assignments?page=${page}&size=${size}`);
    return Array.isArray(res) ? res : (res?.content || []);
  },

  // Student: Submit assignment
  createSubmission: (request: CreateSubmissionRequest) =>
    apiClient.post<AssignmentSubmission>('/student/assignments/submissions', request),

  // Student: Get own submission
  getMySubmission: (assignmentId: number) =>
    apiClient.get<AssignmentSubmission>(`/student/assignments/${assignmentId}/submission`),

  // Student: Delete/unsubmit own submission
  deleteSubmission: (assignmentId: number) =>
    apiClient.delete<void>(`/student/assignments/${assignmentId}/submission`),

  // Faculty: Get all submissions for an assignment
  getAssignmentSubmissions: (assignmentId: number) =>
    apiClient.get<AssignmentSubmission[]>(`/faculty/assignments/${assignmentId}/submissions`),

  // Faculty: Grade submission
  gradeSubmission: (submissionId: number, request: GradeSubmissionRequest) =>
    apiClient.patch<AssignmentSubmission>(`/faculty/assignments/submissions/${submissionId}/grade`, request),
};
