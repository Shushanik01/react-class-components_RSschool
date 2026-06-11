import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProfileDetails } from '../../slices/userProfileSlice';
import { useAppSelector } from '../../store/hooks';
import { profileSchema } from './profileSchema';
import type { ProfileFormOutput } from './profileSchema';
import styles from './profileUncontrolled.module.css';

type ProfileErrors = Partial<
  Record<keyof ProfileFormOutput | 'confirmPassword', string>
>;

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

function ProfileUncontrolledForm({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const countries = useAppSelector((state) => state.userProfile.countries);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [password, setPassword] = useState('');

  const strength = getStrength(password);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const file = formData.get('profilePicture') as File;

    const result = profileSchema.safeParse({
      username: formData.get('username'),
      profilePicture: file,
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      country: formData.get('country'),
    });

    if (!result.success) {
      const fieldErrors: ProfileErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ProfileErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(
        addProfileDetails({
          profilePicture: reader.result as string,
          username: result.data.username,
          password: result.data.password,
          country: result.data.country,
        })
      );
      formRef.current?.reset();
      setPassword('');
      onSuccess?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className={styles.formTitle}>Edit Profile</h2>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="profilePicture">
            Profile picture
          </label>
          <input
            className={styles.input}
            type="file"
            accept="image/png,image/jpeg"
            name="profilePicture"
            id="profilePicture"
          />
          {errors.profilePicture && (
            <p className={styles.errorMsg}>{errors.profilePicture}</p>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">
            Username
          </label>
          <input
            className={`${styles.input}${errors.username ? ` ${styles.error}` : ''}`}
            type="text"
            name="username"
            id="username"
            placeholder="johndoe"
          />
          {errors.username && (
            <p className={styles.errorMsg}>{errors.username}</p>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="profilePassword">
              Password
            </label>
            <input
              className={`${styles.input}${errors.password ? ` ${styles.error}` : ''}`}
              type="password"
              name="password"
              id="profilePassword"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className={styles.errorMsg}>{errors.password}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profileConfirmPassword">
              Confirm password
            </label>
            <input
              className={`${styles.input}${errors.confirmPassword ? ` ${styles.error}` : ''}`}
              type="password"
              name="confirmPassword"
              id="profileConfirmPassword"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className={styles.errorMsg}>{errors.confirmPassword}</p>
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
          <label className={styles.label} htmlFor="profileCountry">
            Country
          </label>
          <input
            className={`${styles.input}${errors.country ? ` ${styles.error}` : ''}`}
            type="text"
            name="country"
            id="profileCountry"
            list="uncontrolled-countries"
            autoComplete="off"
            placeholder="Start typing…"
          />
          <datalist id="uncontrolled-countries">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.country && (
            <p className={styles.errorMsg}>{errors.country}</p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Save profile
        </button>
      </form>
    </div>
  );
}

export default ProfileUncontrolledForm;
