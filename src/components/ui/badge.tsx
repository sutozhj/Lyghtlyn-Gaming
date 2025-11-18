import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'featured' | 'news' | 'guide'
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    featured: 'bg-red-500 hover:bg-red-600',
    news: 'bg-blue-600 hover:bg-blue-700',
    guide: 'bg-green-600 hover:bg-green-700',
  }
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

