import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { InventoryForm } from '@/components/InventoryForm';
import { useCreateItem } from '@/api/inventory';
import { uploadImage } from '@/api/upload';

export default function CreateItemScreen() {
  const router = useRouter();
  const createMutation = useCreateItem();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: any, imageUri: string | null) => {
    try {
      setIsUploading(true);
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImage(imageUri);
      }

      await createMutation.mutateAsync({
        ...data,
        image_url: imageUrl,
      });

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create item');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Add New Item' }} />
      <InventoryForm 
        onSubmit={handleSubmit} 
        isLoading={isUploading || createMutation.isPending} 
        submitLabel="Create Item"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
