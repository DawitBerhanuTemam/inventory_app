import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Package } from 'lucide-react-native';
import { AppColors } from '@/constants/colors';
import type { InventoryFormValues } from '@/types/inventory';

const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Cannot be negative'),
  price: z.number().min(0, 'Cannot be negative'),
});

interface InventoryFormProps {
  /** Pre-populate the form when editing an existing item. */
  initialValues?: Partial<InventoryFormValues> & { image_url?: string | null };
  /** Called with validated form values and the selected image URI (must not be null). */
  onSubmit: (values: InventoryFormValues, imageUri: string) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

/**
 * Shared form used by both the Create and Edit screens.
 * Handles image selection, field validation via Zod, and submit state.
 */
export function InventoryForm({
  initialValues,
  onSubmit,
  isLoading,
  submitLabel,
}: InventoryFormProps) {
  const [imageUri, setImageUri] = useState<string | null>(
    initialValues?.image_url ?? null
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      quantity: initialValues?.quantity ?? 0,
      price: initialValues?.price ?? 0,
    },
  });

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setImageError(null);
    }
  };

  const handleFormSubmit = handleSubmit((values) => {
    if (!imageUri) {
      setImageError('Product image is required');
      return;
    }
    setImageError(null);
    onSubmit(values, imageUri);
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Image picker */}
      <Pressable
        style={({ pressed }) => [
          styles.imagePicker,
          imageError ? styles.imagePickerError : null,
          { opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={handlePickImage}
        accessibilityLabel="Select product image"
        accessibilityRole="button"
      >
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={styles.pickerImage} resizeMode="cover" />
            <View style={styles.pickerOverlay}>
              <Camera size={22} color="#fff" />
              <Text style={styles.pickerOverlayText}>CHANGE PHOTO</Text>
            </View>
          </>
        ) : (
          <View style={styles.pickerEmpty}>
            <Package size={36} color="#CCCCCC" strokeWidth={1.2} />
            <Text style={styles.pickerEmptyText}>TAP TO ADD PHOTO</Text>
          </View>
        )}
      </Pressable>
      {imageError && <Text style={[styles.fieldError, styles.imageErrorMargin]}>{imageError}</Text>}

      {/* Product name */}
      <FormField label="PRODUCT NAME" error={errors.name?.message}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="e.g. Wireless Headphones"
              placeholderTextColor="#BDBDBD"
              autoCorrect={false}
            />
          )}
        />
      </FormField>

      {/* Description */}
      <FormField label="DESCRIPTION" error={errors.description?.message}>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Brief description of this product..."
              placeholderTextColor="#BDBDBD"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
      </FormField>

      {/* Quantity + Price (side by side) */}
      <View style={styles.twoColumnRow}>
        <View style={styles.twoColumnLeft}>
          <FormField label="QUANTITY" error={errors.quantity?.message}>
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.quantity && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  value={value.toString()}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#BDBDBD"
                />
              )}
            />
          </FormField>
        </View>

        <View style={styles.twoColumnRight}>
          <FormField label="PRICE ($)" error={errors.price?.message}>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={(text) => onChange(parseFloat(text) || 0)}
                  value={value.toString()}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#BDBDBD"
                />
              )}
            />
          </FormField>
        </View>
      </View>

      {/* Submit button */}
      <Pressable
        style={({ pressed }) => [
          styles.submitButton,
          isLoading && styles.submitButtonDisabled,
          { opacity: pressed && !isLoading ? 0.85 : 1 },
        ]}
        onPress={handleFormSubmit}
        disabled={isLoading}
        accessibilityLabel={submitLabel}
        accessibilityRole="button"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>{submitLabel.toUpperCase()}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerError: {
    borderColor: AppColors.danger,
    backgroundColor: AppColors.dangerLight,
  },
  pickerImage: {
    width: '100%',
    height: '100%',
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pickerOverlayText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  pickerEmpty: {
    alignItems: 'center',
    gap: 10,
  },
  pickerEmptyText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: '#CCCCCC',
  },
  field: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  fieldError: {
    color: AppColors.danger,
    fontSize: 11,
    marginTop: 5,
    fontWeight: '500',
  },
  imageErrorMargin: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: 15,
    color: AppColors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: AppColors.danger,
    backgroundColor: AppColors.dangerLight,
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  twoColumnLeft: {
    flex: 1,
    marginRight: 8,
  },
  twoColumnRight: {
    flex: 1,
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: AppColors.text,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#555',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
