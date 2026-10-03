import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicApi } from '../api/academicApi';
import { queryKeys } from '../../../api/queryKeys';
import type {
  CreateAcademicYearRequest,
  CreateDepartmentRequest,
  CreateProgramRequest,
  CreateSemesterRequest,
  CreateCourseRequest,
  CreateClassSectionRequest,
  AcademicStatus,
} from '../types';

// Academic Years
export function useAcademicYears() {
  return useQuery({
    queryKey: queryKeys.academic.years(),
    queryFn: academicApi.getAcademicYears,
  });
}

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAcademicYearRequest) => academicApi.createAcademicYear(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.years() });
    },
  });
}

export function useUpdateAcademicYearStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AcademicStatus }) =>
      academicApi.updateAcademicYearStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.years() });
    },
  });
}

// Departments
export function useDepartments() {
  return useQuery({
    queryKey: queryKeys.academic.departments(),
    queryFn: academicApi.getDepartments,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDepartmentRequest) => academicApi.createDepartment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.departments() });
    },
  });
}

export function useUpdateDepartmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AcademicStatus }) =>
      academicApi.updateDepartmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.departments() });
    },
  });
}

// Programs
export function usePrograms() {
  return useQuery({
    queryKey: queryKeys.academic.programs(),
    queryFn: academicApi.getPrograms,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProgramRequest) => academicApi.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.programs() });
    },
  });
}

export function useUpdateProgramStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AcademicStatus }) =>
      academicApi.updateProgramStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.programs() });
    },
  });
}

// Semesters
export function useSemesters() {
  return useQuery({
    queryKey: queryKeys.academic.semesters(),
    queryFn: academicApi.getSemesters,
  });
}

export function useCreateSemester() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSemesterRequest) => academicApi.createSemester(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.semesters() });
    },
  });
}

export function useUpdateSemesterStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AcademicStatus }) =>
      academicApi.updateSemesterStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.semesters() });
    },
  });
}

// Courses
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.academic.courses(),
    queryFn: academicApi.getCourses,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCourseRequest) => academicApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.courses() });
    },
  });
}

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AcademicStatus }) =>
      academicApi.updateCourseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.courses() });
    },
  });
}

// Class Sections
export function useClassSections() {
  return useQuery({
    queryKey: queryKeys.academic.sections(),
    queryFn: academicApi.getClassSections,
  });
}

export function useCreateClassSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateClassSectionRequest) => academicApi.createClassSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.sections() });
    },
  });
}

export function useUpdateClassSectionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AcademicStatus }) =>
      academicApi.updateClassSectionStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.sections() });
    },
  });
}
