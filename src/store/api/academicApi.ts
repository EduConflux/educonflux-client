import { apiSlice } from './apiSlice';

export interface AcademicYear {
  id: number;
  yearName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'UPCOMING';
}

export interface Department {
  id: number;
  departmentCode: string;
  departmentName: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Program {
  id: number;
  programCode: string;
  programName: string;
  departmentId: number;
  departmentName?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Semester {
  id: number;
  semesterName: string;
  academicYearId: number;
  academicYearName?: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'UPCOMING';
}

export interface Course {
  id: number;
  courseCode: string;
  courseTitle: string;
  credits: number;
  departmentId: number;
  departmentName?: string;
  courseType: 'THEORY' | 'LAB' | 'PROJECT';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ClassSection {
  id: number;
  sectionName: string;
  capacity: number;
  courseId: number;
  courseTitle?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const academicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Academic Years
    getAcademicYears: builder.query<AcademicYear[], void>({
      query: () => '/admin/academic-years',
      providesTags: ['AcademicYear'],
    }),
    createAcademicYear: builder.mutation<AcademicYear, Partial<AcademicYear>>({
      query: (data) => ({
        url: '/admin/academic-years',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AcademicYear'],
    }),

    // Departments
    getDepartments: builder.query<Department[], void>({
      query: () => '/admin/departments',
      providesTags: ['Department'],
    }),
    createDepartment: builder.mutation<Department, Partial<Department>>({
      query: (data) => ({
        url: '/admin/departments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),

    // Programs
    getPrograms: builder.query<Program[], void>({
      query: () => '/admin/programs',
      providesTags: ['Program'],
    }),
    createProgram: builder.mutation<Program, Partial<Program>>({
      query: (data) => ({
        url: '/admin/programs',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Program'],
    }),

    // Semesters
    getSemesters: builder.query<Semester[], void>({
      query: () => '/admin/semesters',
      providesTags: ['Semester'],
    }),
    createSemester: builder.mutation<Semester, Partial<Semester>>({
      query: (data) => ({
        url: '/admin/semesters',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Semester'],
    }),

    // Courses
    getCourses: builder.query<Course[], void>({
      query: () => '/admin/courses',
      providesTags: ['Course'],
    }),
    createCourse: builder.mutation<Course, Partial<Course>>({
      query: (data) => ({
        url: '/admin/courses',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Course'],
    }),

    // Class Sections
    getClassSections: builder.query<ClassSection[], void>({
      query: () => '/admin/class-sections',
      providesTags: ['ClassSection'],
    }),
    createClassSection: builder.mutation<ClassSection, Partial<ClassSection>>({
      query: (data) => ({
        url: '/admin/class-sections',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ClassSection'],
    }),
  }),
});

export const {
  useGetAcademicYearsQuery,
  useCreateAcademicYearMutation,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useGetProgramsQuery,
  useCreateProgramMutation,
  useGetSemestersQuery,
  useCreateSemesterMutation,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetClassSectionsQuery,
  useCreateClassSectionMutation,
} = academicApi;
