import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { directoryApi } from '../api/directoryApi';
import { queryKeys } from '../../../api/queryKeys';
import type { StudentRequest, FacultyRequest } from '../types';

// Students
export function useStudents() {
  return useQuery({
    queryKey: queryKeys.directory.students(),
    queryFn: directoryApi.getAllStudents,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StudentRequest) => directoryApi.createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directory.students() });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => directoryApi.deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directory.students() });
    },
  });
}

// Faculty
export function useFaculty() {
  return useQuery({
    queryKey: queryKeys.directory.faculty(),
    queryFn: directoryApi.getAllFaculty,
  });
}

export function useCreateFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacultyRequest) => directoryApi.createFaculty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directory.faculty() });
    },
  });
}

export function useDeleteFaculty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => directoryApi.deleteFaculty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.directory.faculty() });
    },
  });
}
