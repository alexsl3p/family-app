import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { CreateTaskInput } from './types';

export function useTasks(familyId: string | null) {
  return useQuery({
    queryKey: ['tasks', familyId],
    queryFn: () => api.fetchTasks(familyId!),
    enabled: !!familyId,
  });
}

export function useCreateTask(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => api.createTask(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });
}

export function useCompleteTask(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.completeTask(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });
}

export function useUncompleteTask(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.uncompleteTask(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });
}

export function useDeleteTask(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => api.deleteTask(taskId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', familyId] }),
  });
}
