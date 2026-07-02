# Setup Instructions

### 1. Supabase Setup
Run this in your Supabase SQL Editor to create the necessary table and storage bucket:

```sql
CREATE TABLE public.inventory (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  quantity integer not null default 0,
  price numeric not null default 0.0,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into storage.buckets (id, name, public) values ('inventory-images', 'inventory-images', true);

-- Enable public access (for development/testing)
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Inventory Access" ON public.inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Storage Access" ON storage.objects FOR ALL USING (bucket_id = 'inventory-images') WITH CHECK (bucket_id = 'inventory-images');
```

### 2. Local Setup
```bash
npm install
npm run start
```

# Environment Variables

Create a `.env` file in the root folder with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

# Build Instructions

To generate the Android APK file:

```bash
npx eas-cli build -p android --profile preview
```
