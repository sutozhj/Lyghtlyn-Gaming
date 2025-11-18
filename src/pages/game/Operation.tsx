import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { weaponLoadoutsService } from '../../services/supabaseService'
import type { WeaponLoadout } from '../../lib/supabase'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Copy, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Dialog, DialogContent } from '../../components/ui/dialog'

const Operation: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [loadouts, setLoadouts] = useState<WeaponLoadout[]>([])
  const [filteredLoadouts, setFilteredLoadouts] = useState<WeaponLoadout[]>([])
  const [loading, setLoading] = useState(true)
  const [filterWeaponType, setFilterWeaponType] = useState<string>('all')
  const [filterWeaponName, setFilterWeaponName] = useState<string>('all')
  const [weaponTypes, setWeaponTypes] = useState<string[]>([])
  const [weaponNames, setWeaponNames] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    loadLoadouts()
  }, [slug])

  const loadLoadouts = async () => {
    try {
      const data = await weaponLoadoutsService.getByCategory(slug || 'delta-force', 'operation')
      setLoadouts(data)
      setFilteredLoadouts(data)
      
      // Extract unique weapon types and names
      const uniqueTypes = Array.from(new Set(data.map(l => l.weapon_type).filter(Boolean)))
      const uniqueNames = Array.from(new Set(data.map(l => l.weapon_name_filter).filter(Boolean)))
      setWeaponTypes(uniqueTypes)
      setWeaponNames(uniqueNames)
    } catch (error) {
      console.error('Error loading loadouts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = loadouts
    
    if (filterWeaponType !== 'all') {
      filtered = filtered.filter(l => l.weapon_type === filterWeaponType)
    }
    
    if (filterWeaponName !== 'all') {
      filtered = filtered.filter(l => l.weapon_name_filter === filterWeaponName)
    }
    
    setFilteredLoadouts(filtered)
  }, [filterWeaponType, filterWeaponName, loadouts])

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    alert('Đã copy code!')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">Operation Loadouts</h1>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>
        <p className="text-gray-400">Các build súng tối ưu cho Operation mode</p>
      </div>

      {/* Filter Section */}
      <Card className="mb-6 p-4">
        <div className="flex items-center gap-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <Select value={filterWeaponType} onValueChange={setFilterWeaponType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo loại súng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại súng</SelectItem>
              {weaponTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterWeaponName} onValueChange={setFilterWeaponName}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Lọc theo tên súng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả súng</SelectItem>
              {weaponNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : filteredLoadouts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Chưa có loadout nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoadouts.map((loadout) => (
            <Card key={loadout.id} className="group overflow-hidden hover:border-purple-600/50 transition-all">
              <div className="relative overflow-hidden bg-[#1A1A2E]/95">
                {loadout.thumbnail_url ? (
                  <img
                    src={loadout.thumbnail_url}
                    alt={loadout.weapon_name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(loadout.thumbnail_url!)}
                  />
                ) : (
                  <div className="w-full h-48 bg-[#0F3460] flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-bold text-lg">{loadout.weapon_name}</h3>
                <p className="text-sm text-gray-400">by {loadout.author}</p>
                <div className="flex items-center gap-2 p-3 bg-[#0F3460] rounded-lg">
                  <code className="flex-1 text-sm break-all">{loadout.loadout_code}</code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copyToClipboard(loadout.loadout_code)}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Preview Dialog */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <img src={selectedImage} alt="Preview" className="w-full h-auto" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default Operation

