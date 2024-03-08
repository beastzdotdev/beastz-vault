import { z } from 'zod';
import { fields } from '../../../../shared';

export const createFolderDialogValidation = z.object({
  folderName: z.string({ required_error: 'Field required' }).max(255),
});

export const createFolderDialogValidationFields =
  fields<z.infer<typeof createFolderDialogValidation>>();
