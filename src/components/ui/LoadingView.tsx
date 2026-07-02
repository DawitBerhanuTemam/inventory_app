import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AppColors } from '@/constants/colors';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-screen centered loading indicator.
 * Use this as the sole content of a screen while data is being fetched.
 */
export function LoadingView() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={AppColors.text} />
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
  },
});
