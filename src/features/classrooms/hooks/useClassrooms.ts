import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classroomApi } from '../api/classroomApi';
import { queryKeys } from '../../../api/queryKeys';
import type { ClassroomRequest, CreatePostRequest } from '../types';

export function useFacultyClassrooms() {
  return useQuery({
    queryKey: queryKeys.classrooms.facultyList(),
    queryFn: classroomApi.getMyClassrooms,
  });
}

export function useClassroomDetail(id: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.detail(id),
    queryFn: () => classroomApi.getClassroomById(id),
    enabled: id > 0,
  });
}

export function useCreateClassroom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClassroomRequest) => classroomApi.createClassroom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.classrooms.facultyList() });
    },
  });
}

export function useFacultyClassroomPosts(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.facultyPosts(classroomId),
    queryFn: async () => {
      const res = await classroomApi.getFacultyPosts(classroomId);
      return res?.content || (Array.isArray(res) ? res : []);
    },
    enabled: classroomId > 0,
  });
}

export function useStudentClassroomPosts(classroomId: number) {
  return useQuery({
    queryKey: queryKeys.classrooms.studentPosts(classroomId),
    queryFn: async () => {
      const res = await classroomApi.getStudentPosts(classroomId);
      return res?.content || (Array.isArray(res) ? res : []);
    },
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
    refetchInterval: 5000, // background polling fallback for real-time
  });
}
