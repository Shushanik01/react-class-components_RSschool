import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfileUncontrolledForm from '../components/UserProfile/profileUncontrolled';
import userProfileReducer, { COUNTRIES } from '../slices/userProfileSlice';

const createStore = () =>
  configureStore({
    reducer: { userProfile: userProfileReducer },
    preloadedState: { userProfile: { profiles: [], countries: COUNTRIES } },
  });

const renderForm = (onSuccess = vi.fn()) => {
  const store = createStore();
  const result = render(
    <Provider store={store}>
      <ProfileUncontrolledForm onSuccess={onSuccess} />
    </Provider>
  );
  return { ...result, store };
};

describe('ProfileUncontrolledForm', () => {
  describe('rendering', () => {
    it('renders the form title', () => {
      renderForm();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    it('renders profile picture file input', () => {
      renderForm();
      expect(screen.getByLabelText('Profile picture')).toBeInTheDocument();
    });

    it('renders username input', () => {
      renderForm();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('renders password and confirm password inputs', () => {
      renderForm();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    });

    it('renders country input', () => {
      renderForm();
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('renders save profile button', () => {
      renderForm();
      expect(
        screen.getByRole('button', { name: 'Save profile' })
      ).toBeInTheDocument();
    });

    it('renders all four password strength indicators', () => {
      renderForm();
      expect(screen.getByText('1 number')).toBeInTheDocument();
      expect(screen.getByText('1 uppercase')).toBeInTheDocument();
      expect(screen.getByText('1 lowercase')).toBeInTheDocument();
      expect(screen.getByText('1 special char')).toBeInTheDocument();
    });
  });

  describe('password strength indicator', () => {
    it('indicators start red when password is empty', () => {
      renderForm();
      expect(screen.getByText('1 uppercase')).toHaveStyle({ color: '#dc2626' });
    });

    it('lowercase indicator turns green when password has lowercase', () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'a' },
      });
      expect(screen.getByText('1 lowercase')).toHaveStyle({ color: '#16a34a' });
    });

    it('special char indicator turns green when password has special char', () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: '!' },
      });
      expect(screen.getByText('1 special char')).toHaveStyle({
        color: '#16a34a',
      });
    });

    it('all indicators turn green for a strong password', () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'Pass123!' },
      });
      expect(screen.getByText('1 uppercase')).toHaveStyle({ color: '#16a34a' });
      expect(screen.getByText('1 lowercase')).toHaveStyle({ color: '#16a34a' });
      expect(screen.getByText('1 number')).toHaveStyle({ color: '#16a34a' });
      expect(screen.getByText('1 special char')).toHaveStyle({
        color: '#16a34a',
      });
    });
  });

  describe('validation', () => {
    it('shows error when username is empty on submit', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
      await waitFor(() => {
        expect(screen.getByText('Username is required')).toBeInTheDocument();
      });
    });

    it('shows error when no profile picture is selected', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
      await waitFor(() => {
        expect(screen.getByText('Please select an image')).toBeInTheDocument();
      });
    });

    it('shows error when password is missing uppercase', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'pass123!' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
      await waitFor(() => {
        expect(
          screen.getByText('Must contain an uppercase letter')
        ).toBeInTheDocument();
      });
    });

    it('shows error when passwords do not match', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'Pass123!' },
      });
      fireEvent.change(screen.getByLabelText('Confirm password'), {
        target: { value: 'DifferentPass1!' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('shows error for invalid country', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Country'), {
        target: { value: 'Narnia' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));
      await waitFor(() => {
        expect(
          screen.getByText('Please select a valid country')
        ).toBeInTheDocument();
      });
    });
  });

  describe('submission', () => {
    const stubFormAndReader = (result = 'data:image/png;base64,test') => {
      const file = new File(['img'], 'avatar.png', { type: 'image/png' });
      const mockReader = {
        result,
        onload: null as (() => void) | null,
        readAsDataURL: vi.fn(function (this: typeof mockReader) {
          this.onload?.();
        }),
      };
      vi.spyOn(globalThis, 'FileReader').mockImplementation(function () {
        return mockReader as unknown as FileReader;
      });

      const getMap: Record<string, unknown> = {
        profilePicture: file,
        username: 'janedoe',
        password: 'Pass123!',
        confirmPassword: 'Pass123!',
        country: 'Armenia',
      };
      vi.stubGlobal(
        'FormData',
        vi.fn(function () {
          return { get: (k: string) => getMap[k] ?? null };
        })
      );

      return mockReader;
    };

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it('dispatches addProfileDetails and calls onSuccess with valid data', async () => {
      stubFormAndReader();
      const onSuccess = vi.fn();
      const { store } = renderForm(onSuccess);

      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      const profiles = store.getState().userProfile.profiles;
      expect(profiles).toHaveLength(1);
      expect(profiles[0].username).toBe('janedoe');
      expect(profiles[0].country).toBe('Armenia');
    });

    it('stores profile picture as data URL from FileReader (image conversion)', async () => {
      const expectedDataUrl = 'data:image/png;base64,cHJvZmlsZQ==';
      stubFormAndReader(expectedDataUrl);
      const { store } = renderForm();

      fireEvent.click(screen.getByRole('button', { name: 'Save profile' }));

      await waitFor(() => {
        expect(store.getState().userProfile.profiles[0]?.profilePicture).toBe(
          expectedDataUrl
        );
      });
    });
  });
});
