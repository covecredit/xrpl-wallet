import React from 'react';
import { createRoot } from 'react-dom/client';
import './polyfills';
import App from './App';
import './index.css';
import { useThemeStore } from './store/themeStore';
import { ThemeName } from './types/theme';
import { loadFromStorage, saveToStorage } from './utils/storage';

// Initialize theme on first visit
const initializeTheme = () => {
  const savedTheme = loadFromStorage('theme');
  if (!savedTheme) {
    const themes: ThemeName[] = ['gold', 'red', 'green', 'lightBlue', 'darkBlue'];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    saveToStorage('theme', randomTheme);
    return randomTheme;
  }
  return savedTheme;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setTheme } = useThemeStore();
  
  React.useEffect(() => {
    const theme = initializeTheme();
    setTheme(theme);
  }, [setTheme]);

  return <>{children}</>;
};

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);