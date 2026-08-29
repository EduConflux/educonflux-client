import { apiSlice } from './apiSlice';

export interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName?: string;
  classSectionId: number;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export interface MarkAttendanceRequest {
  classSectionId: number;
  date: string;
  attendanceList: {
    studentId: number;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  }[];
}

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceBySection: builder.query<AttendanceRecord[], { classSectionId: number; date?: string }>({
      query: ({ classSectionId, date }) => 
        `/attendance/section/${classSectionId}${date ? `?date=${date}` : ''}`,
      providesTags: ['Attendance'],
    }),

    getStudentAttendanceSummary: builder.query<{ presentCount: number; absentCount: number; percentage: number }, number>({
      query: (studentId) => `/attendance/student/${studentId}/summary`,
      providesTags: ['Attendance'],
    }),

    markAttendance: builder.mutation<void, MarkAttendanceRequest>({
      query: (data) => ({
        url: '/attendance/mark',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceBySectionQuery,
  useLazyGetAttendanceBySectionQuery,
  useGetStudentAttendanceSummaryQuery,
  useMarkAttendanceMutation,
} = attendanceApi;
