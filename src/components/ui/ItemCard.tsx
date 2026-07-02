import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Plus, Package } from 'lucide-react-native';
import type { InventoryItem } from '@/types/inventory';
import { AppColors } from '@/constants/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ItemCardProps {
  item: InventoryItem;
  onPress: () => void;
}

export function ItemCard({ item, onPress }: ItemCardProps) {
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

const styles = StyleSheet.create({
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
});
