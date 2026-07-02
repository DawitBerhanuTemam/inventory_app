import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Package } from 'lucide-react-native';

const C = {
  bg: '#F2F2F2',
  card: '#FFFFFF',
  text: '#0A0A0A',
  sub: '#7A7A7A',
  border: '#E5E5E5',
  red: '#C0392B',
  redLight: '#FCECEA',
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0, 'Cannot be negative'),
  price: z.number().min(0, 'Cannot be negative'),
});

type FormData = z.infer<typeof schema>;

interface InventoryFormProps {
  initialValues?: Partial<FormData> & { image_url?: string | null };
  onSubmit: (data: FormData, imageUri: string | null) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

export function InventoryForm({ initialValues, onSubmit, isLoading, submitLabel }: InventoryFormProps) {
  const [imageUri, setImageUri] = useState<string | null>(initialValues?.image_url || null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      quantity: initialValues?.quantity || 0,
      price: initialValues?.price || 0,
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Image Picker */}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage} activeOpacity={0.8}>
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
      </TouchableOpacity>

      {/* Name */}
      <Field label="PRODUCT NAME" error={errors.name?.message}>
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
      </Field>

      {/* Description */}
      <Field label="DESCRIPTION" error={errors.description?.message}>
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
      </Field>

      {/* Qty + Price */}
      <View style={styles.twoCol}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Field label="QUANTITY" error={errors.quantity?.message}>
            <Controller
              control={control}
              name="quantity"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.quantity && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={val => onChange(parseInt(val) || 0)}
                  value={value.toString()}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#BDBDBD"
                />
              )}
            />
          </Field>
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Field label="PRICE ($)" error={errors.price?.message}>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.price && styles.inputError]}
                  onBlur={onBlur}
                  onChangeText={val => onChange(parseFloat(val) || 0)}
                  value={value.toString()}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor="#BDBDBD"
                />
              )}
            />
          </Field>
        </View>
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
        onPress={handleSubmit(data => onSubmit(data, imageUri))}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>{submitLabel.toUpperCase()}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {error && <Text style={styles.fieldError}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 16, paddingBottom: 48 },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerImage: { width: '100%', height: '100%' },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  pickerOverlayText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  pickerEmpty: { alignItems: 'center', gap: 10 },
  pickerEmptyText: { fontSize: 10, fontWeight: '700', letterSpacing: 1.5, color: '#CCCCCC' },
  field: { marginBottom: 16 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: C.sub,
    marginBottom: 8,
  },
  input: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 11,
    fontSize: 15,
    color: C.text,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  inputError: { borderColor: C.red, backgroundColor: C.redLight },
  fieldError: { color: C.red, fontSize: 11, marginTop: 5, fontWeight: '500' },
  twoCol: { flexDirection: 'row' },
  submitBtn: {
    backgroundColor: C.text,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 12,
  },
  submitBtnDisabled: { backgroundColor: '#555' },
  submitBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
