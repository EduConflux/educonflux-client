import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '../api/attendanceApi';
import { queryKeys } from '../../../api/queryKeys';
import type { AttendanceResponse, MarkAttendanceRequest, StudentAttendanceSummary } from '../types';

export function useFacultyAttendance(timetableEntryId: number, date: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.attendance.facultyByEntry(timetableEntryId, date),
    queryFn: () => attendanceApi.getFacultyAttendance(timetableEntryId, date),
    enabled: options?.enabled !== false && timetableEntryId > 0 && !!date,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceRequest) => attendanceApi.markAttendance(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.facultyByEntry(variables.timetableEntryId, variables.attendanceDate),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendance.studentAll(),
      });
    },
  });
}

export function useStudentAttendance() {
  const query = useQuery({
    queryKey: queryKeys.attendance.studentAll(),
    queryFn: attendanceApi.getStudentAttendance,
  });

  const records: AttendanceResponse[] = query.data || [];
  const totalClasses = records.length;
  const presentCount = records.filter(r => r.status === 'PRESENT').length;
  const absentCount = records.filter(r => r.status === 'ABSENT').length;
  const lateCount = records.filter(r => r.status === 'LATE').length;
  const percentage = totalClasses > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalClasses) * 100) : 100;

  const summary: StudentAttendanceSummary = {
    totalClasses,
    presentCount,
    absentCount,
    lateCount,
    percentage,
  };

  return {
    ...query,
    records,
    summary,
  };
}

export function useStudentAttendanceByDate(date: string) {
  return useQuery({
    queryKey: queryKeys.attendance.studentByDate(date),
    queryFn: () => attendanceApi.getStudentAttendanceByDate(date),
    enabled: !!date,
  });
}
