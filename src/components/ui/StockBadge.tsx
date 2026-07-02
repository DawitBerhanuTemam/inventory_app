import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StockBadgeProps {
  quantity: number;
}

type StockStatus = 'out_of_stock' | 'low_stock' | 'in_stock';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const LOW_STOCK_THRESHOLD = 5;

function getStockStatus(quantity: number): StockStatus {
  if (quantity === 0) return 'out_of_stock';
  if (quantity < LOW_STOCK_THRESHOLD) return 'low_stock';
  return 'in_stock';
}

const STOCK_STATUS_CONFIG: Record<
  StockStatus,
  { label: string; backgroundColor: string; color: string }
> = {
  out_of_stock: {
    label: 'OUT OF STOCK',
    backgroundColor: AppColors.dangerLight,
    color: AppColors.danger,
  },
  low_stock: {
    label: 'LOW STOCK',
    backgroundColor: AppColors.warningLight,
    color: AppColors.warning,
  },
  in_stock: {
    label: 'IN STOCK',
    backgroundColor: AppColors.successLight,
    color: AppColors.success,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Displays a colored pill badge indicating an item's stock status.
 * Three states: out-of-stock (red), low-stock (amber), in-stock (green).
 */
export function StockBadge({ quantity }: StockBadgeProps) {
  const status = getStockStatus(quantity);
  const { label, backgroundColor, color } = STOCK_STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});
