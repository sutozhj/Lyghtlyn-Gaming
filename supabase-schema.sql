-- =====================================================
-- SUPABASE DATABASE SCHEMA
-- Chạy script này trong Supabase SQL Editor
-- https://app.supabase.com/project/_/sql
-- =====================================================

-- Bảng Games
CREATE TABLE IF NOT EXISTS games (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng Users (Admin & Editor)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Admin', 'Editor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bảng Articles
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  image TEXT NOT NULL,
  cover_image TEXT, -- URL ảnh bìa cho ArticlePage
  category TEXT NOT NULL,
  game_slug TEXT,
  author TEXT NOT NULL,
  author_id TEXT DEFAULT 'admin',
  published_at DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE, -- Trạng thái xuất bản
  sections JSONB, -- Các phần nội dung có cấu trúc (cho Table of Contents)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  FOREIGN KEY (game_slug) REFERENCES games(slug) ON DELETE SET NULL
);

-- Indexes để tối ưu query
CREATE INDEX IF NOT EXISTS idx_articles_game_slug ON articles(game_slug);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policies cho public read access (không cần đăng nhập để xem)
CREATE POLICY "Public can view games" ON games
  FOR SELECT USING (true);

CREATE POLICY "Public can view users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Public can view articles" ON articles
  FOR SELECT USING (true);

-- Policies cho admin operations (cần authentication - có thể thêm sau)
-- Tạm thời cho phép tất cả mọi người có thể insert/update/delete
CREATE POLICY "Anyone can insert games" ON games
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update games" ON games
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete games" ON games
  FOR DELETE USING (true);

CREATE POLICY "Anyone can insert users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update users" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete users" ON users
  FOR DELETE USING (true);

CREATE POLICY "Anyone can insert articles" ON articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update articles" ON articles
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete articles" ON articles
  FOR DELETE USING (true);

-- =====================================================
-- SAMPLE DATA (Optional)
-- =====================================================

-- Game Sections table (Featured sections for each game)
-- Note: Sections are managed through the Games admin page (not separate page)
-- Each game can have up to 4 sections displayed in "Nổi bật" area
CREATE TABLE IF NOT EXISTS game_sections (
  id BIGSERIAL PRIMARY KEY,
  game_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  image TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(game_slug, slug),
  FOREIGN KEY (game_slug) REFERENCES games(slug) ON DELETE CASCADE
);

-- Index for game_sections
CREATE INDEX IF NOT EXISTS idx_game_sections_game_slug ON game_sections(game_slug);
CREATE INDEX IF NOT EXISTS idx_game_sections_display_order ON game_sections(display_order);

-- Enable RLS for game_sections
ALTER TABLE game_sections ENABLE ROW LEVEL SECURITY;

-- Policies for game_sections
CREATE POLICY "Public can view game sections" ON game_sections
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert game sections" ON game_sections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update game sections" ON game_sections
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete game sections" ON game_sections
  FOR DELETE USING (true);

-- Insert sample games
INSERT INTO games (name, slug, icon, description) VALUES
  ('Path of Exile', 'poe', 'https://assets-ng.maxroll.gg/images/game-logos/poe-logo.png', 'Action RPG'),
  ('Delta Force', 'delta-force', 'https://cdn.cloudflare.steamstatic.com/steam/apps/2520820/header.jpg', 'FPS Game'),
  ('Capybara Go!', 'capybara-go', 'https://play-lh.googleusercontent.com/QBH-qHxG8g4WKqKf7ZMqKZ_qZ0QZ8QZ', 'Casual Game'),
  ('World of Warcraft', 'wow', 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_dragon_01.jpg', 'MMORPG'),
  ('Borderlands', 'borderlands', 'https://cdn2.steamgriddb.com/icon/borderlands.png', 'Action RPG'),
  ('Last Epoch', 'last-epoch', 'https://cdn.cloudflare.steamstatic.com/steam/apps/899770/header.jpg', 'Action RPG')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample featured sections for Delta Force
INSERT INTO game_sections (game_slug, title, slug, image, display_order) VALUES
  ('delta-force', 'WARFACE', 'warface', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop', 1),
  ('delta-force', 'OPERATION', 'operation', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop', 2),
  ('delta-force', 'NHÀ ĐẦU GIÁ', 'nha-dau-gia', 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop', 3),
  ('delta-force', 'TIN TỨC', 'tin-tuc', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop', 4)
ON CONFLICT (game_slug, slug) DO NOTHING;

-- =====================================================
-- WEAPON LOADOUTS TABLE
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_weapon_loadouts_game_slug ON weapon_loadouts(game_slug);
CREATE INDEX IF NOT EXISTS idx_weapon_loadouts_category ON weapon_loadouts(category);
CREATE INDEX IF NOT EXISTS idx_weapon_loadouts_weapon_type ON weapon_loadouts(weapon_type);

-- Enable RLS
ALTER TABLE weapon_loadouts ENABLE ROW LEVEL SECURITY;

-- Policies
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_auction_items_game_slug ON auction_items(game_slug);
CREATE INDEX IF NOT EXISTS idx_auction_items_current_price ON auction_items(current_price DESC);

-- Enable RLS
ALTER TABLE auction_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view auction items" ON auction_items
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert auction items" ON auction_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update auction items" ON auction_items
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete auction items" ON auction_items
  FOR DELETE USING (true);

-- Insert sample users
INSERT INTO users (name, email, role) VALUES
  ('Admin User', 'sutozhj@gmail.com', 'Admin'),
  ('Editor User', 'editor@example.com', 'Editor'),
  ('Admin 2', 'admin2@example.com', 'Admin'),
  ('Editor 2', 'editor2@example.com', 'Editor')
ON CONFLICT (email) DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, content, excerpt, image, category, game_slug, author, published_at, featured) VALUES
  (
    'Path of Exile 2 Early Access - Những điều cần biết',
    'poe-2-early-access',
    '<p>Path of Exile 2 đang trong giai đoạn Early Access với nhiều cải tiến đáng chú ý...</p>',
    'Tìm hiểu về Early Access của PoE 2',
    'from-gray-900 to-purple-900',
    'News',
    'poe',
    'Admin User',
    '2024-03-15',
    true
  ),
  (
    'Delta Force: Hawk Ops - Game bắn súng chiến thuật mới',
    'delta-force-hawk-ops',
    '<p>Delta Force Hawk Ops mang đến trải nghiệm FPS chiến thuật đỉnh cao...</p>',
    'Giới thiệu về Delta Force Hawk Ops',
    'from-blue-900 to-cyan-900',
    'Review',
    'delta-force',
    'Editor User',
    '2024-03-14',
    true
  )
ON CONFLICT (slug) DO NOTHING;

