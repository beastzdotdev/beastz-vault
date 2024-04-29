import { z } from 'zod';

export const authRecoverPasswordValidationSchema = z.object({
  email: z.string({ required_error: 'Field required' }).max(255),
});
