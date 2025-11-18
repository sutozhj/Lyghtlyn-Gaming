import poeIcon from '../assets/icons/poe-logo.webp'
import deltaForceIcon from '../assets/icons/delta-force.png'
import capybaraGoIcon from '../assets/icons/capybara-go.png'
import wowIcon from '../assets/icons/wow.png'
import borderlandsIcon from '../assets/icons/borderlands.png'
import lastEpochIcon from '../assets/icons/last-epoch.png'

export interface Game {
  id: number
  name: string
  slug: string
  icon: string
  description?: string
}

export interface User {
  id: number
  name: string
  email: string
  role: 'Admin' | 'Editor'
}

export interface Article {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  image: string
  category: string
  gameSlug?: string
  author: string
  publishedAt: string
  featured?: boolean
}

// Mock Data Store
class MockDataStore {
  private games: Game[] = [
    { id: 1, name: 'Path of Exile', slug: 'poe', icon: poeIcon, description: 'Action RPG' },
    { id: 2, name: 'Delta Force', slug: 'delta-force', icon: deltaForceIcon, description: 'FPS Game' },
    { id: 3, name: 'Capybara Go!', slug: 'capybara-go', icon: capybaraGoIcon, description: 'Casual Game' },
    { id: 4, name: 'World of Warcraft', slug: 'wow', icon: wowIcon, description: 'MMORPG' },
    { id: 5, name: 'Borderlands', slug: 'borderlands', icon: borderlandsIcon, description: 'Action RPG' },
    { id: 6, name: 'Last Epoch', slug: 'last-epoch', icon: lastEpochIcon, description: 'Action RPG' },
  ]

  private users: User[] = [
    { id: 1, name: 'Admin User', email: 'sutozhj@gmail.com', role: 'Admin' },
    { id: 2, name: 'Editor User', email: 'editor@example.com', role: 'Editor' },
    { id: 3, name: 'Admin 2', email: 'admin2@example.com', role: 'Admin' },
    { id: 4, name: 'Editor 2', email: 'editor2@example.com', role: 'Editor' },
  ]

  private articles: Article[] = [
    {
      id: 1,
      title: 'Path of Exile 2 Early Access - Những điều cần biết',
      slug: 'poe-2-early-access',
      content: '<p>Path of Exile 2 đang trong giai đoạn Early Access với nhiều cải tiến đáng chú ý...</p>',
      excerpt: 'Tìm hiểu về Early Access của PoE 2',
      image: 'from-gray-900 to-purple-900',
      category: 'News',
      gameSlug: 'poe',
      author: 'Admin User',
      publishedAt: '2024-03-15',
      featured: true,
    },
    {
      id: 2,
      title: 'Delta Force: Hawk Ops - Game bắn súng chiến thuật mới',
      slug: 'delta-force-hawk-ops',
      content: '<p>Delta Force Hawk Ops mang đến trải nghiệm FPS chiến thuật đỉnh cao...</p>',
      excerpt: 'Giới thiệu về Delta Force Hawk Ops',
      image: 'from-blue-900 to-cyan-900',
      category: 'Review',
      gameSlug: 'delta-force',
      author: 'Editor User',
      publishedAt: '2024-03-14',
      featured: true,
    },
  ]

  // Games methods
  getGames(): Game[] {
    return [...this.games]
  }

  getGameById(id: number): Game | undefined {
    return this.games.find(g => g.id === id)
  }

  addGame(game: Omit<Game, 'id'>): Game {
    const newGame = { ...game, id: Math.max(...this.games.map(g => g.id), 0) + 1 }
    this.games.push(newGame)
    return newGame
  }

  updateGame(id: number, updates: Partial<Game>): Game | undefined {
    const index = this.games.findIndex(g => g.id === id)
    if (index !== -1) {
      this.games[index] = { ...this.games[index], ...updates }
      return this.games[index]
    }
    return undefined
  }

  deleteGame(id: number): boolean {
    const index = this.games.findIndex(g => g.id === id)
    if (index !== -1) {
      this.games.splice(index, 1)
      return true
    }
    return false
  }

  // Users methods
  getUsers(): User[] {
    return [...this.users]
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id)
  }

  addUser(user: Omit<User, 'id'>): User {
    const newUser = { ...user, id: Math.max(...this.users.map(u => u.id), 0) + 1 }
    this.users.push(newUser)
    return newUser
  }

  updateUser(id: number, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates }
      return this.users[index]
    }
    return undefined
  }

  deleteUser(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id)
    if (index !== -1) {
      this.users.splice(index, 1)
      return true
    }
    return false
  }

  // Articles methods
  getArticles(): Article[] {
    return [...this.articles]
  }

  getArticleById(id: number): Article | undefined {
    return this.articles.find(a => a.id === id)
  }

  getArticlesByGame(gameSlug: string): Article[] {
    return this.articles.filter(a => a.gameSlug === gameSlug)
  }

  addArticle(article: Omit<Article, 'id'>): Article {
    const newArticle = { ...article, id: Math.max(...this.articles.map(a => a.id), 0) + 1 }
    this.articles.push(newArticle)
    return newArticle
  }

  updateArticle(id: number, updates: Partial<Article>): Article | undefined {
    const index = this.articles.findIndex(a => a.id === id)
    if (index !== -1) {
      this.articles[index] = { ...this.articles[index], ...updates }
      return this.articles[index]
    }
    return undefined
  }

  deleteArticle(id: number): boolean {
    const index = this.articles.findIndex(a => a.id === id)
    if (index !== -1) {
      this.articles.splice(index, 1)
      return true
    }
    return false
  }
}

export const mockDataStore = new MockDataStore()

