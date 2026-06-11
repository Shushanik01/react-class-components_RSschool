import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addProfileDetails } from '../../slices/userProfileSlice';
import { useAppSelector } from '../../store/hooks';
import { rhfProfileSchema } from './profileSchema';
import type {
  RhfProfileFormInput,
  RhfProfileFormOutput,
} from './profileSchema';

function getStrength(password: string) {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

interface Props {
  onSuccess?: () => void;
}

function ProfileRHFForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<RhfProfileFormInput, unknown, RhfProfileFormOutput>({
    resolver: zodResolver(rhfProfileSchema),
    mode: 'onChange',
  });

  const dispatch = useDispatch();
  const countries = useAppSelector((state) => state.userProfile.countries);
  const password = watch('password') ?? '';
  const strength = getStrength(password);

  const onSubmit = (data: RhfProfileFormOutput) => {
    const file = (data.profilePicture as FileList)[0];
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(
        addProfileDetails({
          profilePicture: reader.result as string,
          username: data.username,
          password: data.password,
          country: data.country,
        })
      );
      reset();
      onSuccess?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="rhf-profilePicture">Profile picture</label>
      <input
        {...register('profilePicture')}
        type="file"
        accept="image/png,image/jpeg"
        id="rhf-profilePicture"
      />
      {errors.profilePicture && (
        <span>{errors.profilePicture.message as string}</span>
      )}

      <label htmlFor="rhf-username">Username</label>
      <input {...register('username')} type="text" id="rhf-username" />
      {errors.username && <span>{errors.username.message}</span>}

      <label htmlFor="rhf-password">Password</label>
      <input {...register('password')} type="password" id="rhf-password" />
      {errors.password && <span>{errors.password.message}</span>}

      <div>
        <span style={{ color: strength.hasNumber ? 'green' : 'red' }}>
          1 number
        </span>{' '}
        <span style={{ color: strength.hasUppercase ? 'green' : 'red' }}>
          1 uppercase
        </span>{' '}
        <span style={{ color: strength.hasLowercase ? 'green' : 'red' }}>
          1 lowercase
        </span>{' '}
        <span style={{ color: strength.hasSpecial ? 'green' : 'red' }}>
          1 special character
        </span>
      </div>

      <label htmlFor="rhf-confirmPassword">Confirm password</label>
      <input
        {...register('confirmPassword')}
        type="password"
        id="rhf-confirmPassword"
      />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <label htmlFor="rhf-country">Country</label>
      <input
        {...register('country')}
        type="text"
        id="rhf-country"
        list="rhf-countries"
        autoComplete="off"
      />
      <datalist id="rhf-countries">
        {countries.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {errors.country && <span>{errors.country.message}</span>}

      <button type="submit" disabled={!isValid}>
        Submit
      </button>
    </form>
  );
}

export default ProfileRHFForm;
