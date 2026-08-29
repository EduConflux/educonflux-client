import { apiSlice } from './apiSlice';

export interface TimetableEntry {
  id: number;
  classSectionId: number;
  classSectionName?: string;
  courseId: number;
  courseTitle?: string;
  facultyId?: number;
  facultyName?: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  startTime: string;
  endTime: string;
  roomNumber: string;
  status: 'ACTIVE' | 'CANCELLED';
}

export const timetableApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTimetableEntries: builder.query<TimetableEntry[], void>({
      query: () => '/admin/timetable',
      providesTags: ['Timetable'],
    }),

    getTimetableByClassSection: builder.query<TimetableEntry[], number>({
      query: (classSectionId) => `/admin/timetable/class-section/${classSectionId}`,
      providesTags: ['Timetable'],
    }),
  }),
});

export const {
  useGetTimetableEntriesQuery,
  useGetTimetableByClassSectionQuery,
} = timetableApi;
