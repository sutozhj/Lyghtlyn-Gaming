# 🎨 CSS Theme Guide - Hướng Dẫn Chỉnh Sửa Màu Sắc

## 📋 Tổng Quan

Tất cả các màu purple đã được chuyển thành CSS variables và utility classes trong `src/index.css`. Bạn có thể dễ dàng thay đổi theme màu bằng cách chỉnh sửa các giá trị trong `:root`.

---

## 🎯 CSS Variables

### **Primary Colors**
```css
--color-primary: 139 92 246;        /* purple-500 */
--color-primary-300: 196 181 253;   /* purple-300 */
--color-primary-400: 167 139 250;   /* purple-400 */
--color-primary-500: 139 92 246;   /* purple-500 */
--color-primary-600: 124 58 237;   /* purple-600 */
--color-primary-700: 109 40 217;   /* purple-700 */
--color-primary-900: 88 28 135;    /* purple-900 */
```

### **Hover States**
```css
--color-primary-hover: 124 58 237;           /* purple-600 */
--color-primary-hover-light: 167 139 250;    /* purple-400 */
--color-primary-hover-dark: 109 40 217;      /* purple-700 */
```

### **Focus/Ring States**
```css
--color-primary-focus: 139 92 246;  /* purple-500 */
--color-primary-ring: 139 92 246;   /* purple-500 */
```

---

## 🔧 Utility Classes

### **Background Colors**
```html
<div class="bg-primary">...</div>                    <!-- purple-600 -->
<div class="bg-primary-hover">...</div>              <!-- hover: purple-700 -->
<div class="bg-primary-600">...</div>                <!-- purple-600 -->
<div class="bg-primary-700">...</div>                <!-- purple-700 -->
```

### **Text Colors**
```html
<span class="text-primary">...</span>                <!-- purple-400 -->
<span class="text-primary-hover">...</span>          <!-- hover: purple-300 -->
<span class="text-primary-400">...</span>            <!-- purple-400 -->
<span class="text-primary-300">...</span>            <!-- purple-300 -->
```

### **Border Colors**
```html
<div class="border-primary">...</div>                <!-- purple-500 -->
<div class="border-primary-hover">...</div>           <!-- hover: purple-600 -->
<div class="border-primary-500">...</div>            <!-- purple-500 -->
<div class="border-primary-600">...</div>            <!-- purple-600 -->
```

### **Hover States**
```html
<a class="hover-text-primary">...</a>                <!-- hover: purple-400 -->
<a class="hover-text-primary-400">...</a>            <!-- hover: purple-400 -->
<a class="hover-text-primary-300">...</a>            <!-- hover: purple-300 -->
<button class="hover-bg-primary">...</button>        <!-- hover: purple-600 -->
<button class="hover-bg-primary-700">...</button>     <!-- hover: purple-700 -->
```

### **Focus/Ring States**
```html
<input class="focus-ring-primary" />                 <!-- focus: purple-500 ring -->
<button class="ring-primary">...</button>            <!-- ring: purple-500 -->
```

### **Combined Classes**
```html
<button class="btn-primary">Button</button>          <!-- purple-600 bg, hover: purple-700 -->
<a class="link-primary">Link</a>                     <!-- purple-400 text, hover: purple-300 -->
<span class="badge-primary">Badge</span>            <!-- purple-600 bg -->
<div class="card-hover-primary">Card</div>           <!-- hover: purple-500 border -->
```

---

## 🔄 Migration Map (Cách Thay Thế)

### **Background**
| Old Class | New Class |
|-----------|-----------|
| `bg-purple-600` | `bg-primary-600` hoặc `bg-primary` |
| `bg-purple-700` | `bg-primary-700` |
| `hover:bg-purple-700` | `hover-bg-primary-700` |
| `bg-purple-600/20` | `bg-primary-600/20` (giữ opacity) |

### **Text**
| Old Class | New Class |
|-----------|-----------|
| `text-purple-400` | `text-primary-400` hoặc `text-primary` |
| `text-purple-300` | `text-primary-300` |
| `hover:text-purple-400` | `hover-text-primary-400` |
| `hover:text-purple-300` | `hover-text-primary-300` |

### **Border**
| Old Class | New Class |
|-----------|-----------|
| `border-purple-500` | `border-primary-500` |
| `border-purple-600` | `border-primary-600` |
| `hover:border-purple-600` | `border-primary-hover` |

### **Ring/Focus**
| Old Class | New Class |
|-----------|-----------|
| `ring-purple-500` | `ring-primary` |
| `focus:ring-purple-500` | `focus-ring-primary` |
| `focus:ring-2 focus:ring-purple-500` | `focus-ring-primary focus:ring-2` |

---

## 🎨 Thay Đổi Theme Màu

### **Ví dụ: Đổi sang màu Blue**

Chỉ cần thay đổi các giá trị trong `:root`:

```css
:root {
  /* Thay purple thành blue */
  --color-primary-300: 147 197 253;   /* blue-300 */
  --color-primary-400: 96 165 250;    /* blue-400 */
  --color-primary-500: 59 130 246;    /* blue-500 */
  --color-primary-600: 37 99 235;     /* blue-600 */
  --color-primary-700: 29 78 216;     /* blue-700 */
  --color-primary-900: 30 58 138;     /* blue-900 */
  /* ... các giá trị khác tương tự */
}
```

**Tất cả các class utility sẽ tự động cập nhật!** 🎉

---

## 📝 Lưu Ý

1. **Giữ format RGB**: Các giá trị trong `:root` phải là RGB không có `rgb()` wrapper
   - ✅ Đúng: `--color-primary: 139 92 246;`
   - ❌ Sai: `--color-primary: rgb(139, 92, 246);`

2. **Sử dụng `rgb(var(...))`**: Khi dùng trong CSS
   - ✅ Đúng: `color: rgb(var(--color-primary-400));`
   - ❌ Sai: `color: var(--color-primary-400);`

3. **Tailwind Classes**: Một số class vẫn dùng Tailwind (như `bg-primary-600/20` cho opacity)
   - Có thể giữ nguyên hoặc tạo thêm utility class

---

## 🚀 Next Steps

1. ✅ Đã tạo CSS variables và utility classes
2. ⏳ Đang thay thế các class purple trong codebase
3. 📝 Cập nhật documentation

---

## 📚 Files Đã Cập Nhật

- ✅ `src/index.css` - CSS variables và utility classes
- ⏳ `src/components/Layout.tsx` - Đang cập nhật...
- ⏳ `src/components/ui/button.tsx` - Đang cập nhật...
- ⏳ Các file khác...

---

**Chỉnh sửa theme màu giờ đây rất dễ dàng! Chỉ cần sửa các giá trị trong `:root` là xong! 🎨**

