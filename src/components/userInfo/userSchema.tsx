import { z } from 'zod';

export const COUNTRIES = [
  'Armenia',
  'Australia',
  'Canada',
  'France',
  'Germany',
  'India',
  'Italy',
  'Japan',
  'Mexico',
  'Russia',
  'Spain',
  'Ukraine',
  'United Kingdom',
  'United States',
];

const commonFields = {
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .refine(
      (val) => /^[A-Z]/.test(val),
      'Name must start with an uppercase letter'
    ),
  email: z.email('Invalid email address'),
  gender: z.enum(['female', 'male', 'none'], {
    error: 'Please select a gender',
  }),
  age: z.coerce
    .number({ error: 'Age is required' })
    .min(0, 'Age cannot be negative')
    .max(120, 'Age must be at most 120'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  country: z
    .string()
    .refine((val) => COUNTRIES.includes(val), 'Country not found in the list'),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
};

// For uncontrolled form — FormData.get('image') returns a File
export const userSchema = z
  .object({
    ...commonFields,
    image: z
      .any()
      .refine(
        (file) => file instanceof File && file.size > 0,
        'Please select an image'
      )
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        'Image must be smaller than 5MB'
      )
      .refine(
        (file) => ['image/png', 'image/jpeg'].includes(file.type),
        'Only PNG and JPEG files are allowed'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// For React Hook Form — file inputs return a FileList
export const rhfUserSchema = z
  .object({
    ...commonFields,
    image: z
      .any()
      .refine(
        (files) => files instanceof FileList && files.length > 0,
        'Please select an image'
      )
      .refine(
        (files) => !files?.[0] || files[0].size <= 5 * 1024 * 1024,
        'Image must be smaller than 5MB'
      )
      .refine(
        (files) =>
          !files?.[0] || ['image/png', 'image/jpeg'].includes(files[0].type),
        'Only PNG and JPEG files are allowed'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UserInfo = z.infer<typeof userSchema>;
export type RhfUserInfo = z.infer<typeof rhfUserSchema>;
