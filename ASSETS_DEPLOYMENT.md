# Hướng Dẫn Quản Lý Assets Khi Sử Dụng Tên Miền Phụ

## Cấu Trúc Assets Hiện Tại

```
src/
  assets/
    icons/          # Icons cho các games
    poe/            # Assets riêng cho Path of Exile
    lyghtlyn-logo.png
```

## Các Tùy Chọn Đặt Assets Khi Dùng Tên Miền Phụ

### 1. **Giữ Assets Trong Dự Án (Khuyến Nghị cho Development)**

**Vị trí:** `src/assets/` (như hiện tại)

**Ưu điểm:**
- Dễ quản lý và version control
- Không cần cấu hình thêm
- Tự động được Vite xử lý và optimize

**Cách sử dụng:**
```jsx
import logo from './assets/lyghtlyn-logo.png'
import poeIcon from './assets/icons/poe-logo.webp'
```

**Khi build:** Vite sẽ tự động copy và optimize assets vào thư mục `dist/`

---

### 2. **Đặt Assets Trong Thư Mục `public/` (Cho Static Assets)**

**Vị trí:** `public/assets/`

**Khi nào dùng:**
- Assets không cần import trong code
- Assets cần truy cập trực tiếp qua URL
- Assets lớn không cần optimize

**Cách sử dụng:**
```jsx
<img src="/assets/lyghtlyn-logo.png" alt="Logo" />
```

**Ưu điểm:**
- URL cố định, dễ cache
- Không bị hash trong tên file khi build
- Phù hợp cho CDN

---

### 3. **Sử Dụng CDN/Tên Miền Phụ (Cho Production)**

**Cấu trúc đề xuất:**

```
cdn.yourdomain.com/          # Hoặc assets.yourdomain.com/
  ├── icons/
  │   ├── poe-logo.webp
  │   ├── delta-force.png
  │   └── ...
  ├── poe/
  │   └── icons/
  │       └── ...
  └── lyghtlyn-logo.png
```

**Cấu hình Vite để sử dụng CDN:**

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com/' 
    : '/',
  build: {
    assetsDir: 'assets',
    // Hoặc giữ assets trong project và chỉ thay đổi base URL
  }
})
```

**Cách sử dụng trong code:**

```jsx
// Tạo file config cho assets
// src/config/assets.js
const ASSETS_BASE_URL = import.meta.env.PROD 
  ? 'https://cdn.yourdomain.com' 
  : ''

export const getAssetUrl = (path) => {
  return `${ASSETS_BASE_URL}${path}`
}

// Sử dụng
import { getAssetUrl } from './config/assets'
<img src={getAssetUrl('/assets/icons/poe-logo.webp')} />
```

---

### 4. **Sử Dụng Environment Variables**

**Tạo file `.env.production`:**
```
VITE_ASSETS_BASE_URL=https://cdn.yourdomain.com
```

**Sử dụng trong code:**
```jsx
const assetsBaseUrl = import.meta.env.VITE_ASSETS_BASE_URL || ''

<img src={`${assetsBaseUrl}/assets/icons/poe-logo.webp`} />
```

---

## Khuyến Nghị

### Development:
- ✅ Giữ assets trong `src/assets/` như hiện tại
- ✅ Import trực tiếp trong code

### Production với Tên Miền Phụ:

**Option A: CDN riêng (Tốt nhất cho performance)**
```
1. Upload assets lên CDN (Cloudflare, AWS S3, etc.)
2. Cấu hình base URL trong vite.config.js
3. Sử dụng environment variables để switch giữa dev/prod
```

**Option B: Subdomain riêng**
```
1. Tạo subdomain: assets.yourdomain.com
2. Deploy assets lên subdomain đó
3. Cấu hình CORS nếu cần
4. Update base URL trong production config
```

**Option C: Giữ trong project (Đơn giản nhất)**
```
1. Giữ assets trong src/assets/
2. Vite sẽ tự động optimize và bundle
3. Assets sẽ được serve từ cùng domain
```

---

## Ví Dụ Cấu Hình Hoàn Chỉnh

### vite.config.js cho Production với CDN:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_ASSETS_BASE_URL || '/',
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
```

### .env.production:
```
VITE_ASSETS_BASE_URL=https://cdn.yourdomain.com
```

### src/utils/assets.js:
```js
export const ASSETS_BASE = import.meta.env.VITE_ASSETS_BASE_URL || ''

export const getAsset = (path) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${ASSETS_BASE}/${cleanPath}`
}
```

---

## Lưu Ý Quan Trọng

1. **CORS:** Nếu assets ở subdomain khác, đảm bảo cấu hình CORS đúng
2. **HTTPS:** Luôn sử dụng HTTPS cho production
3. **Cache:** Cấu hình cache headers cho assets (1 năm cho images)
4. **Optimization:** Vite tự động optimize assets, nhưng có thể thêm plugins như `vite-plugin-imagemin`
5. **Versioning:** Sử dụng hash trong tên file để cache busting

