import { create } from 'zustand';
import { ThemeName, themes } from '../types/theme';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { hexToRgb } from '../utils/color';

interface ThemeState {
  currentTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const savedTheme = loadFromStorage('theme') as ThemeName || 'gold';

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: savedTheme,
  setTheme: (theme) => {
    saveToStorage('theme', theme);
    const colors = themes[theme];
    
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
    
    set({ currentTheme: theme });
  }
}));