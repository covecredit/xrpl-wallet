import { create } from 'zustand';

interface ThemeState {
  theme: 'default' | 'dark';
  setTheme: (theme: 'default' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'default',
  setTheme: (theme) => set({ theme })
}));