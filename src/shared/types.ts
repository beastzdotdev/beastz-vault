import { ClientApiError } from './errors/client-error.schema';
import { ExceptionMessageCode } from './enum/exception-message-code.enum';

export type AxiosApiResponse<T> = {
  data?: T;
  error?: ClientApiError;
};

export type BasicMessageResponse<T = string> = {
  message: T;
};

export type GeneralClass<T = unknown> = {
  new (...args: never[]): T;
};

export type MappedRecord<T> = {
  [key in keyof T]: T[key];
};

export type BusPayload<T = unknown> = {
  message: string;
  data?: T;
  uuid?: string;
};

export type HandleRefreshType = {
  success: boolean;
  message?: ExceptionMessageCode;
};

export type FormikValidationError = {
  name: 'ValidationError';
  inner: { path: string; message: string }[];
};
