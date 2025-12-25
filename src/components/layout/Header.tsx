import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';

import logo from '@/assets/logo.png';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Offers', path: '/offers' },
  { name: 'Combos', path: '/combos' },
  { name: 'New Arrivals', path: '/new-arrivals' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { getCartCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out`}
      style={{
        backgroundColor: isScrolled ? 'rgba(233, 30, 99, 0.95)' : '#E91E63',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
        padding: '0.75rem 0'
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo with hover animation - REDUCED SIZE */}
        <Link to="/" className="flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
          <img 
            src={logo} 
            alt="Mansara Foods" 
            className="h-14 md:h-16 w-auto object-contain transition-all duration-300 hover:rotate-3"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 font-medium text-sm transition-all duration-300 relative group`}
              style={{
                color: isActive(link.path) ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                animationDelay: `${index * 50}ms`
              }}
            >
              {link.name}
              
              {/* Animated underline */}
              <span 
                className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all duration-300 ${
                  isActive(link.path) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{ backgroundColor: '#FDB913' }}
              />
              
              {/* Hover background effect */}
              <span 
                className="absolute inset-0 bg-white rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center animate-in slide-in-from-right duration-300">
              <Input
                autoFocus
                placeholder="Search..."
                className="h-9 w-[200px] mr-2 bg-white transition-all duration-300 focus:w-[250px]"
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:rotate-12" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          <Link to={isAuthenticated ? "/account" : "/login"}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <User className={`h-5 w-5 transition-all duration-300 ${isAuthenticated ? 'text-yellow-300' : ''}`} />
            </Button>
          </Link>

          <Link to="/cart">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
            >
              <ShoppingCart className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
              {getCartCount() > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-in zoom-in duration-300"
                  style={{ backgroundColor: '#FDB913', color: '#1F2A7C' }}
                >
                  {getCartCount()}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu Toggle with animation */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="relative w-5 h-5">
              <Menu 
                className={`h-5 w-5 absolute transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`} 
              />
              <X 
                className={`h-5 w-5 absolute transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                }`} 
              />
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu with slide down animation */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 shadow-lg border-t overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ 
          backgroundColor: '#E91E63',
          borderTopColor: 'rgba(255, 255, 255, 0.2)'
        }}
      >
        <nav className="container py-4 flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 font-medium transition-all duration-300 rounded-lg transform hover:translate-x-2 ${
                isActive(link.path)
                  ? 'text-white'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              style={{
                backgroundColor: isActive(link.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                animationDelay: `${index * 50}ms`,
                animation: isMobileMenuOpen ? `slideInLeft 0.3s ease-out ${index * 50}ms both` : 'none'
              }}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Add keyframe animation */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;