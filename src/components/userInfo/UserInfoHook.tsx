import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../../slices/userInfoSlice';
import { rhfUserSchema, COUNTRIES } from './userSchema';
import type { RhfUserInfo } from './userSchema';
import type { z } from 'zod';
import styles from './UserInfo.module.css';

type UserInfoInput = z.input<typeof rhfUserSchema>;

interface Props {
  onSuccess?: () => void;
}

function getStrength(password: string) {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

export default function UserInfoHook({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<UserInfoInput, unknown, RhfUserInfo>({
    resolver: zodResolver(rhfUserSchema),
    mode: 'onChange',
  });

  const dispatch = useDispatch();
  const strength = getStrength(watch('password') ?? '');

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
    <div>
      <h2 className={styles.formTitle}>User Information (RHF)</h2>
      <form onSubmit={handleSubmit(sendDataToStore)} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="rhf-name">
              Name
            </label>
            <input
              {...register('name')}
              className={`${styles.input}${errors.name ? ` ${styles.error}` : ''}`}
              type="text"
              id="rhf-name"
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p className={styles.errorMsg}>{errors.name.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="rhf-email">
              Email
            </label>
            <input
              {...register('email')}
              className={`${styles.input}${errors.email ? ` ${styles.error}` : ''}`}
              type="text"
              id="rhf-email"
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p className={styles.errorMsg}>{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="rhf-gender">
              Gender
            </label>
            <select
              {...register('gender')}
              className={`${styles.select}${errors.gender ? ` ${styles.error}` : ''}`}
              id="rhf-gender"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="none">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className={styles.errorMsg}>{errors.gender.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="rhf-age">
              Age
            </label>
            <input
              {...register('age')}
              className={`${styles.input}${errors.age ? ` ${styles.error}` : ''}`}
              type="number"
              id="rhf-age"
              placeholder="25"
              min="0"
            />
            {errors.age && (
              <p className={styles.errorMsg}>{errors.age.message}</p>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="rhf-image">
            Profile image
          </label>
          <input
            {...register('image')}
            className={styles.input}
            type="file"
            accept="image/png,image/jpeg"
            id="rhf-image"
          />
          {errors.image && (
            <p className={styles.errorMsg}>{errors.image.message as string}</p>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="rhf-password">
              Password
            </label>
            <input
              {...register('password')}
              className={`${styles.input}${errors.password ? ` ${styles.error}` : ''}`}
              type="password"
              id="rhf-password"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className={styles.errorMsg}>{errors.password.message}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="rhf-confirmPassword">
              Confirm password
            </label>
            <input
              {...register('confirmPassword')}
              className={`${styles.input}${errors.confirmPassword ? ` ${styles.error}` : ''}`}
              type="password"
              id="rhf-confirmPassword"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className={styles.errorMsg}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className={styles.strengthRow}>
          <span style={{ color: strength.hasNumber ? '#16a34a' : '#dc2626' }}>
            1 number
          </span>
          <span
            style={{ color: strength.hasUppercase ? '#16a34a' : '#dc2626' }}
          >
            1 uppercase
          </span>
          <span
            style={{ color: strength.hasLowercase ? '#16a34a' : '#dc2626' }}
          >
            1 lowercase
          </span>
          <span style={{ color: strength.hasSpecial ? '#16a34a' : '#dc2626' }}>
            1 special char
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="rhf-country">
            Country
          </label>
          <input
            {...register('country')}
            className={`${styles.input}${errors.country ? ` ${styles.error}` : ''}`}
            type="text"
            id="rhf-country"
            list="hook-countries"
            autoComplete="off"
            placeholder="Start typing…"
          />
          <datalist id="hook-countries">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.country && (
            <p className={styles.errorMsg}>{errors.country.message}</p>
          )}
        </div>

        <div className={styles.field}>
          <div className={styles.checkRow}>
            <input
              {...register('termsAccepted')}
              type="checkbox"
              id="rhf-termsAccepted"
            />
            <label className={styles.label} htmlFor="rhf-termsAccepted">
              I agree to the terms and conditions
            </label>
          </div>
          {errors.termsAccepted && (
            <p className={styles.errorMsg}>{errors.termsAccepted.message}</p>
          )}
        </div>

        <button type="submit" disabled={!isValid} className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </div>
  );
}
