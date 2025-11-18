import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { articlesService, gamesService } from '../../services/supabaseService'
import type { Article, Game } from '../../lib/supabase'
import RichTextEditor from '../../components/admin/RichTextEditor'

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image: '',
    cover_image: '',
    category: 'News',
    game_slug: '',
    author: 'Admin User',
    author_id: 'admin',
    published_at: new Date().toISOString().split('T')[0],
    featured: false,
    published: true,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [articlesData, gamesData] = await Promise.all([
        articlesService.getAll(),
        gamesService.getAll()
      ])
      setArticles(articlesData)
      setGames(gamesData)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (article?: Article) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        image: article.image,
        cover_image: article.cover_image || '',
        category: article.category,
        game_slug: article.game_slug || '',
        author: article.author,
        author_id: article.author_id || 'admin',
        published_at: article.published_at,
        featured: article.featured || false,
        published: article.published !== false,
      })
    } else {
      setEditingArticle(null)
      setFormData({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        image: '',
        cover_image: '',
        category: 'News',
        game_slug: '',
        author: 'Admin User',
        author_id: 'admin',
        published_at: new Date().toISOString().split('T')[0],
        featured: false,
        published: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingArticle(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingArticle) {
        await articlesService.update(editingArticle.id, formData)
      } else {
        await articlesService.create(formData)
      }
      
      await loadData()
      handleCloseDialog()
    } catch (error: any) {
      console.error('Error saving article:', error)
      alert(`Lỗi: ${error.message || 'Không thể lưu bài viết'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      try {
        await articlesService.delete(id)
        await loadData()
      } catch (error: any) {
        console.error('Error deleting article:', error)
        alert(`Lỗi: ${error.message || 'Không thể xóa bài viết'}`)
      }
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title,
      slug: generateSlug(title)
    })
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý Bài viết">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Bài viết">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Bài viết</h2>
            <p className="text-gray-400">Quản lý tin tức, reviews, guides</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm Bài viết
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Bài viết ({articles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between p-4 border border-gray-700 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${article.image} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{article.title}</h3>
                        {article.featured && (
                          <span className="px-2 py-0.5 text-xs bg-purple-600 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{article.category}</span>
                        {article.game_slug && <span>• {games.find(g => g.slug === article.game_slug)?.name}</span>}
                        <span>• {article.author}</span>
                        <span>• {article.published_at}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDialog(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? 'Chỉnh sửa Bài viết' : 'Thêm Bài viết mới'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    placeholder="Tiêu đề bài viết"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="duong-dan-url"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Mô tả ngắn *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  placeholder="Mô tả ngắn hiển thị trong danh sách bài viết"
                  rows={2}
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung *</Label>
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    disabled={submitting}
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0F3460]/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="News">News</option>
                    <option value="Review">Review</option>
                    <option value="Guide">Guide</option>
                    <option value="ESports">ESports</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game_slug">Game</Label>
                  <select
                    id="game_slug"
                    value={formData.game_slug}
                    onChange={(e) => setFormData({ ...formData, game_slug: e.target.value })}
                    disabled={submitting}
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-[#0F3460]/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-- Chọn game --</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.slug}>
                        {game.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image">URL Ảnh bìa</Label>
                <Input
                  id="cover_image"
                  value={formData.cover_image}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  disabled={submitting}
                />
                <p className="text-xs text-gray-500">Ảnh hiển thị trong trang chi tiết bài viết</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Class Gradient cho thumbnail *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    placeholder="from-gray-900 to-purple-900"
                    disabled={submitting}
                  />
                  <p className="text-xs text-gray-500">VD: from-gray-900 to-purple-900</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="published_at">Ngày xuất bản *</Label>
                  <Input
                    id="published_at"
                    type="date"
                    value={formData.published_at}
                    onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0F3460]/50 text-purple-600 focus:ring-purple-500"
                    disabled={submitting}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Đặt làm bài viết nổi bật
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-[#0F3460]/50 text-purple-600 focus:ring-purple-500"
                    disabled={submitting}
                  />
                  <Label htmlFor="published" className="cursor-pointer">
                    Xuất bản ngay
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingArticle ? 'Cập nhật' : 'Xuất bản'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default Articles
