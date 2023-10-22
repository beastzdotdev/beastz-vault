import { ExceptionMessageCode } from './enum/exception-message-code.enum';

export class ClientApiError {
  constructor(
    public readonly statusCode: number,
    public readonly message: ExceptionMessageCode,
    public readonly error: unknown
  ) {}
}
