import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <View style={styles.pagination}>
      <Pressable
        style={({ pressed }) => [
          styles.pageButton,
          currentPage === 1 && styles.pageButtonDisabled,
          { opacity: pressed && currentPage !== 1 ? 0.6 : 1 },
        ]}
        disabled={currentPage === 1}
        onPress={() => onPageChange(Math.max(1, currentPage - 1))}
        accessibilityLabel="Previous page"
        accessibilityRole="button"
      >
        <ChevronLeft size={16} color={AppColors.text} strokeWidth={2} />
      </Pressable>

      <Text style={styles.pageIndicator}>
        {currentPage} / {totalPages}
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.pageButton,
          currentPage === totalPages && styles.pageButtonDisabled,
          { opacity: pressed && currentPage !== totalPages ? 0.6 : 1 },
        ]}
        disabled={currentPage === totalPages}
        onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        accessibilityLabel="Next page"
        accessibilityRole="button"
      >
        <ChevronRight size={16} color={AppColors.text} strokeWidth={2} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: AppColors.background,
  },
  pageButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  pageButtonDisabled: {
    opacity: 0.2,
  },
  pageIndicator: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AppColors.textSecondary,
  },
});
