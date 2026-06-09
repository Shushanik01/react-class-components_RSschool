import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addProfileDetails } from '../../slices/userProfileSlice';
import { useAppSelector } from '../../store/hooks';
import { profileSchema } from './profileSchema';
import type { ProfileFormOutput } from './profileSchema';

type ProfileErrors = Partial<Record<keyof ProfileFormOutput | 'confirmPassword', string>>;

function getStrength(password: string) {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

function ProfileUncontrolledForm() {
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
    };
    reader.readAsDataURL(file);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <label htmlFor="profilePicture">Profile picture</label>
      <input
        type="file"
        accept="image/png,image/jpeg"
        name="profilePicture"
        id="profilePicture"
      />
      {errors.profilePicture && <span>{errors.profilePicture}</span>}

      <label htmlFor="username">Username</label>
      <input type="text" name="username" id="username" />
      {errors.username && <span>{errors.username}</span>}

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}

      <div>
        <span style={{ color: strength.hasNumber ? 'green' : 'red' }}>1 number</span>{' '}
        <span style={{ color: strength.hasUppercase ? 'green' : 'red' }}>1 uppercase</span>{' '}
        <span style={{ color: strength.hasLowercase ? 'green' : 'red' }}>1 lowercase</span>{' '}
        <span style={{ color: strength.hasSpecial ? 'green' : 'red' }}>1 special character</span>
      </div>

      <label htmlFor="confirmPassword">Confirm password</label>
      <input type="password" name="confirmPassword" id="confirmPassword" />
      {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

      <label htmlFor="country">Country</label>
      <input
        type="text"
        name="country"
        id="country"
        list="uncontrolled-countries"
        autoComplete="off"
      />
      <datalist id="uncontrolled-countries">
        {countries.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {errors.country && <span>{errors.country}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default ProfileUncontrolledForm;
