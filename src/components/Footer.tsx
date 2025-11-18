import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Youtube, MessageCircle, Mail } from 'lucide-react'
import logo from '../assets/lyghtlyn-logo.png'
import { gamesService } from '../services/supabaseService'
import type { Game } from '../lib/supabase'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const loadGames = async () => {
      const data = await gamesService.getAll()
      setGames(data)
    }
    loadGames()
  }, [])

  return (
    <footer className="bg-[#1A1A2E] border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Lyghtlyn" className="h-12" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Nền tảng hàng đầu về tin tức, hướng dẫn và cộng đồng gaming. 
              Cập nhật những thông tin mới nhất về các tựa game hot nhất.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#16213E] border border-gray-700 flex items-center justify-center hover:bg-primary-700 hover:border-primary-500 transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#16213E] border border-gray-700 flex items-center justify-center hover:bg-primary-700 hover:border-primary-500 transition-colors group"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#16213E] border border-gray-700 flex items-center justify-center hover:bg-primary-700 hover:border-primary-500 transition-colors group"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href="mailto:contact@lyghtlyn.com"
                className="w-10 h-10 rounded-lg bg-[#16213E] border border-gray-700 flex items-center justify-center hover:bg-primary-700 hover:border-primary-500 transition-colors group"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Tin Tức
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  ESports
                </Link>
              </li>
            </ul>
          </div>

          {/* Games */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Games
            </h3>
            <ul className="space-y-3">
              {games.slice(0, 5).map((game) => (
                <li key={game.id}>
                  <Link
                    to={`/game/${game.slug}`}
                    className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                    {game.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Thông tin
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-600 group-hover:bg-primary-400 transition-colors"></span>
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Lyghtlyn Gaming. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Made with ❤️ for gamers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

