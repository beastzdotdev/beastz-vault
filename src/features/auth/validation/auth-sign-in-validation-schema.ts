import { z } from 'zod';
import { passwordSchema } from './password-validation-schema';

export const signInFieldsSchema = z.object({
  email: z
    .string({ required_error: 'Field required' })
    .email('Invalid email address')
    .min(5, 'Email is too short'),
  password: passwordSchema,
});
