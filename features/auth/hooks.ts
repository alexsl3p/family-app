import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';

export function useMyProfile() {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: api.fetchMyProfile,
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.signOut,
    onSuccess: () => queryClient.clear(),
  });
}
