import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../../slices/userInfoSlice';
import { userSchema, COUNTRIES } from './userSchema';
import type { UserInfo } from '../../slices/userInfoSlice';
import styles from './UserInfo.module.css';

type FormErrors = Partial<Record<keyof UserInfo | 'confirmPassword', string>>;

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

export default function UserInfoUncontrolled({ onSuccess }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const strength = getStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(formRef.current!);
    const file = data.get('image') as File;

    const result = userSchema.safeParse({
      name: data.get('name'),
      email: data.get('email'),
      gender: data.get('gender'),
      age: data.get('age'),
      image: file,
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
      country: data.get('country'),
      termsAccepted: data.get('termsAccepted') === 'on',
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    const reader = new FileReader();
    reader.onload = () => {
      dispatch(addUserInfo({ ...result.data, image: reader.result as string }));
      formRef.current?.reset();
      setPassword('');
      onSuccess?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className={styles.formTitle}>User Information</h2>
      <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              className={`${styles.input}${errors.name ? ` ${styles.error}` : ''}`}
              type="text"
              name="name"
              id="name"
              placeholder="Jane Doe"
            />
            {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={`${styles.input}${errors.email ? ` ${styles.error}` : ''}`}
              type="text"
              name="email"
              id="email"
              placeholder="jane@example.com"
            />
            {errors.email && <p className={styles.errorMsg}>{errors.email}</p>}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="gender">
              Gender
            </label>
            <select
              className={`${styles.select}${errors.gender ? ` ${styles.error}` : ''}`}
              name="gender"
              id="gender"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="none">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className={styles.errorMsg}>{errors.gender}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="age">
              Age
            </label>
            <input
              className={`${styles.input}${errors.age ? ` ${styles.error}` : ''}`}
              type="number"
              name="age"
              id="age"
              placeholder="25"
              min="0"
            />
            {errors.age && <p className={styles.errorMsg}>{errors.age}</p>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="image">
            Profile image
          </label>
          <input
            className={styles.input}
            type="file"
            accept="image/png,image/jpeg"
            name="image"
            id="image"
          />
          {errors.image && <p className={styles.errorMsg}>{errors.image}</p>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={`${styles.input}${errors.password ? ` ${styles.error}` : ''}`}
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className={styles.errorMsg}>{errors.password}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              className={`${styles.input}${errors.confirmPassword ? ` ${styles.error}` : ''}`}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
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
          <label className={styles.label} htmlFor="country">
            Country
          </label>
          <input
            className={`${styles.input}${errors.country ? ` ${styles.error}` : ''}`}
            type="text"
            name="country"
            id="country"
            list="uncontrolled-user-countries"
            autoComplete="off"
            placeholder="Start typing…"
          />
          <datalist id="uncontrolled-user-countries">
            {COUNTRIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.country && (
            <p className={styles.errorMsg}>{errors.country}</p>
          )}
        </div>

        <div className={styles.checkRow}>
          <input type="checkbox" name="termsAccepted" id="termsAccepted" />
          <label className={styles.label} htmlFor="termsAccepted">
            I agree to the terms and conditions
          </label>
          {errors.termsAccepted && (
            <p className={styles.errorMsg}>{errors.termsAccepted}</p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn}>
          Submit
        </button>
      </form>
    </div>
  );
}
