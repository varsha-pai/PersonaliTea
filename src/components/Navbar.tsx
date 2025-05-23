import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a3bce0] to-[#f2c4de] flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-white font-bold">P</span>
            </motion.div>
            <span className="font-bold text-xl text-[#4a5568]">PersonaliTea</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" isActive={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/upload" isActive={isActive('/upload')}>
              Upload
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-white py-4 px-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-4">
            <MobileNavLink to="/" isActive={isActive('/')} onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/upload" isActive={isActive('/upload')} onClick={() => setIsMenuOpen(false)}>
              Upload
            </MobileNavLink>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, isActive, children }: NavLinkProps) => {
  return (
    <Link to={to} className="relative">
      <span className={`font-medium ${isActive ? 'text-[#a3bce0]' : 'text-gray-600 hover:text-[#a3bce0]'} transition-colors`}>
        {children}
      </span>
      {isActive && (
        <motion.div 
          className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#a3bce0]"
          layoutId="underline"
        />
      )}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick: () => void;
}

const MobileNavLink = ({ to, isActive, children, onClick }: MobileNavLinkProps) => {
  return (
    <Link 
      to={to} 
      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
        isActive ? 'bg-[#f2f4f8] text-[#a3bce0]' : 'text-gray-600'
      }`}
      onClick={onClick}
    >
      <span className="font-medium">{children}</span>
      {isActive && <ChevronRight size={16} />}
    </Link>
  );
};

export default Navbar;
