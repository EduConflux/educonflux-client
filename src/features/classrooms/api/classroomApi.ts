import { apiClient } from '../../../api/client';
import type { 
  Classroom, 
  ClassroomRequest, 
  ClassroomPost, 
  CreatePostRequest, 
  ChatMessage 
} from '../types';

export const classroomApi = {
  // Faculty Classrooms
  getMyClassrooms: () => apiClient.get<Classroom[]>('/faculty/classrooms'),
  getClassroomById: (id: number) => apiClient.get<Classroom>(`/faculty/classrooms/${id}`),
  createClassroom: (data: ClassroomRequest) => apiClient.post<Classroom>('/faculty/classrooms', data),

  // Posts
  createPost: (classroomId: number, data: CreatePostRequest) => 
    apiClient.post<ClassroomPost>(`/faculty/classrooms/${classroomId}/posts`, data),
  
  getFacultyPosts: (classroomId: number, page: number = 0, size: number = 20) => 
    apiClient.get<any>(`/faculty/classrooms/${classroomId}/posts?page=${page}&size=${size}`),
  
  getStudentPosts: (classroomId: number, page: number = 0, size: number = 20) => 
    apiClient.get<any>(`/student/classrooms/${classroomId}/posts?page=${page}&size=${size}`),

  // Chat History
  getChatHistory: (classroomId: number) => 
    apiClient.get<ChatMessage[]>(`/classrooms/${classroomId}/chat`),
  
  getPrivateChat: (classroomId: number, userId: number) => 
    apiClient.get<ChatMessage[]>(`/classrooms/${classroomId}/chat/private/${userId}`),
};
