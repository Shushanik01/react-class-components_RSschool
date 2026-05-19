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
});
