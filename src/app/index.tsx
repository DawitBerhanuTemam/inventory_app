import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useInventoryItems, InventoryItem } from '@/api/inventory';
import { Plus, Search, Package, X, ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_SIZE = (width - 48) / 2;
const ITEMS_PER_PAGE = 6;

const C = {
  bg: '#F2F2F2',
  card: '#FFFFFF',
  text: '#0A0A0A',
  sub: '#7A7A7A',
  border: '#E5E5E5',
  green: '#2D7A47',
  greenLight: '#EBF5EE',
  red: '#C0392B',
  redLight: '#FCECEA',
};

function StockBadge({ quantity }: { quantity: number }) {
  const outOfStock = quantity === 0;
  return (
    <View style={[styles.stockBadge, { backgroundColor: outOfStock ? C.redLight : C.greenLight }]}>
      <Text style={[styles.stockBadgeText, { color: outOfStock ? C.red : C.green }]}>
        {outOfStock ? 'OUT OF STOCK' : `${quantity} IN STOCK`}
      </Text>
    </View>
  );
}

function ItemCard({ item, onPress }: { item: InventoryItem; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardImageWrap}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Package size={36} color="#CCCCCC" strokeWidth={1.5} />
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name.toUpperCase()}</Text>
        <StockBadge quantity={item.quantity} />
        <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function InventoryScreen() {
  const router = useRouter();
  const { data: items, isLoading, error, refetch } = useInventoryItems();
  const [search, setSearch] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (!search.trim()) return items;
    return items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {searchVisible ? (
          <View style={styles.searchBar}>
            <Search size={16} color={C.sub} style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor={C.sub}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            <TouchableOpacity onPress={() => { setSearch(''); setSearchVisible(false); }}>
              <X size={16} color={C.sub} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={() => setSearchVisible(true)} activeOpacity={0.7}>
              <Search size={22} color={C.text} strokeWidth={1.8} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>INVENTORY</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('/create')}
              activeOpacity={0.7}
            >
              <Plus size={22} color={C.text} strokeWidth={2} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.divider} />

      {/* Content */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.text} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Package size={52} color="#D0D0D0" strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>FAILED TO LOAD</Text>
          <Text style={styles.emptySub}>Check your connection</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => refetch()}>
            <Text style={styles.retryText}>RETRY</Text>
          </TouchableOpacity>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Package size={52} color="#D0D0D0" strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>
            {search ? 'NO RESULTS' : 'NO PRODUCTS'}
          </Text>
          <Text style={styles.emptySub}>
            {search ? 'Try a different search term' : 'Tap + to add your first item'}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={paginatedItems}
            keyExtractor={i => i.id}
            numColumns={2}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ItemCard item={item} onPress={() => router.push(`/${item.id}`)} />
            )}
          />
          {totalPages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} color={C.text} strokeWidth={2} />
              </TouchableOpacity>
              <Text style={styles.pageText}>
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={16} color={C.text} strokeWidth={2} />
              </TouchableOpacity>
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
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: C.bg,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: C.text,
  },
  addBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: C.text,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },
  grid: {
    padding: 12,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: C.card,
    borderRadius: 16,
    marginBottom: CARD_MARGIN,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  cardImageWrap: {
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: '#F8F8F8',
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
  cardInfo: {
    padding: 12,
  },
  cardName: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: C.text,
    marginBottom: 8,
    lineHeight: 16,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginBottom: 7,
  },
  stockBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.3,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 32,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: C.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: C.sub,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: C.text,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 12,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingBottom: 20,
    backgroundColor: C.bg,
  },
  pageBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  pageBtnDisabled: {
    opacity: 0.2,
  },
  pageText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.sub,
  },
});
