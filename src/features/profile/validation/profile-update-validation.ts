import { z } from 'zod';
import { Gender } from '../../../shared/enum';

export const profileUpdateValidation = z.object({
  userName: z.string().max(255),
  birthDate: z.string().max(255),
  gender: z.nativeEnum(Gender),
});
