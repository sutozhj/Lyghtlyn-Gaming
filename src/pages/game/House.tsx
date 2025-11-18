import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { auctionItemsService } from '../../services/supabaseService'
import type { AuctionItem } from '../../lib/supabase'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'

const House: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [items, setItems] = useState<AuctionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [slug])

  const loadItems = async () => {
    try {
      const data = await auctionItemsService.getByGame(slug || 'delta-force')
      setItems(data)
    } catch (error) {
      console.error('Error loading items:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const formatChange = (change: number) => {
    const formatted = new Intl.NumberFormat('vi-VN', { 
      signDisplay: 'always' 
    }).format(change)
    const colorClass = change > 0 ? 'text-green-500' : change < 0 ? 'text-red-500' : 'text-gray-400'
    return <span className={colorClass}>{formatted}</span>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">Auction House</h1>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>
        <p className="text-gray-400">Theo dõi giá vật phẩm trong game</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          Chưa có dữ liệu
        </div>
      ) : (
        <div className="rounded-lg border border-gray-700 bg-[#1A1A2E]/95 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Image</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">1D Change</TableHead>
                <TableHead className="text-right">7D Change</TableHead>
                <TableHead className="text-right">30D Change</TableHead>
                <TableHead>Item Level</TableHead>
                <TableHead>Item Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
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
                  <TableCell className="text-right font-mono">
                    {formatPrice(item.current_price)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatChange(item.change_1d)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatChange(item.change_7d)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatChange(item.change_30d)}
                  </TableCell>
                  <TableCell>{item.item_level || '-'}</TableCell>
                  <TableCell>{item.item_type || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

export default House

