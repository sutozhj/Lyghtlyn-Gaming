import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { articlesService } from '../services/supabaseService'
import type { Article } from '../lib/supabase'

const Home: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [latestArticles, setLatestArticles] = useState<Article[]>([])
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load articles từ Supabase
    const loadArticles = async () => {
      try {
        const articles = await articlesService.getAll()
        
        // Chỉ lấy bài viết đã publish
        const publishedArticles = articles.filter(a => a.published !== false)
        
        // Lọc featured articles
        const featured = publishedArticles.filter(a => a.featured)
        setFeaturedArticles(featured.slice(0, 3))
        
        // Lấy các bài viết mới nhất (không phải featured)
        const latest = publishedArticles.filter(a => !a.featured)
        setLatestArticles(latest.slice(0, 4))
        
        // Tất cả bài viết
        setAllArticles(publishedArticles.slice(0, 6))
      } catch (error) {
        console.error('Error loading articles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>
  }

  return (
    <div>
      {/* Featured News Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6">TIN NỔI BẬT</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Large Left Card */}
          {featuredArticles[0] && (
            <Link 
              to={`/article/${featuredArticles[0].slug}`}
              className="col-span-2 relative h-96 rounded-lg overflow-hidden group cursor-pointer block"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${featuredArticles[0].image}`}></div>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  FEATURED
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="inline-block bg-purple-600 px-3 py-1 rounded text-sm font-semibold mb-2">{featuredArticles[0].category}</div>
                <div className="text-2xl font-bold mb-2">{featuredArticles[0].title}</div>
                <p className="text-gray-300 text-sm">{featuredArticles[0].excerpt}</p>
              </div>
            </Link>
          )}
          
          {/* Right Side Cards */}
          <div className="space-y-4">
            {featuredArticles.slice(1, 3).map((news) => (
              <Link 
                key={news.id}
                to={`/article/${news.slug}`}
                className="relative h-44 rounded-lg overflow-hidden group cursor-pointer block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${news.image}`}></div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <div className="absolute top-2 left-2">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    FEATURED
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold mb-1">{news.title}</h3>
                  <p className="text-gray-300 text-xs line-clamp-2">{news.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Latest News Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">TIN MỚI NHẤT</h2>
          <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">
            Xem tất cả
          </a>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {latestArticles.map((news) => (
            <Link 
              key={news.id}
              to={`/article/${news.slug}`}
              className="relative rounded-lg overflow-hidden group cursor-pointer block"
            >
              <div className={`aspect-video bg-gradient-to-br ${news.image} relative`}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">{news.published_at}</span>
                    <span className="bg-purple-600 px-2 py-1 rounded text-xs">{news.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                  <p className="text-gray-300 text-sm">{news.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">BÀI VIẾT</h2>
          <a href="#" className="text-purple-400 hover:text-purple-300 font-medium">
            Xem tất cả
          </a>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          {allArticles.map((article) => (
            <Link 
              key={article.id}
              to={`/article/${article.slug}`}
              className="relative rounded-lg overflow-hidden group cursor-pointer block"
            >
              <div className={`aspect-video bg-gradient-to-br ${article.image} relative`}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {article.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
