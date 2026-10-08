import { apiClient } from '../../../api/client';
import type { LearningMaterial, CreateLearningMaterialRequest, StoredFile } from '../types';

export const learningApi = {
  // Faculty: Create learning material
  createMaterial: (classroomId: number, request: CreateLearningMaterialRequest) =>
    apiClient.post<LearningMaterial>(`/faculty/classrooms/${classroomId}/learning-materials`, request),

  // Faculty: Get classroom learning materials
  getFacultyMaterials: async (classroomId: number, page = 0, size = 50): Promise<LearningMaterial[]> => {
    const res = await apiClient.get<any>(`/faculty/classrooms/${classroomId}/learning-materials?page=${page}&size=${size}`);
    return Array.isArray(res) ? res : (res?.content || []);
  },

  // Student: Get classroom learning materials
  getStudentMaterials: async (classroomId: number, page = 0, size = 50): Promise<LearningMaterial[]> => {
    const res = await apiClient.get<any>(`/student/classrooms/${classroomId}/learning-materials?page=${page}&size=${size}`);
    return Array.isArray(res) ? res : (res?.content || []);
  },

  // Faculty: Delete material
  deleteMaterial: (materialId: number) =>
    apiClient.delete<void>(`/faculty/learning-materials/${materialId}`),

  // Files: Upload single file (multipart form data through HttpClient)
  uploadFile: async (file: File): Promise<StoredFile> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<StoredFile>('/files/upload', formData);
  },

  // Files: Get file metadata
  getFileDetails: (fileId: number) =>
    apiClient.get<StoredFile>(`/files/${fileId}`),

  // Files: Get public or presigned URL
  getFileUrl: (fileId: number) =>
    apiClient.get<{ url: string }>(`/files/${fileId}/url`),

  // Files: Authenticated blob download
  downloadFile: (fileId: number, filename?: string) =>
    apiClient.downloadFile(fileId, filename),
};
