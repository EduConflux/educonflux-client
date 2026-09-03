import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningApi } from '../api/learningApi';
import { queryKeys } from '../../../api/queryKeys';
import type { CreateLearningMaterialRequest } from '../types';

export function useClassroomMaterials(classroomId: number, role: 'faculty' | 'student') {
  return useQuery({
    queryKey: queryKeys.learning.classroom(classroomId, role),
    queryFn: () => role === 'faculty'
      ? learningApi.getFacultyMaterials(classroomId)
      : learningApi.getStudentMaterials(classroomId),
    enabled: !!classroomId,
  });
}

export function useCreateMaterial(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateLearningMaterialRequest) =>
      learningApi.createMaterial(classroomId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.learning.classroom(classroomId, 'faculty') });
      queryClient.invalidateQueries({ queryKey: queryKeys.learning.classroom(classroomId, 'student') });
    },
  });
}

export function useDeleteMaterial(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (materialId: number) =>
      learningApi.deleteMaterial(materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.learning.classroom(classroomId, 'faculty') });
      queryClient.invalidateQueries({ queryKey: queryKeys.learning.classroom(classroomId, 'student') });
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => learningApi.uploadFile(file),
  });
}
