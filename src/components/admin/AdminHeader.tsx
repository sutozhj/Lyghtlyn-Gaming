import React from 'react'
import { Search, Bell, Home } from 'lucide-react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

interface AdminHeaderProps {
  title?: string
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title = 'Dashboard' }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#16213E]/95 backdrop-blur supports-[backdrop-filter]:bg-[#16213E]/60">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Page Title */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-9 pr-4 py-2 bg-[#0F3460]/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View Site */}
          <Link to="/">
            <Button variant="ghost" size="icon" title="Xem trang web">
              <Home className="h-5 w-5" />
            </Button>
          </Link>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-purple-500" />
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-purple-600 hover:bg-purple-700">
            <span className="text-white text-sm font-semibold">A</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader

