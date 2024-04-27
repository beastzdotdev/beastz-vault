import { z } from 'zod';
import { fields } from '../../../../shared/helper';

export const fsEncryptionValidation = z.object({
  secret: z.string({ required_error: 'Field required' }).max(256),
});

export const fsEncryptionValidationFields = fields<z.infer<typeof fsEncryptionValidation>>();
