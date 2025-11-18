import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white">
      <AdminSidebar />
      <div className="pl-16 lg:pl-64 transition-all duration-300">
        <AdminHeader title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

