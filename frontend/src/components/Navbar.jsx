import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaSeedling } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <FaSeedling className="text-green-600 text-2xl mr-2" />
            <span className="text-xl font-bold text-green-700">AgriConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-green-600">Home</Link>
            <Link to="/advisory" className="text-gray-700 hover:text-green-600">Advisory</Link>
            <Link to="/forum" className="text-gray-700 hover:text-green-600">Forum</Link>
            <Link to="/schemes" className="text-gray-700 hover:text-green-600">Schemes</Link>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-green-600">
                  <span className="mr-1">{user.name}</span>
                  <FaUser />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-green-50">Profile</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-green-600">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-700">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t py-2">
          <div className="container mx-auto px-4 space-y-2">
            <Link to="/" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Home</Link>
            <Link to="/advisory" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Advisory</Link>
            <Link to="/forum" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Forum</Link>
            <Link to="/schemes" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Schemes</Link>
            
            <div className="border-t pt-2 mt-2">
              {user ? (
                <>
                  <Link to="/profile" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Profile</Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="block w-full text-left py-2 text-gray-700 hover:text-green-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Login</Link>
                  <Link to="/register" className="block py-2 text-gray-700 hover:text-green-600" onClick={toggleMenu}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 