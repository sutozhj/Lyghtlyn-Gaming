import { createClient } from '@supabase/supabase-js'

// Thay thế bằng thông tin từ Supabase project của bạn
// Lấy từ: https://app.supabase.com/project/_/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types cho database
export interface Game {
  id: number
  name: string
  slug: string
  icon: string
  description?: string
  created_at?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor'
  created_at?: string
}

export interface ArticleSection {
  id: string
  title: string
  content: string
}

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  cover_image?: string
  category: string
  game_slug?: string
  author: string
  author_id?: string
  published_at: string
  featured?: boolean
  published?: boolean
  sections?: ArticleSection[]
  created_at?: string
}

export interface GameSection {
  id: number
  game_slug: string
  title: string
  slug: string
  image: string
  display_order: number
  created_at?: string
}

export interface WeaponLoadout {
  id: number
  game_slug: string
  weapon_name: string
  weapon_type: string
  weapon_name_filter: string
  thumbnail_url?: string
  loadout_code: string
  author: string
  category: 'warface' | 'operation'
  created_at?: string
}

export interface AuctionItem {
  id: number
  game_slug: string
  item_name: string
  item_image?: string
  current_price: number
  change_1d: number
  change_7d: number
  change_30d: number
  item_level?: string
  item_type?: string
  created_at?: string
}

