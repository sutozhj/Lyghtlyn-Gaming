# 📰 Hướng Dẫn Cập Nhật Article Page

## 🎯 Những Gì Đã Thay Đổi

### 1. **Database Schema** ✅
Đã thêm các fields mới vào bảng `articles`:
- `cover_image` - URL ảnh bìa cho trang chi tiết
- `author_id` - ID của tác giả
- `published` - Trạng thái xuất bản (true/false)
- `sections` - JSONB cho nội dung có cấu trúc (Table of Contents)

### 2. **Admin Panel** ✅
- Sửa lỗi Select component (dùng `<select>` native thay vì custom component)
- Thêm field "URL Ảnh bìa" vào form
- Thêm checkbox "Xuất bản ngay"
- Hiển thị đúng danh mục games

### 3. **Article Page** ✅
- Tạo trang chi tiết bài viết với layout đẹp
- Table of Contents tự động từ sections
- Breadcrumb navigation
- Related articles sidebar
- Author card
- Social follow buttons

### 4. **Home Page** ✅
- Tất cả bài viết giờ đã link đến trang chi tiết
- Chỉ hiển thị bài viết đã publish
- Fix lỗi hiển thị ngày xuất bản

---

## 🚀 Cách Cập Nhật Database

### **Bước 1: Chạy Migration SQL**

1. Mở **Supabase Dashboard**: https://app.supabase.com
2. Chọn project của bạn
3. Vào **SQL Editor** (biểu tượng </> ở sidebar)
4. Copy và paste nội dung file `supabase-migration-articles.sql`
5. Click **Run** ▶️

```sql
-- Nội dung file supabase-migration-articles.sql
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS author_id TEXT DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sections JSONB;

UPDATE articles 
SET cover_image = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80'
WHERE cover_image IS NULL;
```

### **Bước 2: Kiểm Tra**

Vào **Table Editor** → Chọn bảng `articles` → Kiểm tra các columns mới đã xuất hiện chưa.

### **Bước 3: Refresh Browser**

```bash
# Nếu đang chạy dev server
Ctrl + Shift + R (hard refresh)

# Hoặc restart dev server
npm run dev
```

---

## 📝 Cách Sử Dụng

### **1. Tạo Bài Viết Mới**

1. Vào Admin → Bài viết → **Thêm Bài viết**
2. Điền các thông tin:
   - **Tiêu đề** - Tự động tạo slug
   - **Mô tả ngắn** - Hiển thị trong danh sách
   - **Nội dung** - Dùng Rich Text Editor
   - **URL Ảnh bìa** - Ảnh hiển thị trong trang chi tiết
   - **Danh mục** - News, Review, Guide, ESports
   - **Game** - Chọn game liên quan (optional)
   - **Class Gradient** - Cho thumbnail (VD: from-gray-900 to-purple-900)
   - **Ngày xuất bản**
   - ✅ **Đặt làm nổi bật** - Hiển thị trong "TIN NỔI BẬT"
   - ✅ **Xuất bản ngay** - Hiển thị public

3. Click **Xuất bản**

### **2. Xem Bài Viết**

- **Trang chủ**: Click vào bất kỳ bài viết nào
- **URL trực tiếp**: `/article/{slug}`
- **Ví dụ**: `/article/delta-force-best-guns`

### **3. Chỉnh Sửa Bài Viết**

1. Vào Admin → Bài viết
2. Click nút **Edit** ✏️ trên bài viết
3. Chỉnh sửa và click **Cập nhật**

### **4. Unpublish Bài Viết**

- Bỏ tick ✅ **Xuất bản ngay** → Bài viết sẽ không hiển thị public
- Vẫn có thể chỉnh sửa trong admin

---

## 🎨 Components Mới

### **ArticleAuthor**
Hiển thị thông tin tác giả với avatar

### **RelatedArticles**
Hiển thị các bài viết liên quan (mock data - có thể update sau)

### **SocialFollow**
Buttons để follow social media

### **ArticlePage**
Trang chi tiết bài viết với:
- Breadcrumb navigation
- Table of Contents (nếu có sections)
- Prose styling cho content
- Related articles & social sidebar

---

## 🎯 Routes Mới

```
/article/:slug     - Trang chi tiết bài viết
```

**Ví dụ:**
```
/article/delta-force-tips
/article/poe2-best-builds
/article/capybara-go-guide
```

---

## 💡 Tips

### **1. Thêm Sections (Table of Contents)**

Hiện tại sections là JSONB field, bạn có thể thêm sau:

```json
[
  {
    "id": "intro",
    "title": "Giới thiệu",
    "content": "<p>Nội dung HTML...</p>"
  },
  {
    "id": "gameplay",
    "title": "Gameplay",
    "content": "<p>Nội dung HTML...</p>"
  }
]
```

### **2. Related Articles**

Hiện tại dùng mock data. Để dynamic, bạn có thể:
- Load từ same category
- Load từ same game
- Load random articles

### **3. Custom Styling**

Prose styling đã được thêm vào `src/index.css` với class `.article-content`

---

## 🐛 Troubleshooting

### **Lỗi: "Bài viết không tồn tại"**
- Kiểm tra slug có đúng không
- Kiểm tra bài viết đã publish chưa (`published = true`)

### **Lỗi: "Cannot read properties of null"**
- Chạy migration SQL để thêm các columns mới
- Refresh browser

### **Lỗi: "Select component not working"**
- Đã fix: Dùng `<select>` native HTML thay vì custom component

### **Table of Contents không hiện**
- Chỉ hiện khi có `sections` field (JSONB)
- Fallback: Hiển thị content bình thường

---

## ✅ Checklist

- [ ] Chạy migration SQL trong Supabase
- [ ] Kiểm tra Table Editor có columns mới
- [ ] Refresh browser (Ctrl + Shift + R)
- [ ] Vào Admin → Tạo bài viết test
- [ ] Click vào bài viết từ home page
- [ ] Kiểm tra trang chi tiết bài viết
- [ ] Test edit bài viết
- [ ] Test unpublish bài viết

---

## 🎉 Hoàn Thành!

Bây giờ bạn đã có:
- ✅ Trang chi tiết bài viết đẹp với Table of Contents
- ✅ Admin panel hoạt động tốt
- ✅ Link từ home page đến article page
- ✅ Published/Unpublished status
- ✅ Cover image cho article page
- ✅ Prose styling cho content

**Enjoy! 🚀**

