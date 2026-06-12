import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { CreateItemInput, ShoppingItem } from './types';

export function useShoppingLists(familyId: string | null) {
  return useQuery({
    queryKey: ['shoppingLists', familyId],
    queryFn: () => api.fetchShoppingLists(familyId!),
    enabled: !!familyId,
  });
}

export function useShoppingItems(listId: string | null) {
  return useQuery({
    queryKey: ['shoppingItems', listId],
    queryFn: () => api.fetchShoppingItems(listId!),
    enabled: !!listId,
  });
}

export function useCreateList(familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => api.createList(familyId!, title),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shoppingLists', familyId] }),
  });
}

export function useCreateItem(listId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateItemInput) => api.createItem(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shoppingItems', listId] }),
  });
}

// Оптимистичный апдейт: отметка работает мгновенно даже без сети
export function useMarkItemChecked(listId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, checked }: { itemId: string; checked: boolean }) =>
      api.markItemChecked(itemId, checked),
    onMutate: async ({ itemId, checked }) => {
      await queryClient.cancelQueries({ queryKey: ['shoppingItems', listId] });
      const previous = queryClient.getQueryData<ShoppingItem[]>(['shoppingItems', listId]);
      queryClient.setQueryData<ShoppingItem[]>(['shoppingItems', listId], (old) =>
        (old ?? []).map((i) => (i.id === itemId ? { ...i, is_checked: checked } : i)),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['shoppingItems', listId], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['shoppingItems', listId] }),
  });
}

export function useClearChecked(listId: string | null, familyId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.clearCheckedItems(listId!, familyId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shoppingItems', listId] }),
  });
}
