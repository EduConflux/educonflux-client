import { apiClient } from '../../../api/client';
import type {
  ClassroomMeetingResponse,
  CreateMeetingRequest,
  MeetingParticipantResponse,
  IceServerResponse,
} from '../types';

export const meetingApi = {
  startMeeting: (classroomId: number, data?: CreateMeetingRequest) =>
    apiClient.post<ClassroomMeetingResponse>(`/classrooms/${classroomId}/meetings`, {
      title: data?.title || 'Classroom Live Lecture',
      allowStudentUnmute: data?.allowStudentUnmute ?? true,
      allowStudentScreenShare: data?.allowStudentScreenShare ?? false,
      scheduledStartTime: data?.scheduledStartTime,
    }),

  getActiveMeeting: (classroomId: number) =>
    apiClient.get<ClassroomMeetingResponse | null>(`/classrooms/${classroomId}/meetings/active`),

  endMeeting: (classroomId: number, meetingId: number) =>
    apiClient.post<ClassroomMeetingResponse>(`/classrooms/${classroomId}/meetings/${meetingId}/end`, {}),

  getParticipants: (classroomId: number, meetingId: number) =>
    apiClient.get<MeetingParticipantResponse[]>(
      `/classrooms/${classroomId}/meetings/${meetingId}/participants`
    ),

  getMeetingHistory: (classroomId: number) =>
    apiClient.get<ClassroomMeetingResponse[]>(`/classrooms/${classroomId}/meetings/history`),

  getIceServers: (classroomId: number) =>
    apiClient.get<IceServerResponse[]>(`/classrooms/${classroomId}/meetings/ice-servers`),
};
