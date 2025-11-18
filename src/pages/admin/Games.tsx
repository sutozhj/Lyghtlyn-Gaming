import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { gamesService, gameSectionsService } from '../../services/supabaseService'
import type { Game } from '../../lib/supabase'

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    description: '',
    sections: [
      { title: '', image: '', slug: '', display_order: 1 },
      { title: '', image: '', slug: '', display_order: 2 },
      { title: '', image: '', slug: '', display_order: 3 },
      { title: '', image: '', slug: '', display_order: 4 }
    ]
  })

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    setLoading(true)
    try {
      const data = await gamesService.getAll()
      setGames(data)
    } catch (error) {
      console.error('Error loading games:', error)
      alert('Không thể tải danh sách games')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = async (game?: Game) => {
    if (game) {
      setEditingGame(game)
      
      // Load sections for this game
      const sections = await gameSectionsService.getByGame(game.slug)
      const sectionsData = [
        { title: '', image: '', slug: '', display_order: 1 },
        { title: '', image: '', slug: '', display_order: 2 },
        { title: '', image: '', slug: '', display_order: 3 },
        { title: '', image: '', slug: '', display_order: 4 }
      ]
      
      // Fill in existing sections
      sections.forEach((section, idx) => {
        if (idx < 4) {
          sectionsData[idx] = {
            title: section.title,
            image: section.image,
            slug: section.slug,
            display_order: section.display_order
          }
        }
      })
      
      setFormData({
        name: game.name,
        slug: game.slug,
        icon: game.icon,
        description: game.description || '',
        sections: sectionsData
      })
    } else {
      setEditingGame(null)
      setFormData({
        name: '',
        slug: '',
        icon: '',
        description: '',
        sections: [
          { title: '', image: '', slug: '', display_order: 1 },
          { title: '', image: '', slug: '', display_order: 2 },
          { title: '', image: '', slug: '', display_order: 3 },
          { title: '', image: '', slug: '', display_order: 4 }
        ]
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingGame(null)
    setFormData({
      name: '',
      slug: '',
      icon: '',
      description: '',
      sections: [
        { title: '', image: '', slug: '', display_order: 1 },
        { title: '', image: '', slug: '', display_order: 2 },
        { title: '', image: '', slug: '', display_order: 3 },
        { title: '', image: '', slug: '', display_order: 4 }
      ]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const gameData = {
        name: formData.name,
        slug: formData.slug,
        icon: formData.icon,
        description: formData.description
      }
      
      // Save game first
      if (editingGame) {
        await gamesService.update(editingGame.id, gameData)
      } else {
        await gamesService.create(gameData)
      }
      
      // Delete existing sections for this game
      const existingSections = await gameSectionsService.getByGame(formData.slug)
      for (const section of existingSections) {
        await gameSectionsService.delete(section.id)
      }
      
      // Save new sections (only if they have title and image)
      for (const section of formData.sections) {
        if (section.title && section.image) {
          await gameSectionsService.create({
            game_slug: formData.slug,
            title: section.title,
            slug: section.slug || section.title.toLowerCase().replace(/\s+/g, '-'),
            image: section.image,
            display_order: section.display_order
          })
        }
      }
      
      await loadGames()
      handleCloseDialog()
    } catch (error: any) {
      console.error('Error saving game:', error)
      alert(`Lỗi: ${error.message || 'Không thể lưu game'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSectionChange = (index: number, field: 'title' | 'image' | 'slug', value: string) => {
    const newSections = [...formData.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setFormData({ ...formData, sections: newSections })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa game này?')) {
      try {
        await gamesService.delete(id)
        await loadGames()
      } catch (error: any) {
        console.error('Error deleting game:', error)
        alert(`Lỗi: ${error.message || 'Không thể xóa game'}`)
      }
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý Games">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Games">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Games</h2>
            <p className="text-gray-400">Quản lý danh sách games trên website</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm Game
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Games ({games.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="p-4 border border-gray-700 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img 
                      src={game.icon} 
                      alt={game.name} 
                      className="h-12 w-12 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/48'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{game.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{game.slug}</p>
                      {game.description && (
                        <p className="text-xs text-gray-500 mt-1">{game.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleOpenDialog(game)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(game.id)}
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
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingGame ? 'Chỉnh sửa Game' : 'Thêm Game mới'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên Game *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
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
                  placeholder="vd: delta-force"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon URL *</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  required
                  placeholder="URL hoặc đường dẫn đến icon"
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả ngắn về game"
                  disabled={submitting}
                />
              </div>

              {/* Game Sections */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Sections (Phần Nổi bật)</h4>
                  <p className="text-xs text-gray-400 mb-4">
                    Tối đa 4 sections hiển thị ở trang game. Để trống nếu không cần.
                  </p>
                </div>

                {formData.sections.map((section, index) => (
                  <div key={index} className="p-3 bg-[#0F3460] rounded-lg space-y-3">
                    <div className="font-medium text-sm text-gray-300">Section {index + 1}</div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`section-title-${index}`} className="text-xs">
                        Tiêu đề (Text) *
                      </Label>
                      <Input
                        id={`section-title-${index}`}
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        placeholder="VD: WARFACE, OPERATION..."
                        disabled={submitting}
                        className="bg-[#1A1A2E]/95"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`section-slug-${index}`} className="text-xs">
                        Slug (URL)
                      </Label>
                      <Input
                        id={`section-slug-${index}`}
                        value={section.slug}
                        onChange={(e) => handleSectionChange(index, 'slug', e.target.value)}
                        placeholder="VD: warface (để trống sẽ tự động tạo từ title)"
                        disabled={submitting}
                        className="bg-[#1A1A2E]/95"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`section-image-${index}`} className="text-xs">
                        Background Image URL *
                      </Label>
                      <Input
                        id={`section-image-${index}`}
                        value={section.image}
                        onChange={(e) => handleSectionChange(index, 'image', e.target.value)}
                        placeholder="https://..."
                        disabled={submitting}
                        className="bg-[#1A1A2E]/95"
                      />
                      {section.image && (
                        <div className="mt-2">
                          <img 
                            src={section.image} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x100?text=Invalid+Image'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingGame ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default Games
