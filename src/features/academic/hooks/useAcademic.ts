import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academicApi } from '../api/academicApi';
import { queryKeys } from '../../../api/queryKeys';
import type { AcademicYear, Department, Program, Semester, Course, ClassSection } from '../types';

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
    mutationFn: (data: Partial<AcademicYear>) => academicApi.createAcademicYear(data),
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
    mutationFn: (data: Partial<Department>) => academicApi.createDepartment(data),
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
    mutationFn: (data: Partial<Program>) => academicApi.createProgram(data),
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
    mutationFn: (data: Partial<Semester>) => academicApi.createSemester(data),
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
    mutationFn: (data: Partial<Course>) => academicApi.createCourse(data),
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
    mutationFn: (data: Partial<ClassSection>) => academicApi.createClassSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.academic.sections() });
    },
  });
}
