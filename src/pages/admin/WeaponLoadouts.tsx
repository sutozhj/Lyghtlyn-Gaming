import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { weaponLoadoutsService } from '../../services/supabaseService'
import type { WeaponLoadout } from '../../lib/supabase'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { Badge } from '../../components/ui/badge'
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

const AdminWeaponLoadouts: React.FC = () => {
  const navigate = useNavigate()
  const [loadouts, setLoadouts] = useState<WeaponLoadout[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    loadLoadouts()
  }, [])

  const loadLoadouts = async () => {
    try {
      const data = await weaponLoadoutsService.getAll()
      setLoadouts(data)
    } catch (error: any) {
      console.error('Error loading loadouts:', error)
      alert('Lỗi khi tải danh sách loadouts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await weaponLoadoutsService.delete(deleteId)
      alert('Xóa loadout thành công!')
      loadLoadouts()
    } catch (error: any) {
      console.error('Error deleting loadout:', error)
      alert('Lỗi khi xóa loadout')
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Quản lý Weapon Loadouts">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Quản lý Weapon Loadouts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Quản lý Weapon Loadouts</h2>
            <p className="text-gray-400 mt-1">
              Quản lý loadout súng cho Delta Force
            </p>
          </div>
          <Button onClick={() => navigate('/admin/weapon-loadouts/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm loadout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Loadouts ({loadouts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Tên súng</TableHead>
                  <TableHead>Game</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadouts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      Chưa có loadout nào
                    </TableCell>
                  </TableRow>
                ) : (
                  loadouts.map((loadout) => (
                    <TableRow key={loadout.id}>
                      <TableCell>
                        {loadout.thumbnail_url ? (
                          <img
                            src={loadout.thumbnail_url}
                            alt={loadout.weapon_name}
                            className="h-12 w-20 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-20 rounded bg-[#0F3460]" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{loadout.weapon_name}</TableCell>
                      <TableCell>{loadout.game_slug}</TableCell>
                      <TableCell>
                        <Badge variant={loadout.category === 'warface' ? 'default' : 'secondary'}>
                          {loadout.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400">
                        {loadout.author}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/weapon-loadouts/edit/${loadout.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(loadout.id)}
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loadout này? Hành động này không thể hoàn tác.
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

export default AdminWeaponLoadouts

