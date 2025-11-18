# Hướng dẫn Setup Supabase cho LyghtlynG

## 📋 Tổng quan
Dự án đã được tích hợp Supabase để quản lý database. Tất cả dữ liệu (games, users, articles) được lưu trữ và đồng bộ thời gian thực.

## 🚀 Các bước Setup

### 1. Tạo Supabase Project

1. Truy cập [https://supabase.com](https://supabase.com)
2. Đăng ký / Đăng nhập tài khoản
3. Click **"New Project"**
4. Nhập thông tin:
   - **Name**: `lyghtlyn-games` (hoặc tên bạn muốn)
   - **Database Password**: Tạo password mạnh và **LƯU LẠI**
   - **Region**: Chọn region gần nhất (Southeast Asia cho VN)
5. Click **"Create new project"**
6. Đợi ~2 phút để Supabase khởi tạo project

### 2. Chạy SQL Schema

1. Trong Supabase Dashboard, click vào **"SQL Editor"** ở sidebar bên trái
2. Click **"New Query"**
3. Mở file `supabase-schema.sql` trong dự án
4. Copy toàn bộ nội dung và paste vào SQL Editor
5. Click **"Run"** hoặc nhấn `Ctrl + Enter`
6. Kiểm tra kết quả:
   - Nếu thành công, bạn sẽ thấy "Success. No rows returned"
   - Nếu có lỗi, đọc message và sửa lại

### 3. Kiểm tra Tables

1. Click vào **"Table Editor"** ở sidebar
2. Bạn sẽ thấy 3 tables:
   - ✅ `games` - Danh sách games
   - ✅ `users` - Admin & Editor users
   - ✅ `articles` - Bài viết

3. Mỗi table sẽ có một số sample data nếu bạn chạy phần INSERT trong SQL schema

### 4. Lấy API Keys

1. Click vào **"Settings"** (icon bánh răng) ở sidebar
2. Click vào **"API"**
3. Trong phần **"Project API keys"**, copy 2 giá trị:
   - **Project URL** (URL dạng `https://xxxxx.supabase.co`)
   - **anon public** key (key dài dạng `eyJhbGc...`)

### 5. Cấu hình Environment Variables

1. Tạo file `.env` trong thư mục root của dự án
2. Thêm nội dung sau:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Thay thế `xxxxx.supabase.co` bằng **Project URL** của bạn
4. Thay thế `eyJhbG...` bằng **anon public** key của bạn
5. **LƯU Ý**: File `.env` đã được thêm vào `.gitignore`, không commit lên Git!

### 6. Test Connection

1. Khởi động lại dev server:
```bash
npm run dev
```

2. Truy cập [http://localhost:5173](http://localhost:5173)
3. Kiểm tra:
   - ✅ Menu Games hiển thị đúng
   - ✅ Trang chủ hiển thị bài viết
   - ✅ Truy cập `/admin/games` để test CRUD

## 🎯 Cấu trúc Database

### Table: `games`
```sql
- id: bigint (primary key, auto increment)
- name: text (tên game)
- slug: text (unique, URL-friendly)
- icon: text (URL hình ảnh)
- description: text (mô tả)
- created_at: timestamp
```

### Table: `users`
```sql
- id: bigint (primary key, auto increment)
- name: text (họ tên)
- email: text (unique)
- role: text (Admin hoặc Editor)
- created_at: timestamp
```

### Table: `articles`
```sql
- id: bigint (primary key, auto increment)
- title: text (tiêu đề)
- slug: text (unique, URL-friendly)
- content: text (HTML content từ Rich Text Editor)
- excerpt: text (mô tả ngắn)
- image: text (Tailwind gradient class)
- category: text (News, Review, Guide, ESports)
- game_slug: text (foreign key đến games.slug)
- author: text (tên tác giả)
- published_at: date (ngày xuất bản)
- featured: boolean (bài viết nổi bật)
- created_at: timestamp
```

## 🔒 Bảo mật (Row Level Security)

Database đã được cấu hình với Row Level Security (RLS):
- ✅ **Public Read**: Ai cũng có thể xem data (không cần đăng nhập)
- ✅ **Public Write**: Tạm thời cho phép tất cả mọi người có thể thêm/sửa/xóa (để test)

**⚠️ LƯU Ý**: Trong production, bạn nên:
1. Implement authentication (Supabase Auth)
2. Cập nhật RLS policies để chỉ Admin/Editor có thể write
3. Bảo vệ các routes admin bằng auth middleware

## 📊 Quản lý Data

### Từ Admin Dashboard
1. Truy cập `/admin/games` - Quản lý games
2. Truy cập `/admin/users` - Quản lý admin/editor
3. Truy cập `/admin/articles` - Quản lý bài viết với Rich Text Editor

### Từ Supabase Dashboard
1. Vào **Table Editor**
2. Click vào table muốn xem
3. Có thể thêm/sửa/xóa trực tiếp từ UI
4. Thay đổi sẽ được đồng bộ ngay lập tức

## 🐛 Troubleshooting

### Lỗi: "Invalid API key"
- Kiểm tra lại `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong `.env`
- Đảm bảo không có khoảng trắng thừa
- Khởi động lại dev server

### Lỗi: "relation does not exist"
- Bạn chưa chạy SQL schema
- Chạy lại file `supabase-schema.sql` trong SQL Editor

### Không hiển thị data
- Kiểm tra Console trong DevTools (F12)
- Xem có lỗi API không
- Kiểm tra xem table có data trong Supabase Dashboard

### CORS Error
- Supabase đã tự động config CORS
- Nếu vẫn lỗi, kiểm tra lại URL trong `.env`

## 📝 Sample Data

Nếu muốn thêm sample data, chạy các lệnh SQL này trong SQL Editor:

```sql
-- Thêm game mới
INSERT INTO games (name, slug, icon, description) VALUES
  ('Elden Ring', 'elden-ring', 'https://cdn.example.com/elden-ring.png', 'Action RPG');

-- Thêm user mới
INSERT INTO users (name, email, role) VALUES
  ('John Doe', 'john@example.com', 'Editor');

-- Thêm article mới
INSERT INTO articles (title, slug, content, excerpt, image, category, game_slug, author, published_at, featured) VALUES
  (
    'Elden Ring DLC Announced',
    'elden-ring-dlc',
    '<p>Exciting news for Elden Ring fans...</p>',
    'New DLC coming soon',
    'from-yellow-900 to-orange-900',
    'News',
    'elden-ring',
    'Admin User',
    '2024-03-16',
    false
  );
```

## 🔗 Tài liệu tham khảo

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 💡 Tips

1. **Backup data**: Supabase có automatic backups, nhưng nên export data định kỳ
2. **Monitoring**: Xem logs trong Supabase Dashboard > Logs
3. **Performance**: Supabase có built-in caching và optimization
4. **Real-time**: Có thể enable real-time subscriptions cho live updates

## 🎉 Hoàn thành!

Sau khi setup xong, bạn có thể:
- ✅ Quản lý games từ admin panel
- ✅ Thêm/sửa/xóa bài viết với Rich Text Editor
- ✅ Quản lý users (Admin & Editor)
- ✅ Tất cả data được lưu trữ an toàn trên Supabase
- ✅ Data tự động đồng bộ giữa admin và public pages

