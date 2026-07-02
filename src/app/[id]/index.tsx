import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInventoryItem, useDeleteItem } from '@/api/inventory';
import { AppColors } from '@/constants/colors';
import { APP_STRINGS } from '@/constants/strings';
import { NavHeader } from '@/components/ui/NavHeader';
import { StockBadge } from '@/components/ui/StockBadge';
import { LoadingView } from '@/components/ui/LoadingView';
import { ErrorView } from '@/components/ui/ErrorView';
import { Edit2, Trash2, Package } from 'lucide-react-native';

/**
 * Detail screen showing all fields for a single inventory item,
 * with actions to navigate to the edit screen or delete the item.
 */
export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const { data: item, isLoading, error } = useInventoryItem(id as string);
  const deleteMutation = useDeleteItem();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = async () => {
    const confirmed =
      Platform.OS === 'web'
        ? true
        : await new Promise<boolean>((resolve) =>
          Alert.alert(
            APP_STRINGS.itemDetail.deleteAlertTitle,
            APP_STRINGS.itemDetail.deleteAlertMessage,
            [
              { text: APP_STRINGS.itemDetail.deleteAlertCancel, style: 'cancel', onPress: () => resolve(false) },
              { text: APP_STRINGS.itemDetail.deleteAlertConfirm, style: 'destructive', onPress: () => resolve(true) },
            ]
          )
        );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(id as string);
      goBack();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : APP_STRINGS.itemDetail.deleteErrorDefault;
      if (Platform.OS === 'web') {
        window.alert(`${APP_STRINGS.itemDetail.errorTitle}: ${message}`);
      } else {
        Alert.alert(APP_STRINGS.itemDetail.errorTitle, message);
      }
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <NavHeader title={APP_STRINGS.itemDetail.screenTitle} onBack={goBack} />
        <LoadingView />
      </SafeAreaView>
    );
  }

  if (error || !item) {
    return (
      <SafeAreaView style={styles.root} edges={['top']}>
        <NavHeader title={APP_STRINGS.itemDetail.screenTitle} onBack={goBack} />
        <ErrorView message={APP_STRINGS.itemDetail.loadErrorMessage} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <NavHeader title={APP_STRINGS.itemDetail.screenTitle} onBack={goBack} />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Product image */}
        <View style={styles.imageCard}>
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Package size={72} color="#D5D5D5" strokeWidth={1} />
            </View>
          )}
        </View>

        {/* Details card */}
        <View style={styles.detailCard}>
          <Text style={styles.productName}>{item.name.toUpperCase()}</Text>

          <View style={styles.badgeRow}>
            <StockBadge quantity={item.quantity} />
          </View>

          <View style={styles.hairline} />

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>{APP_STRINGS.itemDetail.quantityLabel}</Text>
              <Text style={styles.statValue}>{item.quantity}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Text style={styles.statLabel}>{APP_STRINGS.itemDetail.priceLabel}</Text>
              <Text style={styles.statValue}>${item.price.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.hairline} />

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>{APP_STRINGS.itemDetail.descriptionLabel}</Text>
            <Text style={styles.descriptionText}>
              {isExpanded
                ? (item.description || APP_STRINGS.itemDetail.noDescription)
                : (item.description
                  ? (item.description.length > 150
                    ? `${item.description.slice(0, 150)}...`
                    : item.description)
                  : APP_STRINGS.itemDetail.noDescription)}
            </Text>
            {item.description && item.description.length > 150 && (
              <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                style={({ pressed }) => [styles.readMoreButton, { opacity: pressed ? 0.6 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel={isExpanded ? APP_STRINGS.itemDetail.readLessAccessibility : APP_STRINGS.itemDetail.readMoreAccessibility}
              >
                <Text style={styles.readMoreText}>
                  {isExpanded ? APP_STRINGS.itemDetail.readLess : APP_STRINGS.itemDetail.readMore}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.editButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => router.push(`/${id}/edit`)}
            accessibilityLabel={APP_STRINGS.itemDetail.editAccessibility}
            accessibilityRole="button"
          >
            <Edit2 size={16} color={AppColors.text} strokeWidth={1.8} />
            <Text style={styles.editButtonText}>{APP_STRINGS.itemDetail.editButton}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.deleteButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={handleDelete}
            accessibilityLabel={APP_STRINGS.itemDetail.deleteAccessibility}
            accessibilityRole="button"
          >
            <Trash2 size={16} color="#fff" strokeWidth={1.8} />
            <Text style={styles.deleteButtonText}>{APP_STRINGS.itemDetail.deleteButton}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flex: 1,
  },
  imageCard: {
    margin: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  productImage: {
    width: '100%',
    height: 300,
  },
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
    backgroundColor: AppColors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AppColors.text,
    padding: 20,
    paddingBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  hairline: {
    height: 1,
    backgroundColor: AppColors.border,
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
    backgroundColor: AppColors.border,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
    letterSpacing: -0.5,
  },
  descriptionSection: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 32,
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 14,
    paddingVertical: 16,
  },
  editButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AppColors.text,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: AppColors.text,
    borderRadius: 14,
    paddingVertical: 16,
  },
  deleteButtonText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#fff',
  },
  readMoreButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: AppColors.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
