import { render, screen, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Submitions from '../components/userInfo/submitions';
import userInfoReducer, { addUserInfo } from '../slices/userInfoSlice';
import type { UserInfo } from '../slices/userInfoSlice';

const submission: UserInfo = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  gender: 'female',
  age: 25,
  image: 'data:image/png;base64,test',
  password: 'Pass123!',
  confirmPassword: 'Pass123!',
  country: 'Armenia',
  termsAccepted: true,
};

const createStore = (submissions: UserInfo[] = []) =>
  configureStore({
    reducer: { userInfo: userInfoReducer },
    preloadedState: { userInfo: submissions },
  });

const renderWithStore = (submissions: UserInfo[] = []) => {
  const store = createStore(submissions);
  const result = render(
    <Provider store={store}>
      <Submitions />
    </Provider>
  );
  return { ...result, store };
};

describe('Submitions', () => {
  describe('rendering', () => {
    it('shows a fallback message when there are no submissions', () => {
      renderWithStore([]);
      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });

    it('renders name and email', () => {
      renderWithStore([submission]);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('renders gender, age, and country', () => {
      renderWithStore([submission]);
      expect(screen.getByText('female')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('Armenia')).toBeInTheDocument();
    });

    it('shows "Agreed" when terms are accepted', () => {
      renderWithStore([submission]);
      expect(screen.getByText('Agreed')).toBeInTheDocument();
    });

    it('shows "Not agreed" when terms are not accepted', () => {
      renderWithStore([{ ...submission, termsAccepted: false }]);
      expect(screen.getByText('Not agreed')).toBeInTheDocument();
    });

    it('renders the profile image when provided', () => {
      renderWithStore([submission]);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('src', submission.image as string);
      expect(img).toHaveAttribute('alt', 'Jane Doe');
    });

    it('does not render an image when image is empty', () => {
      renderWithStore([{ ...submission, image: '' }]);
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('renders multiple submissions', () => {
      const second: UserInfo = { ...submission, name: 'John Smith' };
      renderWithStore([submission, second]);
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  describe('visual highlight on new submission', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
      vi.runAllTimers();
      vi.useRealTimers();
    });

    it('applies colored border and background to the newly added submission', () => {
      const { store } = renderWithStore([]);

      act(() => {
        store.dispatch(addUserInfo(submission));
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      const entry = screen.getByText('Jane Doe').parentElement!;
      expect(entry).toHaveStyle({ border: '2px solid #4caf50' });
      expect(entry).toHaveStyle({ background: '#f0fff4' });
    });

    it('removes the highlight after 3 seconds', () => {
      const { store } = renderWithStore([]);

      act(() => {
        store.dispatch(addUserInfo(submission));
      });

      act(() => {
        vi.advanceTimersByTime(3001);
      });

      const entry = screen.getByText('Jane Doe').parentElement!;
      expect(entry).toHaveStyle({ border: '2px solid transparent' });
      expect(entry).toHaveStyle({ background: 'transparent' });
    });

    it('only highlights the most recently added submission, not earlier ones', () => {
      const first: UserInfo = { ...submission, name: 'Alice' };
      const second: UserInfo = { ...submission, name: 'Bob' };
      const { store } = renderWithStore([first]);

      act(() => {
        store.dispatch(addUserInfo(second));
      });

      act(() => {
        vi.advanceTimersByTime(1);
      });

      const firstEntry = screen.getByText('Alice').parentElement!;
      const secondEntry = screen.getByText('Bob').parentElement!;
      expect(firstEntry).toHaveStyle({ border: '2px solid transparent' });
      expect(secondEntry).toHaveStyle({ border: '2px solid #4caf50' });
    });
  });
});
