import React, { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Gamepad2, Users as UsersIcon, Settings, LogOut, ChevronLeft, ChevronRight, Target, DollarSign } from 'lucide-react'
import { Button } from '../ui/button'

const AdminSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [deltaForceOpen, setDeltaForceOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    { title: 'Bài viết', url: '/admin/articles', icon: FileText },
    { title: 'Games', url: '/admin/games', icon: Gamepad2 },
    { title: 'Admin & Editor', url: '/admin/users', icon: UsersIcon },
    { title: 'Cài đặt', url: '/admin/settings', icon: Settings },
  ]

  const deltaForceItems = [
    { title: 'Weapon Loadouts', url: '/admin/weapon-loadouts', icon: Target },
    { title: 'Auction House', url: '/admin/auction-items', icon: DollarSign },
  ]

  const getNavClass = (isActive: boolean) => {
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-purple-600 text-white shadow-md'
        : 'text-gray-300 hover:bg-primary-700 hover:text-white'
    }`
  }

  const isDeltaForceActive = location.pathname.includes('/admin/weapon-loadouts') || 
                             location.pathname.includes('/admin/auction-items')

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#1A1A2E]/95 border-r border-gray-800 transition-all duration-300 z-50 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo & Toggle */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-bold text-lg text-white">Admin</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-300 hover:text-white hover:bg-primary-700"
        >
          <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end={item.url === '/admin'}
                className={({ isActive }) => getNavClass(isActive)}
                title={collapsed ? item.title : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
              </NavLink>
            )
          })}

          {/* Delta Force Submenu */}
          <div className="mt-2">
            <button
              onClick={() => setDeltaForceOpen(!deltaForceOpen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isDeltaForceActive
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-300 hover:bg-[#0F3460] hover:text-white'
              }`}
              title={collapsed ? 'Delta Force' : undefined}
            >
              <Gamepad2 className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">Delta Force</span>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${deltaForceOpen ? 'rotate-90' : ''}`} 
                  />
                </>
              )}
            </button>

            {!collapsed && deltaForceOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-700 pl-2">
                {deltaForceItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.url}
                      to={item.url}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-purple-500/30 text-white'
                            : 'text-gray-400 hover:bg-primary-700/50 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <Link to="/">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-gray-300 hover:text-white hover:bg-[#0F3460] ${collapsed ? 'px-2' : ''}`}
            title={collapsed ? 'Đăng xuất' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm">Đăng xuất</span>}
          </Button>
        </Link>
      </div>
    </aside>
  )
}

export default AdminSidebar

