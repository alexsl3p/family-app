export interface ShoppingList {
  id: string;
  family_id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ShoppingItem {
  id: string;
  family_id: string;
  list_id: string;
  title: string;
  quantity: string | null;
  unit: string | null;
  estimated_price: number | null;
  created_by: string;
  is_checked: boolean;
  checked_by: string | null;
  checked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateItemInput {
  familyId: string;
  listId: string;
  title: string;
  quantity?: string;
  unit?: string;
  estimatedPrice?: number;
}
