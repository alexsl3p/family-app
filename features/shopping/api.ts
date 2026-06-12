import { supabase } from '@/lib/supabase';
import type { CreateItemInput, ShoppingItem, ShoppingList } from './types';

export async function fetchShoppingLists(familyId: string): Promise<ShoppingList[]> {
  const { data, error } = await supabase
    .from('shopping_lists')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchShoppingItems(listId: string): Promise<ShoppingItem[]> {
  const { data, error } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createList(familyId: string, title: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from('shopping_lists').insert({
    family_id: familyId,
    title,
    created_by: userData.user?.id,
  });
  if (error) throw error;
}

export async function createItem(input: CreateItemInput): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const { error } = await supabase.from('shopping_items').insert({
    family_id: input.familyId,
    list_id: input.listId,
    title: input.title,
    quantity: input.quantity ?? null,
    unit: input.unit ?? null,
    estimated_price: input.estimatedPrice ?? null,
    created_by: userData.user?.id,
  });
  if (error) throw error;
}

export async function markItemChecked(itemId: string, checked: boolean): Promise<void> {
  const { error } = await supabase.rpc('mark_shopping_item_checked', {
    p_item_id: itemId,
    p_checked: checked,
  });
  if (error) throw error;
}

export async function clearCheckedItems(listId: string, familyId: string): Promise<void> {
  const { error } = await supabase
    .from('shopping_items')
    .delete()
    .eq('list_id', listId)
    .eq('family_id', familyId)
    .eq('is_checked', true);
  if (error) throw error;
}
