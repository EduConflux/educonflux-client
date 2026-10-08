export interface Assignment {
  id: number;
  classroomId: number;
  classroomName?: string;
  facultyId: number;
  facultyName?: string;
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  fileId?: number;
  fileName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAssignmentRequest {
  title: string;
  description: string;
  dueDate: string;
  maxMarks: number;
  fileId?: number;
}

export interface AssignmentSubmission {
  id: number;
  assignmentId: number;
  assignmentTitle?: string;
  studentId: number;
  studentName?: string;
  fileId: number;
  fileName?: string;
  fileContentType?: string;
  fileSize?: number;
  fileUrl?: string;
  submittedAt: string;
  marks?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface CreateSubmissionRequest {
  assignmentId: number;
  fileId: number;
}

export interface GradeSubmissionRequest {
  marks: number;
  feedback: string;
}
