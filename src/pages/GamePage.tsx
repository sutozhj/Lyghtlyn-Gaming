import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { gamesService, articlesService, gameSectionsService } from '../services/supabaseService'
import type { Game, Article, GameSection } from '../lib/supabase'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'

const GamePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [game, setGame] = useState<Game | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [sections, setSections] = useState<GameSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load game data
        if (slug) {
          const foundGame = await gamesService.getBySlug(slug)
          setGame(foundGame)

          // Load articles for this game
          const gameArticles = await articlesService.getByGame(slug)
          setArticles(gameArticles)

          // Load featured sections for this game
          const gameSections = await gameSectionsService.getByGame(slug)
          setSections(gameSections)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Đang tải...</div>
  }

  if (!game) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Không tìm thấy game</div>
  }

  // Fallback featured sections if no sections in database
  const defaultSections = [
    {
      id: 1,
      game_slug: slug || '',
      title: 'WARFACE',
      slug: 'warface',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop',
      display_order: 1
    },
    {
      id: 2,
      game_slug: slug || '',
      title: 'OPERATION',
      slug: 'operation',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
      display_order: 2
    },
    {
      id: 3,
      game_slug: slug || '',
      title: 'NHÀ ĐẦU GIÁ',
      slug: 'nha-dau-gia',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&auto=format&fit=crop',
      display_order: 3
    },
    {
      id: 4,
      game_slug: slug || '',
      title: 'TIN TỨC',
      slug: 'tin-tuc',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop',
      display_order: 4
    }
  ]

  const featuredSections = sections.length > 0 ? sections : defaultSections

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 flex items-center gap-6">
        <img 
          src={game.icon} 
          alt={game.name}
          className="h-24 w-24 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2">{game.name}</h1>
          <p className="text-gray-400 text-lg">
            {game.description || 'Comprehensive guides, builds, and resources'}
          </p>
        </div>
      </div>

      {/* Featured Section - NỔI BẬT */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold uppercase tracking-wide">Nổi bật</h2>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>
        
        <div className="flex gap-4 w-full flex-col lg:flex-row h-[220px]">
          {/* Large Left Card - Takes up more space */}
          {featuredSections[0] && (
            <div className="flex-[1.2] h-full">
              <Link 
                to={`/game/${slug}/${featuredSections[0].slug}`}
                className="rounded-lg bg-no-repeat bg-cover h-full w-full flex items-center justify-center bg-center border border-gray-700 hover:border-purple-600 transition-all relative overflow-hidden group"
                style={{
                  backgroundImage: `url("${featuredSections[0].image}")`
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all"></div>
                <span className="font-sans text-lg font-bold uppercase text-white relative z-10 px-4 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {featuredSections[0].title}
                </span>
              </Link>
            </div>
          )}
          
          {/* Right Side Cards Grid - 2 top, 1 bottom */}
          <div className="flex-1 flex flex-col gap-4 h-full">
            {/* Top Row - 2 cards side by side */}
            <div className="flex gap-4 h-[100px]">
              {featuredSections[1] && (
                <Link 
                  to={`/game/${slug}/${featuredSections[1].slug}`}
                  className="rounded-lg bg-no-repeat bg-cover flex-1 flex items-center justify-center bg-center border border-gray-700 hover:border-purple-600 transition-all relative overflow-hidden group"
                  style={{
                    backgroundImage: `url("${featuredSections[1].image}")`
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all"></div>
                  <span className="font-sans text-sm font-bold uppercase text-white relative z-10 px-3 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {featuredSections[1].title}
                  </span>
                </Link>
              )}
              {featuredSections[2] && (
                <Link 
                  to={`/game/${slug}/${featuredSections[2].slug}`}
                  className="rounded-lg bg-no-repeat bg-cover flex-1 flex items-center justify-center bg-center border border-gray-700 hover:border-purple-600 transition-all relative overflow-hidden group"
                  style={{
                    backgroundImage: `url("${featuredSections[2].image}")`
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all"></div>
                  <span className="font-sans text-sm font-bold uppercase text-white relative z-10 px-3 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                    {featuredSections[2].title}
                  </span>
                </Link>
              )}
            </div>
            
            {/* Bottom Row - 1 full width card */}
            {featuredSections[3] && (
              <Link 
                to={`/game/${slug}/${featuredSections[3].slug}`}
                className="rounded-lg bg-no-repeat bg-cover flex-1 flex items-center justify-center bg-center border border-gray-700 hover:border-purple-600 transition-all relative overflow-hidden group"
                style={{
                  backgroundImage: `url("${featuredSections[3].image}")`
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-all"></div>
                <span className="font-sans text-sm font-bold uppercase text-white relative z-10 px-3 text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {featuredSections[3].title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-2xl font-bold uppercase tracking-wide">{game.name} News</h2>
            <div className="flex-1 h-[1px] bg-gray-700"></div>
          </div>
          <Link to="#" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.slice(0, 4).map((article) => (
              <Card key={article.id} className="group overflow-hidden hover:border-purple-600/50 transition-all">
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop'}
                    alt={article.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {article.featured && (
                    <Badge variant="featured" className="absolute top-4 left-4">
                      FEATURED
                    </Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <span>{article.category}</span>
                    <span>•</span>
                    <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Chưa có bài viết nào cho game này.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage
