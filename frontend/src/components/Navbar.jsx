import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaSeedling } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import GoogleTranslate from './GoogleTranslate';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  const navBg = isHome && !scrolled
    ? 'bg-transparent'
    : 'navbar-premium';

  const textColor = isHome && !scrolled
    ? 'text-white/80 hover:text-white'
    : 'text-gray-700 hover:text-emerald-600';

  const brandColor = isHome && !scrolled
    ? 'text-white'
    : 'text-emerald-700';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg} ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <FaSeedling className="text-white text-sm" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${brandColor} transition-colors`}>
              Agro<span className="font-extrabold">Verse</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/advisory', label: 'Advisory' },
              { to: '/forum', label: 'Forum' },
              { to: '/schemes', label: 'Schemes' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === item.to
                    ? (isHome && !scrolled ? 'bg-white/10 text-white' : 'bg-emerald-50 text-emerald-700')
                    : textColor
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <GoogleTranslate />
            {user ? (
              <div className="relative group">
                <button className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${textColor}`}>
                  <span>{user.name}</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10 hidden group-hover:block">
                  <Link to="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors">Dashboard</Link>
                  <Link to="/profile" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition-colors">Profile</Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${textColor}`}>
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <GoogleTranslate />
            <button onClick={toggleMenu} className={`p-2 rounded-lg transition-colors ${isHome && !scrolled ? 'text-white' : 'text-gray-700'}`}>
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-6 py-4 space-y-1">
            {[
              { to: '/', label: 'Home' },
              { to: '/advisory', label: 'Advisory' },
              { to: '/forum', label: 'Forum' },
              { to: '/schemes', label: 'Schemes' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-medium transition-colors" onClick={toggleMenu}>
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-emerald-50 text-sm font-medium" onClick={toggleMenu}>Dashboard</Link>
                <Link to="/profile" className="block py-2.5 px-3 rounded-lg text-gray-700 hover:bg-emerald-50 text-sm font-medium" onClick={toggleMenu}>Profile</Link>
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="block w-full text-left py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1 text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50" onClick={toggleMenu}>Login</Link>
                <Link to="/register" className="flex-1 text-center py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700" onClick={toggleMenu}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;