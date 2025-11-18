import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { weaponLoadoutsService, gamesService } from '../../services/supabaseService'
import type { Game } from '../../lib/supabase'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent } from '../../components/ui/dialog'

const weaponTypeMapping: Record<string, string[]> = {
  'Assault Rifle': ['AK-47', 'K416', 'M4A1', 'QBZ95-1', 'CI-19', 'M7', 'AKM', 'AUG'],
  'SMG': ['SR-2 Veresek', 'MP5', 'Magpul FMG-9', 'LWRC SMG-45', 'PM-98', 'MP7', 'SR-3M', 'Vector'],
  'LMG': ['PKM', 'M249', 'QJB201'],
  'Shotgun': ['SPAS-12', 'Fabarm P.S.S.10', 'M1014', 'S12K', 'M870'],
  'DMR': ['Mini-14', 'SR-25', 'M14'],
  'Sniper Rifle': ['ORSIS T-5000', 'AWM', 'SV-98', 'M700', 'R93'],
  'Pistol': ['G18', 'Desert Eagle', '.357 Caliber Revolver', '93R', 'M1911', 'QSZ-92G', 'G17'],
}

const WeaponLoadoutEditor: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [saving, setSaving] = useState(false)
  const [games, setGames] = useState<Game[]>([])
  const [availableWeapons, setAvailableWeapons] = useState<string[]>([])
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [formData, setFormData] = useState({
    game_slug: 'delta-force',
    weapon_name: '',
    weapon_type: '',
    weapon_name_filter: '',
    thumbnail_url: '',
    loadout_code: '',
    author: 'Lyghtlyn',
    category: 'warface' as 'warface' | 'operation',
  })

  useEffect(() => {
    loadGames()
    if (id && id !== 'new') {
      loadLoadout()
    }
  }, [id])

  useEffect(() => {
    if (formData.weapon_type) {
      setAvailableWeapons(weaponTypeMapping[formData.weapon_type] || [])
      if (formData.weapon_name && !weaponTypeMapping[formData.weapon_type]?.includes(formData.weapon_name)) {
        setFormData(prev => ({ ...prev, weapon_name: '', weapon_name_filter: '' }))
      }
    } else {
      setAvailableWeapons([])
    }
  }, [formData.weapon_type])

  const loadGames = async () => {
    const data = await gamesService.getAll()
    setGames(data)
  }

  const loadLoadout = async () => {
    try {
      const data = await weaponLoadoutsService.getById(parseInt(id!))
      if (data) {
        setFormData(data)
      }
    } catch (error: any) {
      console.error('Error loading loadout:', error)
      alert('Lỗi khi tải loadout')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (id && id !== 'new') {
        await weaponLoadoutsService.update(parseInt(id), formData)
        alert('Cập nhật loadout thành công!')
      } else {
        await weaponLoadoutsService.create(formData)
        alert('Tạo loadout mới thành công!')
      }

      navigate('/admin/weapon-loadouts')
    } catch (error: any) {
      console.error('Error saving loadout:', error)
      alert(`Lỗi: ${error.message || 'Không thể lưu loadout'}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title={id && id !== 'new' ? 'Chỉnh sửa Loadout' : 'Tạo Loadout mới'}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/weapon-loadouts')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold">
            {id && id !== 'new' ? 'Chỉnh sửa Loadout' : 'Tạo Loadout mới'}
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin Loadout</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="category">Loại *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: 'warface' | 'operation') => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warface">Warface</SelectItem>
                        <SelectItem value="operation">Operation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weapon_type">Loại súng *</Label>
                    <Select
                      value={formData.weapon_type}
                      onValueChange={(value) => setFormData({ ...formData, weapon_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại súng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Assault Rifle">Assault Rifle</SelectItem>
                        <SelectItem value="SMG">SMG</SelectItem>
                        <SelectItem value="LMG">LMG</SelectItem>
                        <SelectItem value="Sniper Rifle">Sniper Rifle</SelectItem>
                        <SelectItem value="Shotgun">Shotgun</SelectItem>
                        <SelectItem value="Pistol">Pistol</SelectItem>
                        <SelectItem value="DMR">DMR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weapon_name">Tên súng *</Label>
                    <Select
                      value={formData.weapon_name}
                      onValueChange={(value) => setFormData({ ...formData, weapon_name: value, weapon_name_filter: value })}
                      disabled={!formData.weapon_type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.weapon_type ? 'Chọn súng' : 'Chọn loại súng trước'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWeapons.map((weapon) => (
                          <SelectItem key={weapon} value={weapon}>
                            {weapon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weapon_name_filter">Tên súng (để lọc) *</Label>
                  <Input
                    id="weapon_name_filter"
                    value={formData.weapon_name_filter}
                    onChange={(e) => setFormData({ ...formData, weapon_name_filter: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">URL Thumbnail</Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail_url"
                      value={formData.thumbnail_url || ''}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      placeholder="https://..."
                    />
                    {formData.thumbnail_url && (
                      <Button type="button" variant="outline" size="icon" onClick={() => setShowImagePreview(true)}>
                        <img src={formData.thumbnail_url} alt="Preview" className="w-6 h-6 object-cover" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loadout_code">Code súng *</Label>
                  <Textarea
                    id="loadout_code"
                    value={formData.loadout_code}
                    onChange={(e) => setFormData({ ...formData, loadout_code: e.target.value })}
                    required
                    rows={3}
                    placeholder="6I04C2G0FSH6GRF76DG60"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {id && id !== 'new' ? 'Cập nhật' : 'Tạo mới'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/weapon-loadouts')}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Image Preview Dialog */}
      {showImagePreview && formData.thumbnail_url && (
        <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
          <DialogContent className="max-w-3xl">
            <img src={formData.thumbnail_url} alt="Thumbnail" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  )
}

export default WeaponLoadoutEditor

