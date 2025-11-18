import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { auctionItemsService, gamesService } from '../../services/supabaseService'
import type { AuctionItem, Game } from '../../lib/supabase'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'

const AdminAuctionItems: React.FC = () => {
  const [items, setItems] = useState<AuctionItem[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AuctionItem | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    game_slug: 'delta-force',
    item_name: '',
    item_image: '',
    current_price: 0,
    change_1d: 0,
    change_7d: 0,
    change_30d: 0,
    item_level: '',
    item_type: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [itemsData, gamesData] = await Promise.all([
        auctionItemsService.getAll(),
        gamesService.getAll()
      ])
      setItems(itemsData)
      setGames(gamesData)
    } catch (error: any) {
      console.error('Error loading data:', error)
      alert('Lỗi khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (item?: AuctionItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        game_slug: item.game_slug,
        item_name: item.item_name,
        item_image: item.item_image || '',
        current_price: item.current_price,
        change_1d: item.change_1d,
        change_7d: item.change_7d,
        change_30d: item.change_30d,
        item_level: item.item_level || '',
        item_type: item.item_type || '',
      })
    } else {
      setEditingItem(null)
      setFormData({
        game_slug: 'delta-force',
        item_name: '',
        item_image: '',
        current_price: 0,
        change_1d: 0,
        change_7d: 0,
        change_30d: 0,
        item_level: '',
        item_type: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingItem) {
        await auctionItemsService.update(editingItem.id, formData)
        alert('Cập nhật item thành công!')
      } else {
        await auctionItemsService.create(formData)
        alert('Tạo item mới thành công!')
      }

      await loadData()
      handleCloseDialog()
    } catch (error: any) {
      console.error('Error saving item:', error)
      alert(`Lỗi: ${error.message || 'Không thể lưu item'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await auctionItemsService.delete(deleteId)
      alert('Xóa item thành công!')
      loadData()
    } catch (error: any) {
      console.error('Error deleting item:', error)
      alert('Lỗi khi xóa item')
    } finally {
      setDeleteId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý Auction House">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Auction House">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Auction House</h2>
            <p className="text-gray-400 mt-1">
              Quản lý giá vật phẩm trong game
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm item
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      Chưa có item nào
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.item_image ? (
                          <img
                            src={item.item_image}
                            alt={item.item_name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-[#0F3460]" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{item.item_name}</TableCell>
                      <TableCell>{item.game_slug}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatPrice(item.current_price)}
                      </TableCell>
                      <TableCell>{item.item_level || '-'}</TableCell>
                      <TableCell>{item.item_type || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Chỉnh sửa Item' : 'Thêm Item mới'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="game_slug">Game *</Label>
                <Select
                  value={formData.game_slug}
                  onValueChange={(value) => setFormData({ ...formData, game_slug: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn game" />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.slug} value={game.slug}>
                        {game.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_name">Tên item *</Label>
                <Input
                  id="item_name"
                  value={formData.item_name}
                  onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_image">URL hình ảnh</Label>
                <Input
                  id="item_image"
                  value={formData.item_image}
                  onChange={(e) => setFormData({ ...formData, item_image: e.target.value })}
                  placeholder="https://..."
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_price">Giá hiện tại *</Label>
                  <Input
                    id="current_price"
                    type="number"
                    value={formData.current_price}
                    onChange={(e) => setFormData({ ...formData, current_price: parseInt(e.target.value) || 0 })}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item_level">Level</Label>
                  <Input
                    id="item_level"
                    value={formData.item_level}
                    onChange={(e) => setFormData({ ...formData, item_level: e.target.value })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="change_1d">1D Change</Label>
                  <Input
                    id="change_1d"
                    type="number"
                    value={formData.change_1d}
                    onChange={(e) => setFormData({ ...formData, change_1d: parseInt(e.target.value) || 0 })}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="change_7d">7D Change</Label>
                  <Input
                    id="change_7d"
                    type="number"
                    value={formData.change_7d}
                    onChange={(e) => setFormData({ ...formData, change_7d: parseInt(e.target.value) || 0 })}
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="change_30d">30D Change</Label>
                  <Input
                    id="change_30d"
                    type="number"
                    value={formData.change_30d}
                    onChange={(e) => setFormData({ ...formData, change_30d: parseInt(e.target.value) || 0 })}
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="item_type">Loại item</Label>
                <Input
                  id="item_type"
                  value={formData.item_type}
                  onChange={(e) => setFormData({ ...formData, item_type: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog} disabled={submitting}>
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingItem ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa item này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}

export default AdminAuctionItems

