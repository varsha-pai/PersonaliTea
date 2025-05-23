import { ReactNode } from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main 
        className="flex-grow py-8 px-4 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>© 2023 PersonaliTea - Analyze personalities from messages using NLP</p>
      </footer>
    </div>
  );
};

export default Layout;
