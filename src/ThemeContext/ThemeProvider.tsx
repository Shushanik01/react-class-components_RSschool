import { useState, useEffect } from 'react';
import { ThemeContext } from './context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'Light' | 'Dark'>('Light');

  const handleThemeChange = () =>
    setTheme(t => (t === 'Light' ? 'Dark' : 'Light'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
