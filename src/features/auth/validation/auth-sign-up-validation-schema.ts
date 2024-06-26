import { z } from 'zod';
import { passwordSchema } from './password-validation-schema';
import { Gender } from '../../../shared/enum';

export const signUpFieldsSchema = z
  .object({
    userName: z.string({ required_error: 'Field required' }).max(255),
    email: z.string({ required_error: 'Field required' }).email().max(255),
    birthDate: z.string({ required_error: 'Field required' }).max(255),
    repeatPassword: z.string({ required_error: 'Field required' }).max(255),
    password: passwordSchema,
    gender: z.nativeEnum(Gender, { required_error: 'Field gender is required' }),
  })
  // This will work after object validation
  .refine(data => data.password === data.repeatPassword, {
    path: ['repeatPassword'],
    message: "Password don't match",
  });
