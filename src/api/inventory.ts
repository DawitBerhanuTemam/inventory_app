import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Re-export all types from the dedicated types module.
// This preserves backward compatibility for any imports from '@/api/inventory'.
export type {
  InventoryItem,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  InventoryFormValues,
} from '@/types/inventory';

import type { InventoryItem, CreateInventoryItemInput, UpdateInventoryItemInput } from '@/types/inventory';

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetches the full list of inventory items, ordered by creation date. */
export const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as InventoryItem[];
    },
  });
};

/** Fetches a single inventory item by ID. */
export const useInventoryItem = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as InventoryItem;
    },
    enabled: !!id,
  });
};

/** Creates a new inventory item and invalidates the inventory list cache. */
export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: CreateInventoryItemInput) => {
      const { data, error } = await supabase
        .from('inventory')
        .insert([newItem])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

/** Updates an existing inventory item and invalidates relevant caches. */
export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: UpdateInventoryItemInput;
    }) => {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data as InventoryItem;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', variables.id] });
    },
  });
};

/** Deletes an inventory item by ID and invalidates the inventory list cache. */
export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('inventory').delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
