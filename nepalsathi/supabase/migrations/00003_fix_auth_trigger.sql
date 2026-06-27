-- Fix broken auth trigger that prevents signup
-- Run this SQL in your Supabase SQL Editor
-- Then the app code will handle profile creation instead

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS handle_new_user();
