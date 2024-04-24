import { z } from 'zod';

export const UserSupportMessageFieldsSchema = z.object({
  text: z.string({ required_error: 'Field required' }).max(500),
  file: z.instanceof(File).optional(),
});
