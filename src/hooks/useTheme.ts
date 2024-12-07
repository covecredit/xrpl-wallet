import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { themes } from '../types/theme';
import { hexToRgb } from '../utils/color';

export const useTheme = () => {
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    const colors = themes[currentTheme];
    
    // Set CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-rgb', hexToRgb(colors.primary));
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--secondary-rgb', hexToRgb(colors.secondary));
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--background-rgb', hexToRgb(colors.background));
    root.style.setProperty('--text', colors.text);
    root.style.setProperty('--text-rgb', hexToRgb(colors.text));

    // Set color-scheme
    root.style.setProperty('color-scheme', 'dark');
    
    // Force immediate repaint
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }, [currentTheme]);
};