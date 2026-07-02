import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InventoryForm } from '@/components/InventoryForm';
import { useCreateItem } from '@/api/inventory';
import { uploadImage } from '@/api/upload';
import { ArrowLeft } from 'lucide-react-native';

const C = {
  bg: '#F2F2F2',
  card: '#FFFFFF',
  text: '#0A0A0A',
  sub: '#7A7A7A',
  border: '#E5E5E5',
};

export default function CreateItemScreen() {
  const router = useRouter();
  const goBack = () => router.canGoBack() ? router.back() : router.replace('/');
  const createMutation = useCreateItem();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: any, imageUri: string | null) => {
    try {
      setIsUploading(true);
      let imageUrl = null;
      if (imageUri) imageUrl = await uploadImage(imageUri);
      await createMutation.mutateAsync({ ...data, image_url: imageUrl });
      goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create item');
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
        <Text style={styles.title}>ADD PRODUCT</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={styles.divider} />
      <InventoryForm
        onSubmit={handleSubmit}
        isLoading={isUploading || createMutation.isPending}
        submitLabel="Add Product"
      />
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
});
