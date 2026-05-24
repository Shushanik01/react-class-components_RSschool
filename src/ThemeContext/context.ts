import { createContext } from 'react';

export type ThemeContextType = {
  theme: 'Light' | 'Dark';
  handleThemeChange: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
