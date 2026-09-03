export type PostType = 'ANNOUNCEMENT' | 'ASSIGNMENT' | 'MATERIAL' | 'QUESTION';

export interface Classroom {
  id: number;
  institutionId?: number;
  classSectionId?: number;
  courseOfferingId?: number;
  courseTitle?: string;
  sectionCode?: string;
  name: string;
  description?: string;
  room?: string;
  invitationCode?: string;
  archived?: boolean;
  facultyId?: number;
  facultyName?: string;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentClassroomResponse {
  classroomId: number;
  classroomName: string;
  description?: string;
  facultyId?: number;
  facultyName?: string;
  courseId?: number;
  courseCode?: string;
  courseName?: string;
  classSectionId?: number;
  classSectionName?: string;
  status?: string;
}

export interface MembershipResponse {
  membershipId: number;
  classroomId: number;
  classroomName?: string;
  studentId: number;
  studentName: string;
  enrollmentNumber?: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REMOVED';
  joinedAt?: string;
  removedAt?: string;
}

export interface ClassroomRequest {
  classSectionId?: number;
  courseOfferingId?: number;
  name: string;
  description?: string;
  room?: string;
}

export interface ClassroomPost {
  id: number;
  classroomId: number;
  classroomName?: string;
  facultyId?: number;
  facultyName?: string;
  type: PostType;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePostRequest {
  type: PostType;
  title: string;
  content: string;
}

export interface ChatMessage {
  id: number;
  classroomId: number;
  senderId: number;
  senderName: string;
  messageContent: string;
  timestamp: string;
  isPrivate?: boolean;
}

export interface SendChatMessageRequest {
  classroomId: number;
  messageContent: string;
  recipientId?: number;
}
