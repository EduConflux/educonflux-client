export type PostType = 'ANNOUNCEMENT' | 'GENERAL' | 'ASSIGNMENT' | 'MATERIAL' | 'QUESTION';

export interface Classroom {
  id: number;
  institutionId?: number;
  classSectionId?: number;
  classSectionName?: string;
  courseOfferingId?: number;
  courseId?: number;
  courseCode?: string;
  courseName?: string;
  // Legacy aliases
  courseTitle?: string;
  sectionCode?: string;
  name: string;
  description?: string;
  room?: string;
  status?: 'ACTIVE' | 'ARCHIVED';
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
  id?: number;
  membershipId?: number;
  classroomId: number;
  classroomName?: string;
  studentId: number;
  studentName?: string;
  enrollmentNumber?: string;
  email?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'REMOVED';
  joinedAt?: string;
  removedAt?: string;
}

export interface ClassroomRequest {
  name: string;
  description?: string;
  courseOfferingId: number;
  classSectionId: number;
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
  content?: string;
  messageContent?: string;
  createdAt?: string;
  timestamp?: string;
  messageType?: string;
  isPrivate?: boolean;
}

export interface SendChatMessageRequest {
  classroomId: number;
  messageContent?: string;
  content?: string;
  recipientId?: number;
}

export interface InvitationResponse {
  id: number;
  classroomId: number;
  classroomName?: string;
  token: string;
  invitationLink?: string;
  createdAt?: string;
  expiresAt?: string;
  active: boolean;
}

export interface CreateInvitationRequest {
  studentIds: number[];
}

export interface JoinClassroomRequest {
  token: string;
}
