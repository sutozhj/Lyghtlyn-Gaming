import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/lyghtlyn-logo.png'
import bannerImage from '../assets/images/banner/banner-br.png'
import { gamesService } from '../services/supabaseService'
import type { Game } from '../lib/supabase'
import Footer from './Footer'
import TypewriterComponent from './Typewriter'
import '../styles/animated-hover.css'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const [games, setGames] = useState<Game[]>([])
  const [hoverBg, setHoverBg] = useState<{
    left: number
    width: number
    opacity: number
  }>({ left: 0, width: 0, opacity: 0 })
  const [sidebarHoverBg, setSidebarHoverBg] = useState<{
    top: number
    height: number
    opacity: number
  }>({ top: 0, height: 0, opacity: 0 })

  useEffect(() => {
    // Load games từ Supabase
    const loadGames = async () => {
      const data = await gamesService.getAll()
      setGames(data)
    }
    loadGames()
  }, [])

  const handleNavHover = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect()
    if (parentRect) {
      setHoverBg({
        left: rect.left - parentRect.left,
        width: rect.width,
        opacity: 1
      })
    }
  }

  const handleNavLeave = () => {
    setHoverBg(prev => ({ ...prev, opacity: 0 }))
  }

  const handleSidebarHover = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const container = e.currentTarget.closest('.space-y-2')
    const containerRect = container?.getBoundingClientRect()
    if (containerRect) {
      setSidebarHoverBg({
        top: rect.top - containerRect.top,
        height: rect.height,
        opacity: 1
      })
    }
  }

  const handleSidebarLeave = () => {
    setSidebarHoverBg(prev => ({ ...prev, opacity: 0 }))
  }

  const getGameSlug = () => {
    const path = location.pathname
    if (path.startsWith('/game/')) {
      return path.split('/game/')[1]
    }
    return null
  }

  const activeGameSlug = getGameSlug()

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Top Navigation Bar - sticky when scroll */}
      <header className="sticky top-0 left-0 right-0 bg-[#1A1A2E]/95 backdrop-blur border-b border-gray-800 px-6 z-50">
        <div className="flex h-16 items-center md:pl-20 md:pr-6 gap-4 px-4">
          {/* Logo */}
          <Link to="/">
            <img src={logo} alt="Lyghtlyn" className="h-14" />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 ml-4 md-flex relative">
            {/* Animated background */}
            <div
              className="animated-hover-bg animated-hover-bg-horizontal"
              style={{
                left: `${hoverBg.left}px`,
                width: `${hoverBg.width}px`,
                opacity: hoverBg.opacity,
                transform: 'translateY(-50%)',
                top: '50%'
              }}
            />

            {/* Games hover dropdown */}
            <div className="relative group z-10">
              <div
                className="flex items-center gap-1 cursor-pointer hover-text-primary-400 px-3 py-2 rounded-lg transition-colors"
                onMouseEnter={handleNavHover}
                onMouseLeave={handleNavLeave}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="6" x2="10" y1="11" y2="11"></line><line x1="8" x2="8" y1="9" y2="13"></line><line x1="15" x2="15.01" y1="12" y2="12"></line><line x1="18" x2="18.01" y1="10" y2="10"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path></svg>
                <span>Games</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {/* Horizontal game list on hover - no gap, with hover bridge */}
              <div className="absolute left-0 top-full hidden group-hover:block pt-2 z-30">
                <div className="bg-[#1A1A2E]/95 border border-gray-700 rounded-xl p-4 shadow-xl">
                  <div className="flex items-stretch gap-4">
                    {games.map((g) => (
                      <Link
                        key={g.slug}
                        to={`/game/${g.slug}`}
                        className={`group/item w-36 rounded-lg px-3 py-3 flex flex-col items-center gap-2 transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-ring-primary focus-visible:ring-2 ${activeGameSlug === g.slug ? 'ring-1 ring-primary' : ''}`}
                      >
                        <img
                          src={g.icon}
                          alt={g.name}
                          className="w-10 h-10 object-contain transition-transform duration-200 group-hover/item:scale-105"
                        />
                        <span className="text-center text-sm text-gray-200 transition-colors duration-200">
                          {g.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/"
              className="hover-text-primary-400 px-3 py-2 rounded-lg transition-colors relative z-10"
              onMouseEnter={handleNavHover}
              onMouseLeave={handleNavLeave}
            >
              Tin Tức
            </Link>
            <Link
              to="/"
              className="hover-text-primary-400 px-3 py-2 rounded-lg transition-colors relative z-10"
              onMouseEnter={handleNavHover}
              onMouseLeave={handleNavLeave}
            >
              Reviews
            </Link>
            <Link
              to="/"
              className="hover-text-primary-400 px-3 py-2 rounded-lg transition-colors relative z-10"
              onMouseEnter={handleNavHover}
              onMouseLeave={handleNavLeave}
            >
              Guides
            </Link>
            <Link
              to="/"
              className="hover-text-primary-400 px-3 py-2 rounded-lg transition-colors relative z-10"
              onMouseEnter={handleNavHover}
              onMouseLeave={handleNavLeave}
            >
              ESports
            </Link>
          </div>

          {/* Search and Login */}
          <div className="flex-1 flex items-center gap-4 justify-end">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                className="bg-[#16213e] border border-gray-700 rounded-lg px-4 py-2 pl-10 w-64 text-sm focus:outline-none focus:border-primary-500"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Link to="/admin">
              <button className="bg-primary-600 hover-bg-primary-700 px-6 py-2 rounded-lg font-medium transition-colors">
                Đăng nhập
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Left Sidebar - fixed position, doesn't affect content layout */}
      <aside className="group fixed left-0 top-0 h-screen w-20 hover:w-60 transition-all duration-300 border-r border-gray-800 bg-[#1A1A2E]/50 backdrop-blur-sm z-40 hidden md:flex flex-col items-center py-4 gap-2 pt-16">

        <div className="px-2 w-full">
          <div className="flex items-center gap-3 px-2 h-12 rounded-lg cursor-default">
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
              Tất Cả Games
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="w-8 h-px bg-gray-700 my-2" />

        {/* Games List */}
        <div className="space-y-2 w-full px-2 relative">
          {/* Animated background for sidebar */}
          <div
            className="animated-hover-bg animated-hover-bg-vertical"
            style={{
              top: `${sidebarHoverBg.top}px`,
              height: `${sidebarHoverBg.height}px`,
              opacity: sidebarHoverBg.opacity,
              marginLeft: '0.5rem',
              marginRight: '0.5rem',
              width: 'calc(100% - 1rem)'
            }}
          />

          {games.map((g) => (
            <div
              key={g.slug}
              className="relative w-full flex items-center px-2"
            >
              <Link
                to={`/game/${g.slug}`}
                className={`w-full h-12 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-ring-primary focus-visible:ring-2 flex items-center justify-start gap-3 px-2 relative z-10 ${activeGameSlug === g.slug ? 'bg-primary-600 hover:bg-primary-600' : ''
                  }`}
                onMouseEnter={handleSidebarHover}
                onMouseLeave={handleSidebarLeave}
              >
                <img
                  src={g.icon}
                  alt={g.name}
                  className="h-8 w-8 rounded object-cover shrink-0 transition-transform duration-200 hover:scale-105"
                />
                <span className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap text-sm ${activeGameSlug === g.slug ? 'font-medium' : ''
                  }`}>
                  {g.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area - padding-left để tránh bị sidebar che, max-width để co lại cho đẹp */}
      <main className="px-8 pb-8 pl-20 md:pl-20 max-w-[1400px] mx-auto">
        {/* Banner - rộng hơn section, scroll bình thường */}
        <div
          className="relative select-none md:ml-24 md:block md:h-[160px] mb-8 -mx-8 md:-mx-12 lg:-mx-16 overflow-hidden md:rounded-tl-[32px]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.5)), url("${bannerImage}")`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            minHeight: '120px'
          }}
        >
          <div className="relative flex h-full min-h-[120px] flex-col justify-between md:min-h-0 z-10">
            {/* Gradient overlay từ trái/phải */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                maxWidth: '1824px',
                margin: '0 auto',
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(90deg, rgb(0, 0, 0), transparent 25%, transparent 75%, rgb(0, 0, 0))',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center'
              }}
            ></div>

            {/* Content */}
            <div className="flex flex-shrink-0 flex-col justify-between gap-8 px-9 py-10 md:h-[88px] md:flex-row md:pt-16 md:pb-0 relative z-10">
              <div className="text-gray-200 flex h-full items-center gap-2 text-[28px]">
                Welcome to{' '}
                <span
                  className="font-bold relative inline-block typewriter-wrapper"
                  style={{
                    fontFamily: "'Orbitron', 'Righteous', sans-serif",
                    fontStyle: 'italic',
                    transform: 'skew(-5deg)'
                  }}
                >
                  <TypewriterComponent
                    strings={['Lyghtlyn Gaming']}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        <section>
          {children}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Layout

