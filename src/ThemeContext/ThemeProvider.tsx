import { useState, useEffect } from 'react';
import { ThemeContext } from './context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<'Light' | 'Dark'>(
    () => (localStorage.getItem('selectedTheme') as 'Light' | 'Dark') || 'Light'
  );

  const handleThemeChange = () =>
    setTheme((t) => (t === 'Light' ? 'Dark' : 'Light'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('selectedTheme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, handleThemeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
