import React from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-green-800 text-white pt-8 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <FaSeedling className="text-white text-2xl mr-2" />
              <span className="text-xl font-bold">AgriConnect</span>
            </Link>
            <p className="text-green-200 mb-4">
              Connecting farmers with knowledge, resources, and each other for sustainable agriculture.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-green-200 hover:text-white text-xl" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-green-200 hover:text-white text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-green-200 hover:text-white text-xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin className="text-green-200 hover:text-white text-xl" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/advisory" className="text-green-200 hover:text-white">Crop Advisory</Link>
              </li>
              <li>
                <Link to="/forum" className="text-green-200 hover:text-white">Farmer Community</Link>
              </li>
              <li>
                <Link to="/schemes" className="text-green-200 hover:text-white">Government Schemes</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-200 hover:text-white">Farming Guides</a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white">Weather Updates</a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white">Market Prices</a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white">Agricultural News</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-green-200">
              <p className="mb-2">AgriConnect Headquarters</p>
              <p className="mb-2">123 Farming Road</p>
              <p className="mb-2">Agri District, 560001</p>
              <p className="mb-2">Email: info@agriconnect.com</p>
              <p>Phone: +91 98765 43210</p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-200">
          <p>&copy; {year} AgriConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 