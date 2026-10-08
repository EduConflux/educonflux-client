export interface LearningMaterial {
  id: number;
  classroomId: number;
  classroomName?: string;
  facultyId: number;
  facultyName?: string;
  title: string;
  description: string;
  fileId?: number;
  fileName?: string;
  category?: 'Lecture Notes' | 'Syllabus & Docs' | 'Lab Manuals' | 'Reference Books' | 'General';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLearningMaterialRequest {
  title: string;
  description: string;
  fileId?: number;
}

export interface StoredFile {
  id: number;
  originalName: string;
  storedName: string;
  fileUrl: string;
  contentType: string;
  fileSize: number;
  createdAt?: string;
}
