import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Package } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EmptyViewProps {
  title: string;
  subtitle?: string;
  /** Label for the optional action button. */
  actionLabel?: string;
  /** Called when the action button is pressed. */
  onAction?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-screen empty state with an icon, title, optional subtitle, and
 * optional action button. Use this when a list or detail has no content.
 *
 * @example
 * <EmptyView
 *   title="NO PRODUCTS"
 *   subtitle="Tap + to add your first item"
 * />
 */
export function EmptyView({ title, subtitle, actionLabel, onAction }: EmptyViewProps) {
  return (
    <View style={styles.container}>
      <Package size={52} color="#D0D0D0" strokeWidth={1.2} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onAction}
          activeOpacity={0.8}
          accessibilityLabel={actionLabel}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>{actionLabel.toUpperCase()}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 32,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: AppColors.text,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: AppColors.text,
    borderRadius: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 12,
  },
});
