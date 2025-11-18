import { supabase } from '../lib/supabase'
import type { Game, User, Article, GameSection, WeaponLoadout, AuctionItem } from '../lib/supabase'

// =====================================================
// GAMES SERVICE
// =====================================================

export const gamesService = {
  async getAll(): Promise<Game[]> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error loading games:', error)
      return []
    }
    
    return data || []
  },

  async getById(id: number): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error loading game:', error)
      return null
    }
    
    return data
  },

  async getBySlug(slug: string): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error loading game:', error)
      return null
    }
    
    return data
  },

  async create(game: Omit<Game, 'id' | 'created_at'>): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .insert([game])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating game:', error)
      throw error
    }
    
    return data
  },

  async update(id: number, updates: Partial<Game>): Promise<Game | null> {
    const { data, error } = await supabase
      .from('games')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating game:', error)
      throw error
    }
    
    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting game:', error)
      throw error
    }
    
    return true
  }
}

// =====================================================
// USERS SERVICE
// =====================================================

export const usersService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('Error loading users:', error)
      return []
    }
    
    return data || []
  },

  async getById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error loading user:', error)
      return null
    }
    
    return data
  },

  async create(user: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating user:', error)
      throw error
    }
    
    return data
  },

  async update(id: number, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating user:', error)
      throw error
    }
    
    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting user:', error)
      throw error
    }
    
    return true
  }
}

// =====================================================
// ARTICLES SERVICE
// =====================================================

export const articlesService = {
  async getAll(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error loading articles:', error)
      return []
    }
    
    return data || []
  },

  async getById(id: number): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error loading article:', error)
      return null
    }
    
    return data
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) {
      console.error('Error loading article:', error)
      return null
    }
    
    return data
  },

  async getByGame(gameSlug: string): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('game_slug', gameSlug)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error loading articles:', error)
      return []
    }
    
    return data || []
  },

  async getFeatured(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
    
    if (error) {
      console.error('Error loading featured articles:', error)
      return []
    }
    
    return data || []
  },

  async create(article: Omit<Article, 'id' | 'created_at'>): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating article:', error)
      throw error
    }
    
    return data
  },

  async update(id: number, updates: Partial<Article>): Promise<Article | null> {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating article:', error)
      throw error
    }
    
    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting article:', error)
      throw error
    }
    
    return true
  }
}

// =====================================================
// GAME SECTIONS SERVICE
// =====================================================

export const gameSectionsService = {
  async getByGame(gameSlug: string): Promise<GameSection[]> {
    const { data, error } = await supabase
      .from('game_sections')
      .select('*')
      .eq('game_slug', gameSlug)
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error loading game sections:', error)
      return []
    }
    
    return data || []
  },

  async getAll(): Promise<GameSection[]> {
    const { data, error } = await supabase
      .from('game_sections')
      .select('*')
      .order('display_order', { ascending: true })
    
    if (error) {
      console.error('Error loading all game sections:', error)
      return []
    }
    
    return data || []
  },

  async getById(id: number): Promise<GameSection | null> {
    const { data, error } = await supabase
      .from('game_sections')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error loading game section:', error)
      return null
    }
    
    return data
  },

  async create(section: Omit<GameSection, 'id' | 'created_at'>): Promise<GameSection | null> {
    const { data, error } = await supabase
      .from('game_sections')
      .insert([section])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating game section:', error)
      throw error
    }
    
    return data
  },

  async update(id: number, updates: Partial<GameSection>): Promise<GameSection | null> {
    const { data, error } = await supabase
      .from('game_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating game section:', error)
      throw error
    }
    
    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('game_sections')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting game section:', error)
      throw error
    }
    
    return true
  }
}

// =====================================================
// WEAPON LOADOUTS SERVICE
// =====================================================

export const weaponLoadoutsService = {
  async getAll(): Promise<WeaponLoadout[]> {
    const { data, error } = await supabase
      .from('weapon_loadouts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading weapon loadouts:', error)
      return []
    }
    
    return data || []
  },

  async getByGame(gameSlug: string): Promise<WeaponLoadout[]> {
    const { data, error} = await supabase
      .from('weapon_loadouts')
      .select('*')
      .eq('game_slug', gameSlug)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading weapon loadouts:', error)
      return []
    }
    
    return data || []
  },

  async getByCategory(gameSlug: string, category: 'warface' | 'operation'): Promise<WeaponLoadout[]> {
    const { data, error } = await supabase
      .from('weapon_loadouts')
      .select('*')
      .eq('game_slug', gameSlug)
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error loading weapon loadouts:', error)
      return []
    }
    
    return data || []
  },

  async getById(id: number): Promise<WeaponLoadout | null> {
    const { data, error } = await supabase
      .from('weapon_loadouts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error loading weapon loadout:', error)
      return null
    }
    
    return data
  },

  async create(loadout: Omit<WeaponLoadout, 'id' | 'created_at'>): Promise<WeaponLoadout | null> {
    const { data, error } = await supabase
      .from('weapon_loadouts')
      .insert([loadout])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating weapon loadout:', error)
      throw error
    }
    
    return data
  },

  async update(id: number, updates: Partial<WeaponLoadout>): Promise<WeaponLoadout | null> {
    const { data, error } = await supabase
      .from('weapon_loadouts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating weapon loadout:', error)
      throw error
    }
    
    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('weapon_loadouts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting weapon loadout:', error)
      throw error
    }
    
    return true
  }
}

// =====================================================
// AUCTION ITEMS SERVICE
// =====================================================

export const auctionItemsService = {
  async getAll(): Promise<AuctionItem[]> {
    const { data, error } = await supabase
      .from('auction_items')
      .select('*')
      .order('current_price', { ascending: false })
    
    if (error) {
      console.error('Error loading auction items:', error)
      return []
    }
    
    return data || []
  },

  async getByGame(gameSlug: string): Promise<AuctionItem[]> {
    const { data, error } = await supabase
      .from('auction_items')
      .select('*')
      .eq('game_slug', gameSlug)
      .order('current_price', { ascending: false })
    
    if (error) {
      console.error('Error loading auction items:', error)
      return []
    }
    
    return data || []
  },

  async getById(id: number): Promise<AuctionItem | null> {
    const { data, error } = await supabase
      .from('auction_items')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error loading auction item:', error)
      return null
    }
    
    return data
  },

  async create(item: Omit<AuctionItem, 'id' | 'created_at'>): Promise<AuctionItem | null> {
    const { data, error } = await supabase
      .from('auction_items')
      .insert([item])
      .select()
      .single()
    
    if (error) {
      console.error('Error creating auction item:', error)
      throw error
    }
    
    return data
  },

  async update(id: number, updates: Partial<AuctionItem>): Promise<AuctionItem | null> {
    const { data, error } = await supabase
      .from('auction_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating auction item:', error)
      throw error
    }
    
    return data
  },

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('auction_items')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting auction item:', error)
      throw error
    }
    
    return true
  }
}

