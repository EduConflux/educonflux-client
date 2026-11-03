import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parentApi } from '../api/parentApi';
import { queryKeys } from '../../../api/queryKeys';
import type { ParentRequest, LinkStudentRequest } from '../types';

// ==========================================
// Parent Portal Queries (Logged-in Parent)
// ==========================================

export function useMyStudents() {
  return useQuery({
    queryKey: queryKeys.parent.myStudents(),
    queryFn: parentApi.getMyStudents,
  });
}

export function useStudentAttendanceSummary(studentId: number) {
  return useQuery({
    queryKey: queryKeys.parent.attendanceSummary(studentId),
    queryFn: () => parentApi.getStudentAttendanceSummary(studentId),
    enabled: studentId > 0,
  });
}

export function useStudentAttendanceHistory(studentId: number) {
  return useQuery({
    queryKey: queryKeys.parent.attendanceHistory(studentId),
    queryFn: () => parentApi.getStudentAttendanceHistory(studentId),
    enabled: studentId > 0,
  });
}

export function useStudentAssignments(studentId: number, page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.parent.assignments(studentId, page),
    queryFn: () => parentApi.getStudentAssignments(studentId, page, size),
    enabled: studentId > 0,
  });
}

export function useStudentTodayTimetable(studentId: number) {
  return useQuery({
    queryKey: queryKeys.parent.todayTimetable(studentId),
    queryFn: () => parentApi.getStudentTodayTimetable(studentId),
    enabled: studentId > 0,
  });
}

export function useStudentWeeklyTimetable(studentId: number) {
  return useQuery({
    queryKey: queryKeys.parent.weeklyTimetable(studentId),
    queryFn: () => parentApi.getStudentWeeklyTimetable(studentId),
    enabled: studentId > 0,
  });
}

// ==========================================
// Admin Parent Management Queries & Mutations
// ==========================================

export function useParentsForStudent(studentId: number) {
  return useQuery({
    queryKey: queryKeys.parent.parentsForStudent(studentId),
    queryFn: () => parentApi.getParentsForStudent(studentId),
    enabled: studentId > 0,
  });
}

export function useStudentsForParent(parentId: number) {
  return useQuery({
    queryKey: queryKeys.parent.studentsForParent(parentId),
    queryFn: () => parentApi.getStudentsForParent(parentId),
    enabled: parentId > 0,
  });
}

export function useCreateParent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ParentRequest) => parentApi.createParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parent.all });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'admin'] });
    },
  });
}

export function useLinkStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentId, data }: { parentId: number; data: LinkStudentRequest }) =>
      parentApi.linkStudent(parentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parent.all });
    },
  });
}

