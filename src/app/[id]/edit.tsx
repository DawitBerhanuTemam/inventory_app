import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { InventoryForm } from '@/components/InventoryForm';
import { useInventoryItem, useUpdateItem } from '@/api/inventory';
import { uploadImage } from '@/api/upload';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: item, isLoading: isFetching, error } = useInventoryItem(id as string);
  const updateMutation = useUpdateItem();
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (data: any, imageUri: string | null) => {
    try {
      setIsUploading(true);
      let imageUrl = item?.image_url;
      
      // Only upload a new image if the URI doesn't start with http (meaning it's a local picked file)
      if (imageUri && !imageUri.startsWith('http')) {
        imageUrl = await uploadImage(imageUri);
      }

      await updateMutation.mutateAsync({
        id: id as string,
        updates: {
          ...data,
          image_url: imageUrl,
        }
      });

      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update item');
    } finally {
      setIsUploading(false);
    }
  };

  if (isFetching) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load item details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Edit Item', presentation: 'modal' }} />
      <InventoryForm 
        initialValues={item}
        onSubmit={handleSubmit} 
        isLoading={isUploading || updateMutation.isPending} 
        submitLabel="Save Changes"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
});
