import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../../slices/userInfoSlice';
import { userSchema } from './userSchema';
import type { UserInfo } from '../../slices/userInfoSlice';
import type { z } from 'zod';

type UserInfoInput = z.input<typeof userSchema>;

export default function UserInfoHook() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfoInput, unknown, UserInfo>({
    resolver: zodResolver(userSchema),
  });

  const dispatch = useDispatch();

  const sendDataToStore = (data: UserInfo) => {
    dispatch(addUserInfo(data));
  };

  return (
    <form action="submit" onSubmit={handleSubmit(sendDataToStore)}>
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

      <label htmlFor="termsAccepted">
        I agree with your terms and conditions
      </label>
      <input
        {...register('termsAccepted')}
        type="checkbox"
        id="termsAccepted"
      />
      {errors.termsAccepted && <span>{errors.termsAccepted.message}</span>}

      <button>Submit</button>
    </form>
  );
}
