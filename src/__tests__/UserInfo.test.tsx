import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserInfoUncontrolled from '../components/userInfo/UserInfo';
import userInfoReducer from '../slices/userInfoSlice';

const createStore = () =>
  configureStore({ reducer: { userInfo: userInfoReducer } });

const renderForm = (onSuccess = vi.fn()) => {
  const store = createStore();
  const result = render(
    <Provider store={store}>
      <UserInfoUncontrolled onSuccess={onSuccess} />
    </Provider>
  );
  return { ...result, store };
};

describe('UserInfoUncontrolled', () => {
  describe('rendering', () => {
    it('renders the form title', () => {
      renderForm();
      expect(screen.getByText('User Information')).toBeInTheDocument();
    });

    it('renders name input', () => {
      renderForm();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
    });

    it('renders email input', () => {
      renderForm();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders gender select', () => {
      renderForm();
      expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    });

    it('renders age input', () => {
      renderForm();
      expect(screen.getByLabelText('Age')).toBeInTheDocument();
    });

    it('renders profile image file input', () => {
      renderForm();
      expect(screen.getByLabelText('Profile image')).toBeInTheDocument();
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

    it('renders terms checkbox', () => {
      renderForm();
      expect(
        screen.getByLabelText(/I agree to the terms and conditions/i)
      ).toBeInTheDocument();
    });

    it('renders submit button', () => {
      renderForm();
      expect(
        screen.getByRole('button', { name: 'Submit' })
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
    it('indicators start red (no password typed)', () => {
      renderForm();
      expect(screen.getByText('1 uppercase')).toHaveStyle({ color: '#dc2626' });
    });

    it('uppercase indicator turns green when password has uppercase', () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'A' },
      });
      expect(screen.getByText('1 uppercase')).toHaveStyle({ color: '#16a34a' });
    });

    it('number indicator turns green when password has a digit', () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: '1' },
      });
      expect(screen.getByText('1 number')).toHaveStyle({ color: '#16a34a' });
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
    it('shows error when name is empty on submit', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument();
      });
    });

    it('shows error when name does not start with uppercase', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'jane doe' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(
          screen.getByText('Name must start with an uppercase letter')
        ).toBeInTheDocument();
      });
    });

    it('shows error for invalid email', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'not-an-email' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });

    it('shows error when no image is selected', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(screen.getByText('Please select an image')).toBeInTheDocument();
      });
    });

    it('shows error when password is too weak', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'weakpass' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(
          screen.getByText('Must contain an uppercase letter')
        ).toBeInTheDocument();
      });
    });

    it('shows error when terms are not accepted', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(
          screen.getByText('You must accept the terms and conditions')
        ).toBeInTheDocument();
      });
    });

    it('clears previous errors after a new submit attempt', async () => {
      renderForm();
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() =>
        expect(
          screen.getByText('Name must be at least 2 characters')
        ).toBeInTheDocument()
      );

      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'Jane Doe' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(
          screen.queryByText('Name must be at least 2 characters')
        ).not.toBeInTheDocument();
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
        name: 'Jane Doe',
        email: 'jane@example.com',
        gender: 'female',
        age: '25',
        image: file,
        password: 'Pass123!',
        confirmPassword: 'Pass123!',
        country: 'Armenia',
        termsAccepted: 'on',
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

    it('dispatches addUserInfo and calls onSuccess with valid data', async () => {
      stubFormAndReader();
      const onSuccess = vi.fn();
      const { store } = renderForm(onSuccess);

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledTimes(1);
      });

      expect(store.getState().userInfo).toHaveLength(1);
      expect(store.getState().userInfo[0].name).toBe('Jane Doe');
      expect(store.getState().userInfo[0].email).toBe('jane@example.com');
    });

    it('stores the image as a base64 data URL from FileReader', async () => {
      const expectedDataUrl = 'data:image/png;base64,aGVsbG8=';
      stubFormAndReader(expectedDataUrl);
      const { store } = renderForm();

      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(store.getState().userInfo[0]?.image).toBe(expectedDataUrl);
      });
    });
  });
});
