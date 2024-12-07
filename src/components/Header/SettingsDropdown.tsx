import React, { useState } from 'react';
import { Settings, Palette, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';

const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = () => {
    setTheme(theme === 'default' ? 'dark' : 'default');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/20 transition-colors duration-200"
      >
        <Settings className="w-6 h-6 text-primary" />
        <span className="text-text">Settings</span>
        <ChevronDown className={`w-4 h-4 text-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg bg-background border border-primary/30 shadow-lg overflow-hidden z-[60]"
          >
            <div className="py-1">
              <button
                className="w-full px-4 py-2 text-left text-text hover:bg-primary/20 flex items-center space-x-2"
                onClick={handleThemeChange}
              >
                <Palette className="w-4 h-4" />
                <span>Theme ({theme})</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsDropdown;