import { z } from 'zod';
import { ExceptionMessageCode } from './enum/exception-message-code.enum';

export const ExceptionSchema = z.object({
  message: z.nativeEnum(ExceptionMessageCode),
  statusCode: z.number(),
});

export type ExceptionResponse = z.infer<typeof ExceptionSchema>;
