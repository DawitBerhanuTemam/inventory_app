import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { InventoryForm } from '@/components/InventoryForm';
import { NavHeader } from '@/components/ui/NavHeader';
import { useCreateItem } from '@/api/inventory';
import { uploadImage } from '@/api/upload';
import { AppColors } from '@/constants/colors';
import { APP_STRINGS } from '@/constants/strings';
import type { InventoryFormValues } from '@/types/inventory';

/**
 * Screen for creating a new inventory item.
 * Handles image upload and delegates form rendering to InventoryForm.
 */
export default function CreateItemScreen() {
  const router = useRouter();
  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const createMutation = useCreateItem();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (values: InventoryFormValues, imageUri: string) => {
    try {
      setIsUploading(true);

      const imageUrl = await uploadImage(imageUri);

      await createMutation.mutateAsync({ ...values, image_url: imageUrl });
      goBack();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : APP_STRINGS.createItem.errorDefaultMessage;
      Alert.alert(APP_STRINGS.createItem.errorTitle, message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <NavHeader title={APP_STRINGS.createItem.title} onBack={goBack} />
      <InventoryForm
        onSubmit={handleSubmit}
        isLoading={isUploading || createMutation.isPending}
        submitLabel={APP_STRINGS.createItem.submitLabel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
});
