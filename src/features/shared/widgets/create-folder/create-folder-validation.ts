import { z } from 'zod';
import { fields } from '../../../../shared';

export const verifyFolderNameInput = z.object({
  folderName: z.string({ required_error: 'Field required' }).max(255),
});

export const verifyFolderNameInputFields = fields<z.infer<typeof verifyFolderNameInput>>();
