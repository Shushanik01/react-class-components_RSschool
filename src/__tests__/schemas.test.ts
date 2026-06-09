import { profileSchema } from '../components/UserProfile/profileSchema';
import { userSchema } from '../components/userInfo/userSchema';

// Password strength helper — same logic used in both form components
function getStrength(password: string) {
  return {
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

const pngFile = () => new File(['img'], 'test.png', { type: 'image/png' });

describe('getStrength (password strength helper)', () => {
  it('returns all false for empty string', () => {
    expect(getStrength('')).toEqual({
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecial: false,
    });
  });

  it('detects uppercase letter', () => {
    expect(getStrength('A').hasUppercase).toBe(true);
    expect(getStrength('a').hasUppercase).toBe(false);
  });

  it('detects lowercase letter', () => {
    expect(getStrength('a').hasLowercase).toBe(true);
    expect(getStrength('A').hasLowercase).toBe(false);
  });

  it('detects number', () => {
    expect(getStrength('1').hasNumber).toBe(true);
    expect(getStrength('a').hasNumber).toBe(false);
  });

  it('detects special character', () => {
    expect(getStrength('!').hasSpecial).toBe(true);
    expect(getStrength('aA1').hasSpecial).toBe(false);
  });

  it('returns all true for a strong password', () => {
    expect(getStrength('Pass123!')).toEqual({
      hasUppercase: true,
      hasLowercase: true,
      hasNumber: true,
      hasSpecial: true,
    });
  });
});

describe('profileSchema (validation helper)', () => {
  const validData = () => ({
    username: 'janedoe',
    profilePicture: pngFile(),
    password: 'Pass123!',
    confirmPassword: 'Pass123!',
    country: 'Armenia',
  });

  it('passes with valid data', () => {
    expect(profileSchema.safeParse(validData()).success).toBe(true);
  });

  it('fails when username is empty', () => {
    const result = profileSchema.safeParse({ ...validData(), username: '' });
    expect(result.success).toBe(false);
    const issues = result.error!.issues;
    expect(issues.some((i) => i.path[0] === 'username')).toBe(true);
  });

  it('fails when no profile picture is provided', () => {
    const result = profileSchema.safeParse({
      ...validData(),
      profilePicture: null,
    });
    expect(result.success).toBe(false);
    const issues = result.error!.issues;
    expect(issues.some((i) => i.path[0] === 'profilePicture')).toBe(true);
  });

  it('fails when passwords do not match', () => {
    const result = profileSchema.safeParse({
      ...validData(),
      confirmPassword: 'Different1!',
    });
    expect(result.success).toBe(false);
    const issues = result.error!.issues;
    expect(issues.some((i) => i.message === 'Passwords do not match')).toBe(
      true
    );
  });

  it('fails when password is missing uppercase', () => {
    const result = profileSchema.safeParse({
      ...validData(),
      password: 'pass123!',
      confirmPassword: 'pass123!',
    });
    expect(result.success).toBe(false);
  });

  it('fails when password is missing special character', () => {
    const result = profileSchema.safeParse({
      ...validData(),
      password: 'Pass1234',
      confirmPassword: 'Pass1234',
    });
    expect(result.success).toBe(false);
  });

  it('fails when country is not in the allowed list', () => {
    const result = profileSchema.safeParse({
      ...validData(),
      country: 'Narnia',
    });
    expect(result.success).toBe(false);
    const issues = result.error!.issues;
    expect(issues.some((i) => i.path[0] === 'country')).toBe(true);
  });

  it('fails when image exceeds 5MB', () => {
    const bigFile = new File([new Uint8Array(6 * 1024 * 1024)], 'big.png', {
      type: 'image/png',
    });
    const result = profileSchema.safeParse({
      ...validData(),
      profilePicture: bigFile,
    });
    expect(result.success).toBe(false);
  });
});

describe('userSchema (validation helper)', () => {
  const validData = () => ({
    name: 'Jane Doe',
    email: 'jane@example.com',
    gender: 'female' as const,
    age: 25,
    image: pngFile(),
    password: 'Pass123!',
    confirmPassword: 'Pass123!',
    country: 'Armenia',
    termsAccepted: true,
  });

  it('passes with valid data', () => {
    expect(userSchema.safeParse(validData()).success).toBe(true);
  });

  it('fails when name is too short', () => {
    const result = userSchema.safeParse({ ...validData(), name: 'J' });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'name')).toBe(true);
  });

  it('fails when name does not start with uppercase', () => {
    const result = userSchema.safeParse({ ...validData(), name: 'jane doe' });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'name')).toBe(true);
  });

  it('fails for invalid email', () => {
    const result = userSchema.safeParse({
      ...validData(),
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'email')).toBe(true);
  });

  it('fails for invalid gender value', () => {
    const result = userSchema.safeParse({ ...validData(), gender: 'other' });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'gender')).toBe(true);
  });

  it('fails when age is negative', () => {
    const result = userSchema.safeParse({ ...validData(), age: -1 });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'age')).toBe(true);
  });

  it('fails when age exceeds 120', () => {
    const result = userSchema.safeParse({ ...validData(), age: 150 });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'age')).toBe(true);
  });

  it('fails when password has no uppercase', () => {
    const result = userSchema.safeParse({
      ...validData(),
      password: 'pass123!',
      confirmPassword: 'pass123!',
    });
    expect(result.success).toBe(false);
  });

  it('fails when passwords do not match', () => {
    const result = userSchema.safeParse({
      ...validData(),
      confirmPassword: 'Wrong123!',
    });
    expect(result.success).toBe(false);
    expect(
      result.error!.issues.some((i) => i.message === 'Passwords do not match')
    ).toBe(true);
  });

  it('fails when country is not in the list', () => {
    const result = userSchema.safeParse({
      ...validData(),
      country: 'Atlantis',
    });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === 'country')).toBe(
      true
    );
  });

  it('fails when terms are not accepted', () => {
    const result = userSchema.safeParse({
      ...validData(),
      termsAccepted: false,
    });
    expect(result.success).toBe(false);
    expect(
      result.error!.issues.some((i) => i.path[0] === 'termsAccepted')
    ).toBe(true);
  });

  it('coerces string age to number', () => {
    const result = userSchema.safeParse({ ...validData(), age: '30' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.age).toBe(30);
  });
});
