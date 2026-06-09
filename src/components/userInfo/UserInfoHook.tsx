import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../../slices/userInfoSlice';
import { rhfUserSchema, COUNTRIES } from './userSchema';
import type { RhfUserInfo } from './userSchema';
import type { z } from 'zod';

type UserInfoInput = z.input<typeof rhfUserSchema>;

interface Props {
  onSuccess?: () => void;
}

export default function UserInfoHook({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UserInfoInput, unknown, RhfUserInfo>({
    resolver: zodResolver(rhfUserSchema),
    mode: 'onChange',
  });

  const dispatch = useDispatch();

  const sendDataToStore = (data: RhfUserInfo) => {
    const files = data.image as FileList;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(addUserInfo({ ...data, image: reader.result as string }));
      reset();
      onSuccess?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit(sendDataToStore)}>
      <label htmlFor="name">Enter your name</label>
      <input {...register('name')} type="text" id="name" />
      {errors.name && <span>{errors.name.message}</span>}

      <label htmlFor="email">Enter your email</label>
      <input {...register('email')} type="text" id="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <label htmlFor="gender">Select your gender</label>
      <select {...register('gender')} id="gender">
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="none">none</option>
      </select>
      {errors.gender && <span>{errors.gender.message}</span>}

      <label htmlFor="age">Enter your age</label>
      <input {...register('age')} type="number" id="age" />
      {errors.age && <span>{errors.age.message}</span>}

      <label htmlFor="image">Profile image</label>
      <input
        {...register('image')}
        type="file"
        accept="image/png,image/jpeg"
        id="image"
      />
      {errors.image && <span>{errors.image.message as string}</span>}

      <label htmlFor="password">Password</label>
      <input {...register('password')} type="password" id="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <label htmlFor="confirmPassword">Confirm password</label>
      <input
        {...register('confirmPassword')}
        type="password"
        id="confirmPassword"
      />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <label htmlFor="country">Country</label>
      <input
        {...register('country')}
        type="text"
        id="country"
        list="hook-countries"
        autoComplete="off"
      />
      <datalist id="hook-countries">
        {COUNTRIES.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {errors.country && <span>{errors.country.message}</span>}

      <label htmlFor="termsAccepted">
        I agree with your terms and conditions
      </label>
      <input
        {...register('termsAccepted')}
        type="checkbox"
        id="termsAccepted"
      />
      {errors.termsAccepted && <span>{errors.termsAccepted.message}</span>}

      <button disabled={!isValid}>Submit</button>
    </form>
  );
}
