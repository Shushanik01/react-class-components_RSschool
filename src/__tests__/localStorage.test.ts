import {
  getStoredSearchTerm,
  setStoredSearchTerm,
} from '../utils/localStorage';

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getStoredSearchTerm', () => {
    it('returns empty string when nothing is stored', () => {
      expect(getStoredSearchTerm()).toBe('');
    });

    it('returns the stored value when it exists', () => {
      localStorage.setItem('searchTerm', 'pikachu');
      expect(getStoredSearchTerm()).toBe('pikachu');
    });

    it('uses the searchTerm key', () => {
      localStorage.setItem('searchTerm', 'bulbasaur');
      localStorage.setItem('otherKey', 'other');
      expect(getStoredSearchTerm()).toBe('bulbasaur');
    });
  });

  describe('setStoredSearchTerm', () => {
    it('saves value to localStorage', () => {
      setStoredSearchTerm('charmander');
      expect(localStorage.getItem('searchTerm')).toBe('charmander');
    });

    it('overwrites existing value', () => {
      setStoredSearchTerm('bulbasaur');
      setStoredSearchTerm('squirtle');
      expect(localStorage.getItem('searchTerm')).toBe('squirtle');
    });

    it('saves empty string', () => {
      setStoredSearchTerm('bulbasaur');
      setStoredSearchTerm('');
      expect(localStorage.getItem('searchTerm')).toBe('');
    });
  });
});
