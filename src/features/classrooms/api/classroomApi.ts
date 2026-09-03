import { apiClient } from '../../../api/client';
import type { 
  Classroom, 
  ClassroomRequest, 
  ClassroomPost, 
  CreatePostRequest, 
  ChatMessage,
  StudentClassroomResponse,
  MembershipResponse,
} from '../types';

export const classroomApi = {
  // Faculty: Get assigned classrooms
  getFacultyClassrooms: () =>
    apiClient.get<Classroom[]>('/faculty/classrooms'),

  // Faculty: Create a classroom
  createClassroom: (request: ClassroomRequest) =>
    apiClient.post<Classroom>('/faculty/classrooms', request),

  // Student: Get enrolled classrooms
  getMyClassrooms: () =>
    apiClient.get<StudentClassroomResponse[]>('/student/classrooms'),

  // Faculty: Get classroom members (students)
  getClassroomMembers: (classroomId: number) =>
    apiClient.get<MembershipResponse[]>(`/faculty/classrooms/${classroomId}/members`),

  // Faculty: Remove student from classroom
  removeStudentFromClassroom: (classroomId: number, studentId: number) =>
    apiClient.patch<void>(`/faculty/classrooms/${classroomId}/members/${studentId}/remove`),

  // Faculty: Get posts for classroom
  getFacultyClassroomPosts: async (classroomId: number, page = 0, size = 20): Promise<ClassroomPost[]> => {
    const res = await apiClient.get<any>(`/faculty/classrooms/${classroomId}/posts?page=${page}&size=${size}`);
    return Array.isArray(res) ? res : (res?.content || []);
  },

  // Student: Get posts for classroom
  getStudentClassroomPosts: async (classroomId: number, page = 0, size = 20): Promise<ClassroomPost[]> => {
    const res = await apiClient.get<any>(`/student/classrooms/${classroomId}/posts?page=${page}&size=${size}`);
    return Array.isArray(res) ? res : (res?.content || []);
  },

  // Faculty: Create post in classroom
  createPost: (classroomId: number, request: CreatePostRequest) =>
    apiClient.post<ClassroomPost>(`/faculty/classrooms/${classroomId}/posts`, request),

  // Chat: Get classroom chat history
  getChatHistory: (classroomId: number) =>
    apiClient.get<ChatMessage[]>(`/classrooms/${classroomId}/chat`),
};
