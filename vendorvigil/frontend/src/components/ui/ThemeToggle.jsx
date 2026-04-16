import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={toggleTheme}
        className={`
          relative flex items-center w-16 h-8 rounded-full p-1 cursor-pointer transition-colors duration-300 shadow-sm border
          ${isDark ? 'bg-[#0d1117] border-[#1e293b]' : 'bg-gray-200 border-gray-300'}
        `}
      >
        <span className="sr-only">Toggle theme</span>
        <div className="absolute inset-x-0 mx-auto flex justify-between w-12 text-[10px] pointer-events-none">
          <Sun size={14} className={`transition-colors duration-300 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <Moon size={14} className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
        </div>
        
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`
            relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-md
            ${isDark ? 'bg-[#388bfd]' : 'bg-white'}
          `}
          style={{ x: isDark ? '32px' : '0px' }}
        >
          {isDark ? (
            <Moon size={12} className="text-white" />
          ) : (
            <Sun size={12} className="text-orange-500" />
          )}
        </motion.div>
      </button>
    </div>
  );
};

export default ThemeToggle;
