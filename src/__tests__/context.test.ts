import { renderHook } from '@testing-library/react';
import { useTheme } from '../ThemeContext/context';

describe('useTheme', () => {
  it('throws when used outside a ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useTheme())).toThrow('useTheme error');
    consoleSpy.mockRestore();
  });
});
