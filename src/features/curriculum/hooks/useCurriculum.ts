import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { curriculumApi } from '../api/curriculumApi';
import type {
  CreateCourseOfferingRequest,
  CreateFacultyAssignmentRequest,
  CreateStudentEnrollmentRequest,
} from '../types';

export function useCourseOfferings() {
  return useQuery({
    queryKey: ['curriculum', 'offerings'],
    queryFn: () => curriculumApi.getCourseOfferings(),
  });
}

export function useFacultyAssignments() {
  return useQuery({
    queryKey: ['curriculum', 'faculty-assignments'],
    queryFn: () => curriculumApi.getFacultyAssignments(),
  });
}

export function useStudentEnrollments() {
  return useQuery({
    queryKey: ['curriculum', 'student-enrollments'],
    queryFn: () => curriculumApi.getStudentEnrollments(),
  });
}

export function useCreateCourseOfferingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseOfferingRequest) => curriculumApi.createCourseOffering(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', 'offerings'] });
    },
  });
}

export function useUpdateCourseOfferingStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: import('../types').CourseOfferingStatus }) =>
      curriculumApi.updateCourseOfferingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', 'offerings'] });
    },
  });
}

export function useCreateFacultyAssignmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFacultyAssignmentRequest) => curriculumApi.createFacultyAssignment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', 'faculty-assignments'] });
    },
  });
}

export function useCreateStudentEnrollmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateStudentEnrollmentRequest) => curriculumApi.createStudentEnrollment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', 'student-enrollments'] });
    },
  });
}
