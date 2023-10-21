import { z } from 'zod';
import { ExceptionMessageCode } from './enum/exception-message-code.enum';

export const ExceptionSchema = z.object({
  code: z.nativeEnum(ExceptionMessageCode),
  status: z.number(),
});

export type ExceptionResponse = z.infer<typeof ExceptionSchema>;
