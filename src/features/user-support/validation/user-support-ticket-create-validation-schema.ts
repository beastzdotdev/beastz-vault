import { z } from 'zod';

export const UserSupportCreateTicketFieldsSchema = z.object({
  description: z.string({ required_error: 'Field required' }).max(255),
  title: z.string({ required_error: 'Field required' }).max(255),
});
