export type ThemeColor = {
  primary: string;
  secondary: string;
  background: string;
  text: string;
};

export type ThemeName = 'gold' | 'red' | 'green' | 'lightBlue' | 'darkBlue';

export const themes: Record<ThemeName, ThemeColor> = {
  gold: {
    primary: '#FFD700',
    secondary: '#4A90E2',
    background: '#1A1B26',
    text: '#E6E8E6'
  },
  red: {
    primary: '#FF4444',
    secondary: '#FF8888',
    background: '#1A1616',
    text: '#E6E8E6'
  },
  green: {
    primary: '#00CC66',
    secondary: '#66FF99',
    background: '#162016',
    text: '#E6E8E6'
  },
  lightBlue: {
    primary: '#00BFFF',
    secondary: '#87CEEB',
    background: '#1A1A26',
    text: '#E6E8E6'
  },
  darkBlue: {
    primary: '#4169E1',
    secondary: '#6495ED',
    background: '#161A26',
    text: '#E6E8E6'
  }
};