import { supabase } from '@/lib/supabase';

export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('inventory-images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from('inventory-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};
