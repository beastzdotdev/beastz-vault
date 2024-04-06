import { z } from 'zod';
import { fields } from '../../../../shared/helper';

export enum DuplicateNameChoice {
  KEEP_BOTH = 'KEEP_BOTH',
  REPLACE = 'REPLACE',
}

export const duplicateNameDialogValidation = z.object({
  selectedChoice: z.enum([DuplicateNameChoice.KEEP_BOTH, DuplicateNameChoice.REPLACE]),
});

export type DuplicateNameDialogValidation = z.infer<typeof duplicateNameDialogValidation>;
export const duplicateNameDialogValidationFields =
  fields<z.infer<typeof duplicateNameDialogValidation>>();
