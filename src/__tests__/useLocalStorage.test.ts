import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../hooks/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty string when key does not exist', () => {
    const { result } = renderHook(() => useLocalStorage('testKey'));
    expect(result.current[0]).toBe('');
  });

  it('returns the stored value when key exists', () => {
    localStorage.setItem('testKey', 'pikachu');
    const { result } = renderHook(() => useLocalStorage('testKey'));
    expect(result.current[0]).toBe('pikachu');
  });

  it('updates state when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('bulbasaur');
    });
    expect(result.current[0]).toBe('bulbasaur');
  });

  it('saves non-empty value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('charmander');
    });
    expect(localStorage.getItem('testKey')).toBe('charmander');
  });

  it('removes key from localStorage when set to empty string', () => {
    localStorage.setItem('testKey', 'pikachu');
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('');
    });
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  it('overwrites existing value', () => {
    localStorage.setItem('testKey', 'pikachu');
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('charmander');
    });
    expect(result.current[0]).toBe('charmander');
    expect(localStorage.getItem('testKey')).toBe('charmander');
  });

  it('returns empty string when localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('Storage error');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { result } = renderHook(() => useLocalStorage('testKey'));
    expect(result.current[0]).toBe('');
    consoleSpy.mockRestore();
  });

  it('logs error and keeps state when localStorage.setItem throws', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('Storage full');
    });
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('squirtle');
    });
    expect(consoleSpy).toHaveBeenCalled();
    expect(result.current[0]).toBe('squirtle');
    consoleSpy.mockRestore();
  });
});
