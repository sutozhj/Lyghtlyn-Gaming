import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import GamePage from './pages/GamePage'
import ArticlePage from './pages/ArticlePage'
import Warface from './pages/game/Warface'
import Operation from './pages/game/Operation'
import House from './pages/game/House'
import AdminDashboard from './pages/admin/Dashboard'
import AdminArticles from './pages/admin/Articles'
import AdminGames from './pages/admin/Games'
import AdminUsers from './pages/admin/Users'
import AdminWeaponLoadouts from './pages/admin/WeaponLoadouts'
import WeaponLoadoutEditor from './pages/admin/WeaponLoadoutEditor'
import AdminAuctionItems from './pages/admin/AuctionItems'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/game/:slug" element={<Layout><GamePage /></Layout>} />
        <Route path="/article/:slug" element={<Layout><ArticlePage /></Layout>} />
        <Route path="/game/:slug/warface" element={<Layout><Warface /></Layout>} />
        <Route path="/game/:slug/operation" element={<Layout><Operation /></Layout>} />
        <Route path="/game/:slug/nha-dau-gia" element={<Layout><House /></Layout>} />

        {/* Admin Routes - Không cần đăng nhập, chỉ cần route */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/articles" element={<AdminArticles />} />
        <Route path="/admin/games" element={<AdminGames />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        
        {/* Delta Force Admin Routes */}
        <Route path="/admin/weapon-loadouts" element={<AdminWeaponLoadouts />} />
        <Route path="/admin/weapon-loadouts/new" element={<WeaponLoadoutEditor />} />
        <Route path="/admin/weapon-loadouts/edit/:id" element={<WeaponLoadoutEditor />} />
        <Route path="/admin/auction-items" element={<AdminAuctionItems />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
