import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useInventoryItems } from '@/api/inventory';
import type { InventoryItem } from '@/types/inventory';
import { AppColors } from '@/constants/colors';
import { LoadingView } from '@/components/ui/LoadingView';
import { ErrorView } from '@/components/ui/ErrorView';
import { EmptyView } from '@/components/ui/EmptyView';
import { Plus, Search, Package, X, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEMS_PER_PAGE = 6;

interface ItemCardProps {
  item: InventoryItem;
  onPress: () => void;
}

function ItemCard({ item, onPress }: ItemCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.85 : 1 }]}
      onPress={onPress}
      accessibilityLabel={`View ${item.name}`}
      accessibilityRole="button"
    >
      <View style={styles.cardImageContainer}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Package size={36} color="#CCCCCC" strokeWidth={1.5} />
          </View>
        )}
        <View style={styles.cardAddButton}>
          <Plus size={18} color="#000" strokeWidth={2.5} />
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
}

export default function InventoryScreen() {
  const router = useRouter();
  const { data: items, isLoading, error, refetch } = useInventoryItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredItems = useMemo(() => {
    if (!items) return [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCloseSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(false);
  };

  const handleTouchStart = (e: any) => {
    setTouchStart({
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    });
  };

  const handleTouchEnd = (e: any) => {
    if (!touchStart) return;

    const diffX = e.nativeEvent.pageX - touchStart.x;
    const diffY = e.nativeEvent.pageY - touchStart.y;

    // Trigger swipe if horizontal movement is larger than vertical movement,
    // and horizontal movement exceeds a threshold (e.g. 50 pixels)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swiped right -> go to previous page
        if (currentPage > 1) {
          setCurrentPage((page) => page - 1);
        }
      } else {
        // Swiped left -> go to next page
        if (currentPage < totalPages) {
          setCurrentPage((page) => page + 1);
        }
      }
    }
    setTouchStart(null);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {isSearchVisible ? (
          <View style={styles.searchBar}>
            <Search size={16} color={AppColors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={AppColors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              accessibilityLabel="Search products"
            />
            <Pressable
              onPress={handleCloseSearch}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <X size={16} color={AppColors.textSecondary} />
            </Pressable>
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => setIsSearchVisible(true)}
              accessibilityLabel="Open search"
              accessibilityRole="button"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Search size={22} color={AppColors.text} strokeWidth={1.8} />
            </Pressable>

            <Text style={styles.headerTitle}>INVENTORY</Text>

            <Pressable
              style={({ pressed }) => [styles.addButton, { opacity: pressed ? 0.7 : 1 }]}
              onPress={() => router.push('/create')}
              accessibilityLabel="Add new item"
              accessibilityRole="button"
            >
              <Plus size={22} color={AppColors.text} strokeWidth={2} />
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.divider} />

      {/* Content */}
      {isLoading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView
          message="Check your connection and try again."
          onRetry={refetch}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyView
          title={searchQuery ? 'NO RESULTS' : 'NO PRODUCTS'}
          subtitle={
            searchQuery
              ? 'Try a different search term.'
              : 'Tap + to add your first item.'
          }
        />
      ) : (
        <View 
          style={styles.listContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <FlatList
            data={paginatedItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ItemCard
                item={item}
                onPress={() => router.push(`/${item.id}`)}
              />
            )}
          />

          {totalPages > 1 && (
            <View style={styles.pagination}>
              <Pressable
                style={({ pressed }) => [
                  styles.pageButton,
                  currentPage === 1 && styles.pageButtonDisabled,
                  { opacity: pressed && currentPage !== 1 ? 0.6 : 1 },
                ]}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((page) => Math.max(1, page - 1))}
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
                onPress={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                accessibilityLabel="Next page"
                accessibilityRole="button"
              >
                <ChevronRight size={16} color={AppColors.text} strokeWidth={2} />
              </Pressable>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
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
  listContainer: {
    flex: 1,
  },
  grid: {
    padding: 12,
    paddingBottom: 32,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  card: {
    width: (SCREEN_WIDTH - 48) / 2,
    marginBottom: 24,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: '#F5F5F7',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardAddButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  cardBody: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: AppColors.textSecondary,
    letterSpacing: -0.2,
  },
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
