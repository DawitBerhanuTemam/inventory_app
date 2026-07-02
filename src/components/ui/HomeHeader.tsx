import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { Search, Plus, X } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import { APP_STRINGS } from '@/constants/strings';

interface HomeHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  isSearchVisible: boolean;
  onSearchVisibleChange: (visible: boolean) => void;
  onAddPress: () => void;
  onCloseSearch: () => void;
}

export function HomeHeader({
  searchQuery,
  onSearchQueryChange,
  isSearchVisible,
  onSearchVisibleChange,
  onAddPress,
  onCloseSearch,
}: HomeHeaderProps) {
  return (
    <>
      <View style={styles.header}>
        {isSearchVisible ? (
          <View style={styles.searchBar}>
            <Search size={16} color={AppColors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={APP_STRINGS.header.searchPlaceholder}
              placeholderTextColor={AppColors.textSecondary}
              value={searchQuery}
              onChangeText={onSearchQueryChange}
              autoFocus
              accessibilityLabel={APP_STRINGS.header.searchAccessibility}
            />
            <Pressable
              onPress={onCloseSearch}
              accessibilityLabel={APP_STRINGS.header.clearSearch}
              accessibilityRole="button"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <X size={16} color={AppColors.textSecondary} />
            </Pressable>
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => onSearchVisibleChange(true)}
              accessibilityLabel={APP_STRINGS.header.openSearch}
              accessibilityRole="button"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Search size={22} color={AppColors.text} strokeWidth={1.8} />
            </Pressable>

            <Text style={styles.headerTitle}>{APP_STRINGS.inventory.title}</Text>

            <Pressable
              style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : 1 }]}
              onPress={onAddPress}
              accessibilityLabel={APP_STRINGS.header.addNewItem}
              accessibilityRole="button"
            >
              <Plus size={22} color={AppColors.text} strokeWidth={2} />
            </Pressable>
          </>
        )}
      </View>
      <View style={styles.divider} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: AppColors.background,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: AppColors.text,
  },
  addButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: AppColors.text,
  },
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
  },
});
