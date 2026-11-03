import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingApi } from '../api/meetingApi';
import { queryKeys } from '../../../api/queryKeys';
import type { CreateMeetingRequest } from '../types';

export function useActiveMeeting(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.meeting.active(classroomId),
    queryFn: () => meetingApi.getActiveMeeting(classroomId),
    enabled: classroomId > 0,
    refetchInterval: 10000, // Poll every 10s to discover newly launched lectures
  });
}

export function useMeetingParticipants(classroomId: number, meetingId: number) {
  return useQuery({
    queryKey: queryKeys.meeting.participants(meetingId),
    queryFn: () => meetingApi.getParticipants(classroomId, meetingId),
    enabled: classroomId > 0 && meetingId > 0,
  });
}

export function useMeetingHistory(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.meeting.history(classroomId),
    queryFn: () => meetingApi.getMeetingHistory(classroomId),
    enabled: classroomId > 0,
  });
}

export function useIceServers(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.meeting.iceServers(classroomId),
    queryFn: () => meetingApi.getIceServers(classroomId),
    enabled: classroomId > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useStartMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, data }: { classroomId: number; data?: CreateMeetingRequest }) =>
      meetingApi.startMeeting(classroomId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(queryKeys.meeting.active(variables.classroomId), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.meeting.all });
    },
  });
}

export function useEndMeeting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classroomId, meetingId }: { classroomId: number; meetingId: number }) =>
      meetingApi.endMeeting(classroomId, meetingId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKeys.meeting.active(variables.classroomId), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.meeting.all });
    },
  });
}

