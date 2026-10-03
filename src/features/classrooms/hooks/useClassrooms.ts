import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classroomApi } from '../api/classroomApi';
import { queryKeys } from '../../../api/queryKeys';
import type { ClassroomRequest, CreatePostRequest } from '../types';

export function useFacultyClassrooms() {
  return useQuery({
    queryKey: queryKeys.classrooms.facultyList(),
    queryFn: classroomApi.getFacultyClassrooms,
  });
}

export function useStudentClassrooms() {
  return useQuery({
    queryKey: queryKeys.classrooms.studentList(),
    queryFn: classroomApi.getMyClassrooms,
  });
}

export function useClassroomMembers(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.members(classroomId),
    queryFn: () => classroomApi.getClassroomMembers(classroomId),
    enabled: classroomId > 0,
  });
}

export function useRemoveStudentFromClassroom(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentId: number) => classroomApi.removeStudentFromClassroom(classroomId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.members(classroomId) });
    },
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClassroomRequest) => classroomApi.createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.facultyList() });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'faculty'] });
    },
  });
}

export function useArchiveClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (classroomId: number) => classroomApi.archiveClassroom(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.facultyList() });
    },
  });
}

export function useJoinClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => classroomApi.joinClassroom(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.studentList() });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'student'] });
    },
  });
}

export function useCreateInvitation(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentIds: number[]) => classroomApi.createInvitation(classroomId, studentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classrooms', classroomId, 'invitations'] });
    },
  });
}

export function useClassroomInvitations(classroomId: number) {
  return useQuery({
    queryKey: ['classrooms', classroomId, 'invitations'],
    queryFn: () => classroomApi.getClassroomInvitations(classroomId),
    enabled: classroomId > 0,
  });
}

export function useFacultyClassroomPosts(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.facultyPosts(classroomId),
    queryFn: () => classroomApi.getFacultyClassroomPosts(classroomId),
    enabled: classroomId > 0,
  });
}

export function useStudentClassroomPosts(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.studentPosts(classroomId),
    queryFn: () => classroomApi.getStudentClassroomPosts(classroomId),
    enabled: classroomId > 0,
  });
}

export function useCreatePost(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) => classroomApi.createPost(classroomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.facultyPosts(classroomId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.studentPosts(classroomId) });
    },
  });
}

export function useChatHistory(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.chatHistory(classroomId),
    queryFn: () => classroomApi.getChatHistory(classroomId),
    enabled: classroomId > 0,
    refetchInterval: 10000,
  });
}
