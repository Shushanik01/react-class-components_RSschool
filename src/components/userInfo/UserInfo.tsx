import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addUserInfo } from '../../slices/userInfoSlice';
import { userSchema } from './userSchema';
import type { UserInfo } from '../../slices/userInfoSlice';

type FormErrors = Partial<Record<keyof UserInfo, string>>;

export default function UserInfoUncontrolled() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(formRef.current!);

    const result = userSchema.safeParse({
      name: data.get('name'),
      email: data.get('email'),
      gender: data.get('gender'),
      age: data.get('age'),
      termsAccepted: data.get('termsAccepted') === 'on',
    });

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof UserInfo;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    dispatch(addUserInfo(result.data));
  };

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name</label>
        <input type="text" name="name" id="name" />
        {errors.name && <span>{errors.name}</span>}

        <label htmlFor="email">Enter your email</label>
        <input type="text" name="email" id="email" />
        {errors.email && <span>{errors.email}</span>}

        <label htmlFor="gender">Select your gender</label>
        <select name="gender" id="gender">
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="none">none</option>
        </select>
        {errors.gender && <span>{errors.gender}</span>}

        <label htmlFor="age">Enter your age</label>
        <input type="number" name="age" id="age" />
        {errors.age && <span>{errors.age}</span>}

        <label htmlFor="termsAccepted">I agree with your terms and conditions</label>
        <input type="checkbox" name="termsAccepted" id="termsAccepted" />
        {errors.termsAccepted && <span>{errors.termsAccepted}</span>}

        <button>Submit</button>
      </form>
    </div>
  );
}
