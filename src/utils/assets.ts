/**
 * Utility functions for handling assets
 * Hỗ trợ sử dụng assets từ CDN hoặc subdomain khi cần
 */

// Base URL cho assets - có thể được set qua environment variable
// Ví dụ: VITE_ASSETS_BASE_URL=https://cdn.yourdomain.com
const ASSETS_BASE: string = import.meta.env.VITE_ASSETS_BASE_URL || ''

/**
 * Lấy URL đầy đủ cho asset
 * @param path - Đường dẫn asset (có thể có hoặc không có leading slash)
 * @returns URL đầy đủ của asset
 */
export const getAssetUrl = (path: string): string => {
  // Nếu đã có base URL (production với CDN), sử dụng nó
  if (ASSETS_BASE) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${ASSETS_BASE}/${cleanPath}`
  }
  // Development: trả về path gốc (Vite sẽ xử lý)
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Import asset và trả về URL
 * Sử dụng khi cần import asset trong code
 * @param path - Đường dẫn asset từ thư mục assets
 * @returns Promise với URL của asset hoặc null nếu lỗi
 */
export const importAsset = async (path: string): Promise<string | null> => {
  try {
    const module = await import(`../assets/${path}`)
    return module.default as string
  } catch (error) {
    console.error(`Failed to import asset: ${path}`, error)
    return null
  }
}

export default {
  getAssetUrl,
  importAsset
}

