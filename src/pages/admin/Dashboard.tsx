import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Gamepad2, Users, ArrowUpRight, ArrowDownRight, TrendingUp, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import AdminLayout from '../../components/admin/AdminLayout'

// Mock data - không cần database
const mockStats = {
  totalArticles: 45,
  publishedArticles: 38,
  totalGames: 6,
  recentArticles: 12
}

const chartData = [
  { name: 'T2', value: 12 },
  { name: 'T3', value: 19 },
  { name: 'T4', value: 15 },
  { name: 'T5', value: 25 },
  { name: 'T6', value: 22 },
  { name: 'T7', value: 30 },
  { name: 'CN', value: 28 },
]

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState(mockStats)

  // Simulate loading data (có thể thay bằng API call sau)
  useEffect(() => {
    // Mock data - không cần database
    setStats(mockStats)
  }, [])

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-gray-400">
            Chào mừng đến với Admin Panel
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Articles Card */}
          <Card className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                <span>Tổng bài viết</span>
                <FileText className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
                <span className="flex items-center text-xs text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  12%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {stats.publishedArticles} đã xuất bản
              </p>
              {/* Simple chart visualization */}
              <div className="mt-3 h-12 flex items-end gap-1">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-purple-600 rounded-t"
                    style={{ height: `${(item.value / 30) * 100}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Articles Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                <span>Bài viết mới</span>
                <Clock className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stats.recentArticles}</div>
                <span className="flex items-center text-xs text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  8%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Trong 7 ngày qua
              </p>
              {/* Simple chart visualization */}
              <div className="mt-3 h-12 flex items-end gap-1">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${(item.value / 30) * 100}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Games Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                <span>Tổng game</span>
                <Gamepad2 className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stats.totalGames}</div>
                <span className="flex items-center text-xs text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  5%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Đang hoạt động
              </p>
              {/* Simple chart visualization */}
              <div className="mt-3 h-12 flex items-end gap-1">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${(item.value * 0.3 / 10) * 100}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publish Rate Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center justify-between">
                <span>Tỷ lệ xuất bản</span>
                <TrendingUp className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">
                  {stats.totalArticles > 0 
                    ? Math.round((stats.publishedArticles / stats.totalArticles) * 100)
                    : 0}%
                </div>
                <span className="flex items-center text-xs text-red-400">
                  <ArrowDownRight className="h-3 w-3" />
                  2%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Bài viết đã công khai
              </p>
              {/* Simple chart visualization */}
              <div className="mt-3 h-12 flex items-end gap-1">
                {chartData.map((item, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-orange-500 rounded-t"
                    style={{ height: `${(item.value * 3 / 90) * 100}%` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Thao tác nhanh</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-purple-500 cursor-pointer">
              <Link to="/admin/articles">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-3 group-hover:bg-purple-600/30 transition-colors">
                    <FileText className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Quản lý Bài viết</CardTitle>
                  <CardDescription>
                    Tạo, chỉnh sửa và quản lý các bài viết của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Xem bài viết
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-purple-500 cursor-pointer">
              <Link to="/admin/games">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-3 group-hover:bg-purple-600/30 transition-colors">
                    <Gamepad2 className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Quản lý Game</CardTitle>
                  <CardDescription>
                    Thêm và cập nhật thông tin các game
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Xem game
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-purple-500 cursor-pointer">
              <Link to="/admin/users">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-3 group-hover:bg-purple-600/30 transition-colors">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Quản lý Admin & Editor</CardTitle>
                  <CardDescription>
                    Quản lý tài khoản Admin và Editor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    Xem Admin & Editor
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard

