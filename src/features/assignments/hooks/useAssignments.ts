import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentApi } from '../api/assignmentApi';
import { queryKeys } from '../../../api/queryKeys';
import type { CreateAssignmentRequest, CreateSubmissionRequest, GradeSubmissionRequest } from '../types';

export function useClassroomAssignments(classroomId: number, role: 'faculty' | 'student') {
  return useQuery({
    queryKey: queryKeys.assignments.classroom(classroomId, role),
    queryFn: () => role === 'faculty'
      ? assignmentApi.getFacultyAssignments(classroomId)
      : assignmentApi.getStudentAssignments(classroomId),
    enabled: !!classroomId,
  });
}

export function useCreateAssignment(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateAssignmentRequest) =>
      assignmentApi.createAssignment(classroomId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.classroom(classroomId, 'faculty') });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.classroom(classroomId, 'student') });
    },
  });
}

export function useStudentSubmission(assignmentId: number) {
  return useQuery({
    queryKey: queryKeys.assignments.mySubmission(assignmentId),
    queryFn: () => assignmentApi.getMySubmission(assignmentId),
    enabled: !!assignmentId,
    retry: false, // May 404 if not submitted yet
  });
}

export function useAssignmentSubmissions(assignmentId: number) {
  return useQuery({
    queryKey: queryKeys.assignments.submissions(assignmentId),
    queryFn: () => assignmentApi.getAssignmentSubmissions(assignmentId),
    enabled: !!assignmentId,
  });
}

export function useSubmitAssignment(classroomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateSubmissionRequest) =>
      assignmentApi.createSubmission(request),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.mySubmission(vars.assignmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.submissions(vars.assignmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.classroom(classroomId, 'student') });
    },
  });
}

export function useGradeSubmission(assignmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: number; data: GradeSubmissionRequest }) =>
      assignmentApi.gradeSubmission(submissionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.submissions(assignmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.mySubmission(assignmentId) });
    },
  });
}

export function useDeleteSubmission(classroomId: number, assignmentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => assignmentApi.deleteSubmission(assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.mySubmission(assignmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.submissions(assignmentId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.assignments.classroom(classroomId, 'student') });
    },
  });
}
