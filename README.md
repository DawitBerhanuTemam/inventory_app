# Inventory App (Expo + Supabase)

A full-stack mobile application for inventory management built with Expo React Native, Supabase, and TanStack Query.

## Features
- **View Inventory**: See all items with image, name, quantity, and price.
- **Create Item**: Add a new inventory item and upload an image to Supabase Storage.
- **Update Item**: Edit any details of the inventory item or replace its image.
- **Delete Item**: Remove an item and automatically delete its associated image from storage.

## Tech Stack
- **Framework**: Expo React Native (Expo Router)
- **Backend & Database**: Supabase (PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Forms & Validation**: `react-hook-form` + `zod`
- **Styling**: React Native StyleSheet (with a clean, modern aesthetic)

## Prerequisites
- Node.js (v18+)
- Expo CLI
- A Supabase account

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the SQL Editor and run the following script to create the table and storage bucket:

```sql
-- Create the inventory table
CREATE TABLE public.inventory (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  quantity integer not null default 0,
  price numeric not null default 0.0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a storage bucket for images
insert into storage.buckets (id, name, public) values ('inventory-images', 'inventory-images', true);

-- Enable RLS (Optional but recommended for structure, we allow public access here)
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Allow public read access to inventory
CREATE POLICY "Public Inventory View" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Public Inventory Insert" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Inventory Update" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY "Public Inventory Delete" ON public.inventory FOR DELETE USING (true);

-- Allow public access to storage bucket
CREATE POLICY "Public Storage Access" ON storage.objects FOR SELECT USING (bucket_id = 'inventory-images');
CREATE POLICY "Public Storage Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inventory-images');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'inventory-images');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'inventory-images');
```

### 2. Environment Variables
1. Rename `.env.example` to `.env`.
2. Fill in your Supabase project URL and anon key:
```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Locally
1. Install dependencies:
```bash
npm install
```
2. Start the Expo development server:
```bash
npm run start
```
3. Use the Expo Go app on your phone, or an emulator (iOS/Android) to run the app.

## Build Instructions (APK)

To build the standalone APK for Android, use Expo Application Services (EAS):

1. Install EAS CLI globally:
```bash
npm install -g eas-cli
```
2. Login to your Expo account:
```bash
eas login
```
3. Configure the project:
```bash
eas build:configure
```
4. Build the APK locally (requires Android Studio / SDK) or on Expo servers:
```bash
eas build -p android --profile preview
```
Wait for the build to complete, and download the `.apk` file using the provided link.
