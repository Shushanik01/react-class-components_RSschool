import { createContext, useContext } from 'react';

export type ThemeContextType = {
  theme: 'Light' | 'Dark';
  handleThemeChange: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme error');
  return context;
};
