import { z } from 'zod';

export const passwordSchema = z
  .string({ required_error: 'Field required' })
  .min(6, 'Password must be at least 6 characters long')
  .max(255)
  .refine(value => (value.match(/[a-z]/g) || []).length >= 4, {
    message: 'Password must contain at least 4 lowercase characters',
  })
  .refine(value => /\d/.test(value), {
    message: 'Password must contain at least 1 number',
  })
  .refine(value => (value.match(/[!@#$%^&*]/g) || []).length >= 1, {
    message: 'Password must contain at least 1 symbol',
  });
