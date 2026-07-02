import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavHeaderProps {
  title: string;
  onBack: () => void;
  /** Optional content rendered on the right side of the header. */
  right?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Shared navigation header used by the Create, Edit, and Detail screens.
 * Renders a back button on the left, a centered title, and an optional
 * right-side slot for action buttons.
 */
export function NavHeader({ title, onBack, right }: NavHeaderProps) {
  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color={AppColors.text} strokeWidth={1.8} />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightSlot}>
          {right ?? <View style={styles.rightPlaceholder} />}
        </View>
      </View>

      <View style={styles.divider} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: AppColors.text,
  },
  rightSlot: {
    flexDirection: 'row',
    gap: 8,
  },
  rightPlaceholder: {
    width: 36,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
  },
});
