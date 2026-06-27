-- Fix the broken auth trigger that causes signup to fail
-- Run this in your Supabase SQL Editor

-- 1. Drop the broken trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Recreate with proper SECURITY DEFINER settings for Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar, level, xp, preferences)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    '',
    1,
    0,
    '{"language":"English","notifications":true,"darkMode":false}'
  );
  RETURN NEW;
END;
$$;

-- 3. Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Add insert policy for service role (triggers run as owner)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (
    auth.uid() = id OR
    (SELECT COUNT(*) FROM auth.users WHERE id = auth.uid()) > 0 OR
    NULLIF(current_setting('request.jwt.claims', true), '') IS NULL
  );

-- 5. Make sure the table already exists (if not, create it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      passport_count INTEGER DEFAULT 0,
      preferences JSONB DEFAULT '{"language":"English","notifications":true,"darkMode":false}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END;
$$;

-- 6. Re-add other RLS policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 7. Verify: test signup should work now
-- Run this to confirm: 
-- SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 1;