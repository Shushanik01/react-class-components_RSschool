import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty string when localStorage has no value for key', () => {
    const { result } = renderHook(() => useLocalStorage('testKey'));
    expect(result.current[0]).toBe('');
  });

  it('returns value already stored in localStorage', () => {
    localStorage.setItem('testKey', 'hello');
    const { result } = renderHook(() => useLocalStorage('testKey'));
    expect(result.current[0]).toBe('hello');
  });

  it('updates state and persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('world');
    });
    expect(result.current[0]).toBe('world');
    expect(localStorage.getItem('testKey')).toBe('world');
  });

  it('removes key from localStorage when set to empty string', () => {
    localStorage.setItem('testKey', 'hello');
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('');
    });
    expect(localStorage.getItem('testKey')).toBeNull();
  });

  it('updates correctly across multiple set calls', () => {
    const { result } = renderHook(() => useLocalStorage('testKey'));
    act(() => {
      result.current[1]('first');
    });
    act(() => {
      result.current[1]('second');
    });
    expect(result.current[0]).toBe('second');
    expect(localStorage.getItem('testKey')).toBe('second');
  });
});
