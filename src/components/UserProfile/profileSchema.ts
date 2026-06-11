import { z } from 'zod';
import { COUNTRIES } from '../../slices/userProfileSlice';

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .refine((val) => /[A-Z]/.test(val), 'Must contain an uppercase letter')
  .refine((val) => /[a-z]/.test(val), 'Must contain a lowercase letter')
  .refine((val) => /[0-9]/.test(val), 'Must contain a number')
  .refine(
    (val) => /[^A-Za-z0-9]/.test(val),
    'Must contain a special character'
  );

const countrySchema = z
  .string()
  .refine((val) => COUNTRIES.includes(val), 'Please select a valid country');

export const profileSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    profilePicture: z
      .any()
      .refine(
        (file) => file instanceof File && file.size > 0,
        'Please select an image'
      )
      .refine(
        (file) => !(file instanceof File) || file.size <= 5 * 1024 * 1024,
        'Image must be smaller than 5MB'
      )
      .refine(
        (file) =>
          !(file instanceof File) ||
          ['image/png', 'image/jpeg'].includes(file.type),
        'Only PNG and JPEG files are allowed'
      ),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    country: countrySchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const rhfProfileSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    profilePicture: z
      .any()
      .refine(
        (files) => files instanceof FileList && files.length > 0,
        'Please select an image'
      )
      .refine(
        (files) =>
          !(files instanceof FileList) ||
          !files[0] ||
          files[0].size <= 5 * 1024 * 1024,
        'Image must be smaller than 5MB'
      )
      .refine(
        (files) =>
          !(files instanceof FileList) ||
          !files[0] ||
          ['image/png', 'image/jpeg'].includes(files[0].type),
        'Only PNG and JPEG files are allowed'
      ),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    country: countrySchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ProfileFormOutput = z.infer<typeof profileSchema>;
export type RhfProfileFormInput = z.input<typeof rhfProfileSchema>;
export type RhfProfileFormOutput = z.infer<typeof rhfProfileSchema>;
