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

interface ErrorViewProps {
  message?: string;
  /** If provided, renders a retry button that calls this callback. */
  onRetry?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-screen error state with an icon, message, and optional retry button.
 * Use this when a data-fetch fails and the screen cannot render its content.
 */
export function ErrorView({
  message = 'Something went wrong. Check your connection.',
  onRetry,
}: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Package size={52} color="#D0D0D0" strokeWidth={1.2} />
      <Text style={styles.title}>FAILED TO LOAD</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityLabel="Retry"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>RETRY</Text>
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
  message: {
    fontSize: 13,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: AppColors.text,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 12,
  },
});
