-- =====================================================
-- MIGRATION: Thêm fields mới vào bảng Articles
-- Chạy script này trong Supabase SQL Editor
-- =====================================================

-- Thêm columns mới (nếu chưa có)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS author_id TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sections JSONB;

-- Cập nhật dữ liệu cũ (set cover_image = image nếu cover_image null)
UPDATE articles 
SET cover_image = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80'
WHERE cover_image IS NULL;

-- Commit
SELECT 'Migration completed successfully!' as status;

