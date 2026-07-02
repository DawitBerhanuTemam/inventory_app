import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InventoryForm } from '@/components/InventoryForm';
import { useInventoryItem, useUpdateItem } from '@/api/inventory';
import { uploadImage } from '@/api/upload';
import { ArrowLeft } from 'lucide-react-native';

const C = {
  bg: '#F2F2F2',
  card: '#FFFFFF',
  text: '#0A0A0A',
  sub: '#7A7A7A',
  border: '#E5E5E5',
  red: '#C0392B',
};

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/');
  const { data: item, isLoading: isFetching, error } = useInventoryItem(id as string);
  const updateMutation = useUpdateItem();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: any, imageUri: string | null) => {
    try {
      setIsUploading(true);
      let imageUrl = item?.image_url;
      if (imageUri && !imageUri.startsWith('http')) {
        imageUrl = await uploadImage(imageUri);
      }
      await updateMutation.mutateAsync({ id: id as string, updates: { ...data, image_url: imageUrl } });
      goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update item');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => goBack()} activeOpacity={0.7}>
          <ArrowLeft size={20} color={C.text} strokeWidth={1.8} />
        </TouchableOpacity>
        <Text style={styles.title}>EDIT PRODUCT</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.divider} />

      {isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={C.text} />
        </View>
      ) : error || !item ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load item.</Text>
        </View>
      ) : (
        <InventoryForm
          initialValues={item}
          onSubmit={handleSubmit}
          isLoading={isUploading || updateMutation.isPending}
          submitLabel="Save Changes"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
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
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
    color: C.text,
  },
  divider: { height: 1, backgroundColor: C.border },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 14, color: C.red },
});
