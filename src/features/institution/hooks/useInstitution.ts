import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { institutionApi } from '../api/institutionApi';
import type { InstitutionRequest, InstitutionStatus } from '../types';

export function useInstitutions() {
  return useQuery({
    queryKey: ['institutions'],
    queryFn: institutionApi.getAll,
  });
}

export function useInstitution(id: number) {
  return useQuery({
    queryKey: ['institutions', id],
    queryFn: () => institutionApi.getById(id),
    enabled: id > 0,
  });
}

export function useUpdateInstitution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: InstitutionRequest }) =>
      institutionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
  });
}

export function useUpdateInstitutionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: InstitutionStatus }) =>
      institutionApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
    },
  });
}
