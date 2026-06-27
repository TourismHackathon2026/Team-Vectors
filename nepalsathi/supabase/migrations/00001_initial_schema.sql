-- NepalSathi Database Schema
-- Run this in your Supabase SQL Editor

-- 1. PROFILES (extends auth.users)
CREATE TABLE profiles (
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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. HERITAGE SITES (seeded data, not user-owned)
CREATE TABLE heritage_sites (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  image TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  category TEXT NOT NULL,
  established_year TEXT DEFAULT '',
  entry_fee TEXT DEFAULT '',
  opening_hours TEXT DEFAULT '',
  best_time_to_visit TEXT DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  rating NUMERIC(3,1) DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE heritage_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read heritage sites"
  ON heritage_sites FOR SELECT USING (true);

-- 3. AUTHENTIC PLACES (local experiences, broader than heritage)
CREATE TABLE authentic_places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT DEFAULT '',
  images JSONB DEFAULT '[]',
  description TEXT NOT NULL,
  short_description TEXT NOT NULL,
  history TEXT DEFAULT '',
  local_legends TEXT DEFAULT '',
  etiquette TEXT DEFAULT '',
  best_time_to_visit TEXT DEFAULT '',
  opening_hours TEXT DEFAULT '',
  authenticity_score INTEGER DEFAULT 0,
  authenticity_indicators JSONB DEFAULT '[]',
  estimated_cost TEXT DEFAULT '',
  distance TEXT DEFAULT '',
  is_open BOOLEAN DEFAULT true,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  nearby_places JSONB DEFAULT '[]',
  price_level INTEGER DEFAULT 1,
  rating NUMERIC(3,1) DEFAULT 0,
  visit_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE authentic_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read authentic places"
  ON authentic_places FOR SELECT USING (true);

-- 4. PASSPORT STAMPS
CREATE TABLE passport_stamps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  site_id TEXT NOT NULL,
  site_name TEXT NOT NULL,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT DEFAULT '',
  image TEXT DEFAULT '',
  verified_by_gps BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

ALTER TABLE passport_stamps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own stamps"
  ON passport_stamps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stamps"
  ON passport_stamps FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stamps"
  ON passport_stamps FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stamps"
  ON passport_stamps FOR DELETE USING (auth.uid() = user_id);

-- 5. QUESTS (static data)
CREATE TABLE quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  category TEXT NOT NULL,
  icon TEXT DEFAULT 'Sparkles',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  completion_radius INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read quests"
  ON quests FOR SELECT USING (true);

-- 6. COMPLETED QUESTS
CREATE TABLE completed_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  quest_id TEXT REFERENCES quests(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by_gps BOOLEAN DEFAULT false,
  UNIQUE(user_id, quest_id)
);

ALTER TABLE completed_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own completed quests"
  ON completed_quests FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own completed quests"
  ON completed_quests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 7. FAVORITES
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  site_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE USING (auth.uid() = user_id);

-- 8. ITINERARY ITEMS
CREATE TABLE itinerary_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  time_slot TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  item_order INTEGER DEFAULT 0,
  travel_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own itinerary"
  ON itinerary_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itinerary"
  ON itinerary_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itinerary"
  ON itinerary_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own itinerary"
  ON itinerary_items FOR DELETE USING (auth.uid() = user_id);

-- 9. MEMORY ENTRIES
CREATE TABLE memory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  place_name TEXT NOT NULL,
  place_id TEXT DEFAULT '',
  visit_date DATE NOT NULL,
  notes TEXT DEFAULT '',
  photos JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memories"
  ON memory_entries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memories"
  ON memory_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own memories"
  ON memory_entries FOR DELETE USING (auth.uid() = user_id);

-- 10. AI CONVERSATIONS
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Chat',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own conversations"
  ON ai_conversations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. AI MESSAGES
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
  ON ai_messages FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM ai_conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "Users can insert own messages"
  ON ai_messages FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM ai_conversations WHERE id = conversation_id
    )
  );

-- 12. RECENT ACTIVITIES
CREATE TABLE recent_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recent_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activities"
  ON recent_activities FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON recent_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. REVIEWS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  site_id TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 14. STORAGE BUCKETS (run separately in Supabase dashboard)
-- Buckets needed: profile-photos, heritage-images, passport-exports, memory-photos

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to recalculate passport_count on stamp changes
CREATE OR REPLACE FUNCTION update_passport_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles
    SET passport_count = (SELECT COUNT(*) FROM passport_stamps WHERE user_id = NEW.user_id)
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles
    SET passport_count = (SELECT COUNT(*) FROM passport_stamps WHERE user_id = OLD.user_id)
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_passport_stamp_change
  AFTER INSERT OR DELETE ON passport_stamps
  FOR EACH ROW EXECUTE FUNCTION update_passport_count();