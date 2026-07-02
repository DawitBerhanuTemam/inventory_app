import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventoryItem, useDeleteItem } from '@/api/inventory';
import { ArrowLeft, Edit2, Trash2, Package } from 'lucide-react-native';

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
  const lowStock = quantity > 0 && quantity < 5;
  const bg = outOfStock ? C.redLight : lowStock ? '#FEF3C7' : C.greenLight;
  const color = outOfStock ? C.red : lowStock ? '#B45309' : C.green;
  const label = outOfStock ? 'OUT OF STOCK' : lowStock ? 'LOW STOCK' : 'IN STOCK';
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/');
  const { data: item, isLoading, error } = useInventoryItem(id as string);
  const deleteMutation = useDeleteItem();

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id as string);
              goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <NavHeader title="PRODUCT" onBack={() => goBack()} />
        <View style={styles.center}><ActivityIndicator size="large" color={C.text} /></View>
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <NavHeader title="PRODUCT" onBack={() => goBack()} />
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <NavHeader
        title="PRODUCT"
        onBack={() => goBack()}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Large Product Image */}
        <View style={styles.imageCard}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Package size={72} color="#D5D5D5" strokeWidth={1} />
            </View>
          )}
        </View>

        {/* Details Section */}
        <View style={styles.detailCard}>
          {/* Name */}
          <Text style={styles.productName}>{item.name.toUpperCase()}</Text>

          {/* Badges */}
          <View style={styles.badgeRow}>
            <StockBadge quantity={item.quantity} />
          </View>

          <View style={styles.hairline} />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>QUANTITY</Text>
              <Text style={styles.statValue}>{item.quantity}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>UNIT PRICE</Text>
              <Text style={styles.statValue}>${item.price.toFixed(2)}</Text>
            </View>

          </View>

          <View style={styles.hairline} />

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.sectionLabel}>DESCRIPTION</Text>
            <Text style={styles.descText}>
              {item.description || 'No description provided.'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push(`/${id}/edit`)}
            activeOpacity={0.85}
          >
            <Edit2 size={16} color={C.text} strokeWidth={1.8} />
            <Text style={styles.editBtnText}>EDIT ITEM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            activeOpacity={0.85}
          >
            <Trash2 size={16} color="#fff" strokeWidth={1.8} />
            <Text style={styles.deleteBtnText}>DELETE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NavHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <>
      <View style={styles.navHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <ArrowLeft size={20} color={C.text} strokeWidth={1.8} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>{title}</Text>
        <View style={styles.navRight}>{right ?? <View style={{ width: 36 }} />}</View>
      </View>
      <View style={styles.hairline} />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  navTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: C.text,
  },
  navRight: { flexDirection: 'row', gap: 8 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hairline: { height: 1, backgroundColor: C.border },
  scroll: { flex: 1 },
  imageCard: {
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
  },
  productImage: { width: '100%', height: 300 },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  detailCard: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: C.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.text,
    padding: 20,
    paddingBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 16,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: C.sub,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.5,
  },
  descSection: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.sub,
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: C.sub,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 32,
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingVertical: 16,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.text,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: C.text,
    borderRadius: 14,
    paddingVertical: 16,
  },
  deleteBtnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#fff',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 14, color: C.red },
});
