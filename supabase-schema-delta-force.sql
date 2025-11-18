-- =====================================================
-- DELTA FORCE TABLES ONLY
-- Chạy script này nếu bạn chỉ cần thêm weapon_loadouts và auction_items
-- =====================================================

CREATE TABLE IF NOT EXISTS weapon_loadouts (
  id BIGSERIAL PRIMARY KEY,
  game_slug TEXT NOT NULL,
  weapon_name TEXT NOT NULL,
  weapon_type TEXT NOT NULL,
  weapon_name_filter TEXT NOT NULL,
  thumbnail_url TEXT,
  loadout_code TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Lyghtlyn',
  category TEXT NOT NULL CHECK (category IN ('warface', 'operation')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  FOREIGN KEY (game_slug) REFERENCES games(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_weapon_loadouts_game_slug ON weapon_loadouts(game_slug);
CREATE INDEX IF NOT EXISTS idx_weapon_loadouts_category ON weapon_loadouts(category);
CREATE INDEX IF NOT EXISTS idx_weapon_loadouts_weapon_type ON weapon_loadouts(weapon_type);

ALTER TABLE weapon_loadouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view weapon loadouts" ON weapon_loadouts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert weapon loadouts" ON weapon_loadouts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update weapon loadouts" ON weapon_loadouts
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete weapon loadouts" ON weapon_loadouts
  FOR DELETE USING (true);

-- =====================================================
-- AUCTION ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS auction_items (
  id BIGSERIAL PRIMARY KEY,
  game_slug TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_image TEXT,
  current_price BIGINT NOT NULL DEFAULT 0,
  change_1d INTEGER NOT NULL DEFAULT 0,
  change_7d INTEGER NOT NULL DEFAULT 0,
  change_30d INTEGER NOT NULL DEFAULT 0,
  item_level TEXT,
  item_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  FOREIGN KEY (game_slug) REFERENCES games(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_auction_items_game_slug ON auction_items(game_slug);
CREATE INDEX IF NOT EXISTS idx_auction_items_current_price ON auction_items(current_price DESC);

ALTER TABLE auction_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view auction items" ON auction_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert auction items" ON auction_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update auction items" ON auction_items
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete auction items" ON auction_items
  FOR DELETE USING (true);


