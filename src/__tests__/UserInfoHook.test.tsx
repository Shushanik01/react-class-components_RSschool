import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserInfoHook from '../components/userInfo/UserInfoHook';
import userInfoReducer from '../slices/userInfoSlice';

const createStore = () =>
  configureStore({ reducer: { userInfo: userInfoReducer } });

const renderForm = (onSuccess = vi.fn()) => {
  const store = createStore();
  const result = render(
    <Provider store={store}>
      <UserInfoHook onSuccess={onSuccess} />
    </Provider>
  );
  return { ...result, store };
};

const makeFileList = (file: File): FileList => {
  const list = Object.create(FileList.prototype) as FileList;
  Object.defineProperty(list, 'length', { value: 1 });
  Object.defineProperty(list, '0', { value: file });
  return list;
};

const fillValidForm = async () => {
  const file = new File(['img'], 'avatar.png', { type: 'image/png' });

  fireEvent.change(screen.getByLabelText('Name'), {
    target: { value: 'Jane Doe' },
  });
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'jane@example.com' },
  });
  fireEvent.change(screen.getByLabelText('Gender'), {
    target: { value: 'female' },
  });
  fireEvent.change(screen.getByLabelText('Age'), { target: { value: '25' } });
  fireEvent.change(screen.getByLabelText('Profile image'), {
    target: { files: makeFileList(file) },
  });
  fireEvent.change(screen.getByLabelText('Password'), {
    target: { value: 'Pass123!' },
  });
  fireEvent.change(screen.getByLabelText('Confirm password'), {
    target: { value: 'Pass123!' },
  });
  fireEvent.change(screen.getByLabelText('Country'), {
    target: { value: 'Armenia' },
  });
  fireEvent.click(
    screen.getByLabelText(/I agree to the terms and conditions/i)
  );

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
  });
};

describe('UserInfoHook', () => {
  describe('rendering', () => {
    it('renders the form title', () => {
      renderForm();
      expect(screen.getByText('User Information (RHF)')).toBeInTheDocument();
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
    it('submit button is disabled initially', () => {
      renderForm();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    });

    it('shows error when name does not start with uppercase', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Name'), {
        target: { value: 'jane doe' },
      });
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
      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      });
    });

    it('shows error when password is too weak', async () => {
      renderForm();
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'weakpass' },
      });
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
        target: { value: 'Different1!' },
      });
      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('submit button becomes enabled when all fields are valid', async () => {
      renderForm();
      await fillValidForm();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled();
    });
  });

  describe('submission', () => {
    const mockFileReader = (result = 'data:image/png;base64,test') => {
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
      return mockReader;
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('dispatches addUserInfo and calls onSuccess with valid data', async () => {
      mockFileReader();
      const onSuccess = vi.fn();
      const { store } = renderForm(onSuccess);

      await fillValidForm();
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
      mockFileReader(expectedDataUrl);
      const { store } = renderForm();

      await fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(store.getState().userInfo[0]?.image).toBe(expectedDataUrl);
      });
    });
  });
});
