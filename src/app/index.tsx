import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useInventoryItems } from '@/api/inventory';
import { AppColors } from '@/constants/colors';
import { LoadingView } from '@/components/ui/LoadingView';
import { ErrorView } from '@/components/ui/ErrorView';
import { EmptyView } from '@/components/ui/EmptyView';
import { Pagination } from '@/components/ui/Pagination';
import { ItemCard } from '@/components/ui/ItemCard';
import { HomeHeader } from '@/components/ui/HomeHeader';
import { APP_STRINGS } from '@/constants/strings';


const ITEMS_PER_PAGE = 6;

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
      <HomeHeader
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        isSearchVisible={isSearchVisible}
        onSearchVisibleChange={setIsSearchVisible}
        onAddPress={() => router.push('/create')}
        onCloseSearch={handleCloseSearch}
      />

      {/* Content */}
      {isLoading ? (
        <LoadingView />
      ) : error ? (
        <ErrorView
          message={APP_STRINGS.inventory.errorConnection}
          onRetry={refetch}
        />
      ) : filteredItems.length === 0 ? (
        <EmptyView
          title={searchQuery ? APP_STRINGS.inventory.noResultsTitle : APP_STRINGS.inventory.emptyTitle}
          subtitle={
            searchQuery
              ? APP_STRINGS.inventory.noResultsSubtitle
              : APP_STRINGS.inventory.emptySubtitle
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
});
