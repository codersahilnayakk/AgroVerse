import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AgriConnect</h3>
            <p className="text-green-200">
              Empowering farmers with knowledge, community, and resources for sustainable agriculture.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/advisory" className="text-green-200 hover:text-white">
                  Advisory
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-green-200 hover:text-white">
                  Forum
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-green-200 hover:text-white">
                  Schemes
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-green-200 hover:text-white"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
            <p className="text-green-200 mb-2">
              Email: info@agriconnect.com
            </p>
            <p className="text-green-200 mb-2">
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
        
        <div className="border-t border-green-700 mt-8 pt-4 text-center text-green-300">
          <p>&copy; {year} AgriConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 