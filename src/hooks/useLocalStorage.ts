import { useEffect, useState } from 'react';

export const useLocalStorage = (
  key: string
): [string, (value: string) => void] => {
  const [storedValue, setStoredValue] = useState<string>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : '';
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return '';
    }
  });

  useEffect(() => {
    try {
      if (storedValue) {
        localStorage.setItem(key, storedValue);
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
};
