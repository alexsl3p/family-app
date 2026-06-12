import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export function useFamily(familyId: string | null) {
  return useQuery({
    queryKey: ['family', familyId],
    queryFn: () => api.fetchFamily(familyId!),
    enabled: !!familyId,
  });
}

export function useFamilyMembers(familyId: string | null) {
  return useQuery({
    queryKey: ['familyMembers', familyId],
    queryFn: () => api.fetchFamilyMembers(familyId!),
    enabled: !!familyId,
  });
}

export function useCreateFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => api.createFamilyWithDefaults(name),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useJoinFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => api.joinFamilyByCode(code),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useLeaveFamily() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (familyId: string) => api.leaveFamily(familyId),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}

export function useRegenerateInviteCode(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.regenerateInviteCode(familyId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['family', familyId] }),
  });
}
