import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfileDisplay from '../components/UserProfile/ProfileDisplay';
import userProfileReducer, {
  COUNTRIES,
  addProfileDetails,
} from '../slices/userProfileSlice';
import type { UserProfile } from '../types';

const profile: UserProfile = {
  profilePicture: 'data:image/png;base64,abc',
  username: 'janedoe',
  password: 'Pass123!',
  country: 'Armenia',
};

const createStore = (profiles: UserProfile[] = []) =>
  configureStore({
    reducer: { userProfile: userProfileReducer },
    preloadedState: { userProfile: { profiles, countries: COUNTRIES } },
  });

const renderWithStore = (profiles: UserProfile[] = []) => {
  const store = createStore(profiles);
  const result = render(
    <Provider store={store}>
      <ProfileDisplay />
    </Provider>
  );
  return { ...result, store };
};

describe('ProfileDisplay', () => {
  describe('rendering', () => {
    it('renders nothing when profiles array is empty', () => {
      const { container } = renderWithStore([]);
      expect(container.firstChild).toBeNull();
    });

    it('renders the username and country', () => {
      renderWithStore([profile]);
      expect(screen.getByText('janedoe')).toBeInTheDocument();
      expect(screen.getByText('Armenia')).toBeInTheDocument();
    });

    it('renders the profile picture with correct src and alt', () => {
      renderWithStore([profile]);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', profile.profilePicture);
      expect(img).toHaveAttribute('alt', "janedoe's profile");
    });

    it('renders multiple profiles', () => {
      const second: UserProfile = {
        ...profile,
        username: 'johndoe',
        country: 'Germany',
      };
      renderWithStore([profile, second]);
      expect(screen.getByText('janedoe')).toBeInTheDocument();
      expect(screen.getByText('johndoe')).toBeInTheDocument();
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });
  });

  describe('visual highlight on new submission', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
      vi.runAllTimers();
      vi.useRealTimers();
    });

    it('applies colored border and background to the newly added profile', () => {
      const { store } = renderWithStore([]);

      act(() => {
        store.dispatch(addProfileDetails(profile));
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      const entry = screen.getByText('janedoe').parentElement!;
      expect(entry).toHaveStyle({ border: '2px solid #4caf50' });
      expect(entry).toHaveStyle({ background: '#f0fff4' });
    });

    it('removes the highlight after 3 seconds', () => {
      const { store } = renderWithStore([]);

      act(() => {
        store.dispatch(addProfileDetails(profile));
      });

      act(() => {
        vi.advanceTimersByTime(3001);
      });

      const entry = screen.getByText('janedoe').parentElement!;
      expect(entry).not.toHaveStyle({ border: '2px solid #4caf50' });
      expect(entry).not.toHaveStyle({ background: '#f0fff4' });
    });

    it('only highlights the most recently added profile, not earlier ones', () => {
      const first: UserProfile = { ...profile, username: 'first' };
      const second: UserProfile = { ...profile, username: 'second' };
      const { store } = renderWithStore([first]);

      act(() => {
        store.dispatch(addProfileDetails(second));
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      const firstEntry = screen.getByText('first').parentElement!;
      const secondEntry = screen.getByText('second').parentElement!;
      expect(firstEntry).not.toHaveStyle({ border: '2px solid #4caf50' });
      expect(secondEntry).toHaveStyle({ border: '2px solid #4caf50' });
    });
  });
});
