export type NotificationType =
  | 'ASSIGNMENT_CREATED'
  | 'ASSIGNMENT_GRADED'
  | 'SUBMISSION_RECEIVED'
  | 'CLASSROOM_INVITATION'
  | 'ANNOUNCEMENT'
  | 'TIMETABLE_UPDATE'
  | 'SYSTEM'
  | 'GENERAL';

export interface NotificationItem {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: NotificationType;
  referenceId?: number;
  read: boolean;
  readAt?: string;
  createdAt: string;
}
