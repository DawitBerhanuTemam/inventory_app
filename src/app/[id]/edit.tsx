import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { InventoryForm } from '@/components/InventoryForm';
import { NavHeader } from '@/components/ui/NavHeader';
import { LoadingView } from '@/components/ui/LoadingView';
import { ErrorView } from '@/components/ui/ErrorView';
import { useInventoryItem, useUpdateItem } from '@/api/inventory';
import { uploadImage } from '@/api/upload';
import { AppColors } from '@/constants/colors';
import type { InventoryFormValues } from '@/types/inventory';

/**
 * Screen for editing an existing inventory item.
 * Fetches the current item data, pre-populates the form, and handles updates.
 */
export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const { data: item, isLoading: isFetching, error } = useInventoryItem(id as string);
  const updateMutation = useUpdateItem();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (values: InventoryFormValues, imageUri: string) => {
    try {
      setIsUploading(true);

      // Only re-upload if a new local image was picked (not an existing http URL)
      let imageUrl = item?.image_url ?? null;
      if (imageUri && !imageUri.startsWith('http')) {
        imageUrl = await uploadImage(imageUri);
      } else if (imageUri) {
        imageUrl = imageUri;
      }

      await updateMutation.mutateAsync({
        id: id as string,
        updates: { ...values, image_url: imageUrl },
      });

      goBack();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update item.';
      Alert.alert('Error', message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <NavHeader title="EDIT PRODUCT" onBack={goBack} />

      {isFetching ? (
        <LoadingView />
      ) : error || !item ? (
        <ErrorView message="Failed to load this item." />
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
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});
