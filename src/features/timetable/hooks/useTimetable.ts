import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timetableApi } from '../api/timetableApi';
import { queryKeys } from '../../../api/queryKeys';
import type { TimetableEntryRequest } from '../types';

// Student
export function useStudentTodayTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.studentToday(),
    queryFn: timetableApi.getStudentToday,
  });
}

export function useStudentWeeklyTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.studentWeekly(),
    queryFn: timetableApi.getStudentWeekly,
  });
}

// Faculty
export function useFacultyTodayTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.facultyToday(),
    queryFn: timetableApi.getFacultyToday,
  });
}

export function useFacultyWeeklyTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.facultyWeekly(),
    queryFn: timetableApi.getFacultyWeekly,
  });
}

// Admin
export function useAdminTimetable() {
  return useQuery({
    queryKey: queryKeys.timetable.adminAll(),
    queryFn: timetableApi.getAllEntries,
  });
}

export function useClassSectionTimetable(classSectionId: number) {
  return useQuery({
    queryKey: queryKeys.timetable.bySection(classSectionId),
    queryFn: () => timetableApi.getByClassSection(classSectionId),
    enabled: classSectionId > 0,
  });
}

export function useCreateTimetableEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TimetableEntryRequest) => timetableApi.createEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timetable.all });
    },
  });
}

export function useUpdateTimetableStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => timetableApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timetable.all });
    },
  });
}

export function useDeleteTimetableEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => timetableApi.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.timetable.all });
    },
  });
}
