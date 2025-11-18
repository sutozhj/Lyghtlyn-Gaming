import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { articlesService, gamesService } from '../services/supabaseService'
import type { Article, Game, ArticleSection } from '../lib/supabase'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { Calendar, User, ChevronRight, Loader2 } from 'lucide-react'
import ArticleAuthor from '../components/ArticleAuthor'
import RelatedArticles from '../components/RelatedArticles'
import SocialFollow from '../components/SocialFollow'

const ArticlePage = () => {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('')
  const [tableOfContents, setTableOfContents] = useState<{ id: string; title: string }[]>([])
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])



  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return
      
      try {
        const articlesData = await articlesService.getAll()
        const foundArticle = articlesData.find(a => a.slug === slug && a.published !== false)
        
        if (!foundArticle) {
          setArticle(null)
          setLoading(false)
          return
        }
        
        setArticle(foundArticle)
        
        // Load game info nếu có
        if (foundArticle.game_slug) {
          const gamesData = await gamesService.getAll()
          const foundGame = gamesData.find(g => g.slug === foundArticle.game_slug)
          setGame(foundGame || null)
        }
        
        // Generate table of contents from sections if available
        if (foundArticle.sections && Array.isArray(foundArticle.sections)) {
          const toc = foundArticle.sections
            .filter((s: ArticleSection) => s.content && s.content.trim().length > 0)
            .map((s: ArticleSection) => ({ id: s.id, title: s.title }))
          
          setTableOfContents(toc)
          if (toc.length > 0) {
            setActiveSection(toc[0].id)
          }
        } else {
          // If no sections, will extract from content HTML after render
          setTableOfContents([])
        }

        // Load related articles
        if (foundArticle) {
          let related: Article[] = []
          
          // First try to get articles from same game
          if (foundArticle.game_slug) {
            related = await articlesService.getByGame(foundArticle.game_slug)
          }
          
          // If not enough, get articles from same category
          if (related.length < 3) {
            const allArticles = await articlesService.getAll()
            const sameCategory = allArticles.filter(
              a => a.category === foundArticle.category && 
                   a.slug !== foundArticle.slug && 
                   a.published !== false
            )
            related = [...related, ...sameCategory]
          }
          
          // Remove current article and limit to 6
          related = related
            .filter(a => a.slug !== foundArticle.slug)
            .slice(0, 6)
          
          setRelatedArticles(related)
        }
      } catch (error) {
        console.error('Error loading article:', error)
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [slug])

  // Extract headings from content after render (only if no sections)
  useEffect(() => {
    if (!article || loading) return
    
    // Only extract if article has no sections
    const hasSections = article.sections && Array.isArray(article.sections) && article.sections.length > 0
    if (hasSections) return
    
    // Wait for content to be rendered - try multiple times
    let attempts = 0
    const maxAttempts = 10
    
    const tryExtract = () => {
      const articleContent = document.querySelector('.article-content')
      if (!articleContent) {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(tryExtract, 200)
        }
        return
      }
      
      const headings = articleContent.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const toc: { id: string; title: string }[] = []
      
      headings.forEach((heading, index) => {
        const text = heading.textContent?.trim() || ''
        if (text) {
          // Generate ID from text (slugify)
          const id = `heading-${index}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
          heading.id = id
          toc.push({ id, title: text })
        }
      })
      
      if (toc.length > 0) {
        setTableOfContents(toc)
        setActiveSection(toc[0].id)
      }
    }
    
    const timeoutId = setTimeout(tryExtract, 100)
    
    return () => clearTimeout(timeoutId)
  }, [article, loading])

  useEffect(() => {
    const handleScroll = () => {
      if (tableOfContents.length === 0) return
      
      const sections = tableOfContents.map(item => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 200

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tableOfContents[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [tableOfContents])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
          <Link to="/" className="text-primary hover:underline">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {game && (
            <>
              <Link 
                to={`/game/${game.slug}`} 
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {game.name}
              </Link>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </>
          )}
          <span className="text-white font-medium">{article.title}</span>
        </nav>
        
        {/* Separator after breadcrumb */}
        <div className="mb-8 border-t border-gray-800"></div>

        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_300px] gap-8">
          {/* Left Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <ArticleAuthor 
                name={article.author || 'Admin'}
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                bio="Gaming enthusiast and guide writer"
              />
              
              {tableOfContents.length > 0 && (
                <Card className="p-4 bg-[#1A1A2E]/95 border border-gray-800">
                  <h3 className="font-bold mb-4 text-sm uppercase text-white text-center">
                    Mục lục
                  </h3>
                  <nav className="space-y-0">
                    {tableOfContents.map((item, index) => (
                      <div key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`block w-full text-left px-3 py-2 text-sm transition-colors ${
                            activeSection === item.id
                              ? 'bg-primary-600 text-white font-medium'
                              : 'text-white hover:bg-primary-700 hover:text-primary-300'
                          }`}
                        >
                          {index + 1}. {item.title}
                        </button>
                        {index < tableOfContents.length - 1 && (
                          <div className="border-t border-gray-700"></div>
                        )}
                      </div>
                    ))}
                  </nav>
                </Card>
              )}
            </div>
          </aside>

          {/* Article Content */}
          <article className="max-w-4xl">
            {/* Article Header */}
            <div className="mb-8">
              <Badge className="mb-4">{article.category}</Badge>
              <h1 className="text-4xl font-bold mb-4">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.published_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author || 'Admin'}</span>
                </div>
              </div>
              
              {/* Separator after date */}
              <div className="my-8 border-t border-gray-800"></div>
              
              {article.cover_image && (
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-[400px] object-cover rounded-lg mb-8"
                />
              )}
            </div>

            {/* Article Excerpt */}
            {article.excerpt && (
              <>
                <div className="text-lg text-muted-foreground mb-6">
                  {article.excerpt}
                </div>
                <Separator className="my-8" />
              </>
            )}

            {/* Article Sections */}
            {article.sections && article.sections.length > 0 ? (
              <div className="space-y-8">
                {article.sections
                  .filter((section: ArticleSection) => section.content && section.content.trim().length > 0)
                  .map((section: ArticleSection, index: number) => (
                    <div key={section.id}>
                      {index > 0 && <Separator className="my-8" />}
                      <section id={section.id} className="scroll-mt-24">
                        <h2 className="text-3xl font-bold mb-6">{section.title}</h2>
                        <div 
                          className="prose prose-invert max-w-none article-content"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </section>
                    </div>
                  ))}
              </div>
            ) : (
              // Fallback to old content format
              <div 
                className="prose prose-invert max-w-none article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <div className="mt-16 pt-8 border-t border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-white">Bài viết liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.id}
                      to={`/article/${relatedArticle.slug}`}
                      className="group block"
                    >
                      <Card className="overflow-hidden hover:border-primary-500 transition-all">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={relatedArticle.cover_image || relatedArticle.image}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <Badge className="absolute top-3 left-3">
                            {relatedArticle.category}
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                            {relatedArticle.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(relatedArticle.published_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Right Sidebar - Related & Social */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="bg-background border border-gray-800 rounded-lg p-6">
                <RelatedArticles articles={relatedArticles.slice(0, 3).map(a => ({
                  title: a.title,
                  slug: a.slug,
                  image: a.cover_image || a.image,
                  date: new Date(a.published_at).toLocaleDateString('vi-VN')
                }))} />
              </div>
              <div className="bg-background border border-gray-800 rounded-lg p-6">
                <SocialFollow />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ArticlePage

