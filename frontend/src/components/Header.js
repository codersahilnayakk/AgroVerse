import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaSignOutAlt, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          AgriConnect
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {/* Navigation for desktop */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-green-200">
                Home
              </Link>
            </li>
            <li>
              <Link to="/schemes" className="hover:text-green-200">
                Schemes
              </Link>
            </li>
            <li>
              <Link to="/forum" className="hover:text-green-200">
                Forum
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/advisory" className="hover:text-green-200">
                    Advisory
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-green-200">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    className="flex items-center hover:text-green-200"
                    onClick={onLogout}
                  >
                    <FaSignOutAlt className="mr-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="flex items-center hover:text-green-200"
                  >
                    <FaSignInAlt className="mr-1" /> Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="flex items-center hover:text-green-200"
                  >
                    <FaUser className="mr-1" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {menuOpen && (
        <div className="mt-4 px-4 md:hidden">
          <nav>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="block hover:text-green-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/schemes" 
                  className="block hover:text-green-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Schemes
                </Link>
              </li>
              <li>
                <Link 
                  to="/forum" 
                  className="block hover:text-green-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Forum
                </Link>
              </li>
              {isAuthenticated ? (
                <>
                  <li>
                    <Link 
                      to="/advisory" 
                      className="block hover:text-green-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Advisory
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/dashboard" 
                      className="block hover:text-green-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      className="flex items-center hover:text-green-200 w-full text-left"
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                    >
                      <FaSignOutAlt className="mr-1" /> Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className="flex items-center hover:text-green-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaSignInAlt className="mr-1" /> Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      className="flex items-center hover:text-green-200"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaUser className="mr-1" /> Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header; 