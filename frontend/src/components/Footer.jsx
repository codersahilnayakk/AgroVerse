import React from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: '/advisory', label: 'AI Advisory' },
    { to: '/forum', label: 'Community Forum' },
    { to: '/schemes', label: 'Government Schemes' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const resources = [
    { to: '/register', label: 'Get Started' },
    { to: '/login', label: 'Login' },
    { to: '/forum', label: 'Ask Community' },
    { to: '/schemes', label: 'Scheme Finder' },
  ];

  return (
    <footer className="footer-premium text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <FaSeedling className="text-white text-sm" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Agro<span className="text-emerald-400">Verse</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              AI-powered agriculture platform empowering Indian farmers with crop advisory, government schemes, and multilingual support.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all duration-300">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-5">Platform</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-white/40 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2">
                    <FaChevronRight className="text-[8px] text-emerald-600" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-5">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link, i) => (
                <li key={i}>
                  <Link to={link.to} className="text-white/40 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2">
                    <FaChevronRight className="text-[8px] text-emerald-600" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/40 text-sm">
                <FaMapMarkerAlt className="mt-0.5 text-emerald-600 flex-shrink-0" />
                <span>AgroVerse HQ<br />Agri District, 560001</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <FaEnvelope className="text-emerald-600 flex-shrink-0" />
                <span>info@agroverse.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <FaPhone className="text-emerald-600 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            &copy; {year} AgroVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/25 text-xs hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/25 text-xs hover:text-white/50 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;