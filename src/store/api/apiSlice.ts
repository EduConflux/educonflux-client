import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'AcademicYear',
    'Department',
    'Program',
    'Semester',
    'Course',
    'ClassSection',
    'Faculty',
    'Student',
    'Attendance',
    'Timetable',
    'User',
    'ClassroomPost',
    'ChatMessage'
  ],
  endpoints: () => ({}),
});
