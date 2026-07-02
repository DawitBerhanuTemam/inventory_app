/**
 * Core domain types for the inventory feature.
 * All API hooks and UI components should import from here.
 */

// ---------------------------------------------------------------------------
// Entity types
// ---------------------------------------------------------------------------

export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  image_url: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// API input types
// ---------------------------------------------------------------------------

/** Fields required when creating a new inventory item. */
export type CreateInventoryItemInput = Omit<InventoryItem, 'id' | 'created_at'>;

/** Fields accepted when updating an existing inventory item. */
export type UpdateInventoryItemInput = Partial<CreateInventoryItemInput>;

// ---------------------------------------------------------------------------
// Form types
// ---------------------------------------------------------------------------

/** Values produced by the InventoryForm component after validation. */
export type InventoryFormValues = {
  name: string;
  description: string;
  quantity: number;
  price: number;
};
