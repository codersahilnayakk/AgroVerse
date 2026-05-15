import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { FaChartPie, FaFileAlt, FaUsers, FaQuestionCircle, FaChartLine, FaSeedling, FaLanguage, FaCog, FaSignOutAlt, FaBars, FaTimes, FaMoon, FaSun, FaBell, FaSearch } from 'react-icons/fa';
import AdminContext from '../../context/AdminContext';

const NAV = [
  { to: '/admin/dashboard', icon: <FaChartPie />, label: 'Dashboard' },
  { to: '/admin/schemes', icon: <FaFileAlt />, label: 'Schemes' },
  { to: '/admin/farmers', icon: <FaUsers />, label: 'Farmers' },
  { to: '/admin/queries', icon: <FaQuestionCircle />, label: 'Queries' },
  { to: '/admin/analytics', icon: <FaChartLine />, label: 'Analytics' },
  { to: '/admin/advisory', icon: <FaSeedling />, label: 'Crop Advisory' },
  { to: '/admin/languages', icon: <FaLanguage />, label: 'Languages' },
  { to: '/admin/settings', icon: <FaCog />, label: 'Settings' },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useContext(AdminContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(false);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!admin) return <Navigate to="/admin" replace />;

  const handleLogout = () => { logout(); navigate('/admin'); };

  return (
    <div className={`admin-root flex min-h-screen ${dark ? 'admin-dark' : ''}`}>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ─── Sidebar ─── */}
      <aside className={`admin-sidebar fixed lg:sticky top-0 left-0 h-screen w-64 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
            <FaSeedling className="text-white text-sm" />
          </div>
          <span className="text-lg font-extrabold text-white tracking-tight">AgroVerse</span>
          <span className="ml-auto text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">ADMIN</span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 flex-shrink-0">
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
              {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-72">
              <FaSearch className="text-gray-400 text-sm" />
              <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm text-gray-700 w-full placeholder:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all">
              {dark ? <FaSun /> : <FaMoon />}
            </button>
            <button className="p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all relative">
              <FaBell />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{admin?.username}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
