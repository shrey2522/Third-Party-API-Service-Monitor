import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        fixed top-4 left-4 z-50 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300
        ${theme === 'dark' 
          ? 'bg-gray-800/80 text-yellow-400 border border-gray-700 hover:bg-gray-700' 
          : 'bg-white/80 text-orange-500 border border-gray-200 hover:bg-gray-50'
        }
      `}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <motion.div
            initial={false}
            animate={{
                rotate: theme === 'dark' ? 0 : 180,
                opacity: theme === 'dark' ? 1 : 0,
                scale: theme === 'dark' ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <Moon size={20} />
        </motion.div>
        
        <motion.div
            initial={false}
            animate={{
                rotate: theme === 'light' ? 0 : -180,
                opacity: theme === 'light' ? 1 : 0,
                scale: theme === 'light' ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <Sun size={20} />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
