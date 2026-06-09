import reducer, { addProfileDetails, COUNTRIES } from './userProfileSlice';
import type { UserProfile } from '../types';

const validProfile: UserProfile = {
  profilePicture: 'data:image/png;base64,abc',
  username: 'janedoe',
  password: 'Pass123!',
  country: 'Armenia',
};

describe('userProfileSlice', () => {
  it('returns initial state with empty profiles and countries list', () => {
    const state = reducer(undefined, { type: '' });
    expect(state.profiles).toEqual([]);
    expect(state.countries).toEqual(COUNTRIES);
  });

  it('addProfileDetails appends a profile', () => {
    const state = reducer(undefined, addProfileDetails(validProfile));
    expect(state.profiles).toHaveLength(1);
    expect(state.profiles[0].username).toBe('janedoe');
  });

  it('addProfileDetails preserves existing profiles', () => {
    let state = reducer(undefined, addProfileDetails(validProfile));
    state = reducer(
      state,
      addProfileDetails({ ...validProfile, username: 'johndoe' })
    );
    expect(state.profiles).toHaveLength(2);
    expect(state.profiles[0].username).toBe('janedoe');
    expect(state.profiles[1].username).toBe('johndoe');
  });

  it('does not mutate the countries list', () => {
    const before = reducer(undefined, { type: '' }).countries.length;
    const state = reducer(undefined, addProfileDetails(validProfile));
    expect(state.countries).toHaveLength(before);
  });

  it('action type has correct format', () => {
    expect(addProfileDetails(validProfile).type).toBe(
      'userProfile/addProfileDetails'
    );
  });

  describe('COUNTRIES', () => {
    it('contains expected countries', () => {
      expect(COUNTRIES).toContain('Armenia');
      expect(COUNTRIES).toContain('United States');
      expect(COUNTRIES).toContain('United Kingdom');
    });

    it('has at least 10 entries', () => {
      expect(COUNTRIES.length).toBeGreaterThanOrEqual(10);
    });

    it('contains only strings', () => {
      COUNTRIES.forEach((c) => expect(typeof c).toBe('string'));
    });
  });
});
