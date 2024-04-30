import { ClientApiError } from './errors/client-error.schema';
import { ExceptionMessageCode } from './enum/exception-message-code.enum';

export type Combine<T, U> = T & U;

export type AxiosApiResponse<T> = {
  data?: T;
  error?: ClientApiError;
};

export type Pagination<T> = {
  data: T[];
  total: number;
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

export type GeneralFileType = 'text' | 'image' | 'audio' | 'video' | 'byte' | 'other';

export type FSQueryParams = { id: 'root' } | { id: number; root_parent_id: number; path: string };

export type Calbacks<T = undefined, E = undefined> = {
  successCallback?: T extends undefined ? () => void : (value: T) => void;
  errorCallback?: E extends undefined ? () => void : (err: E) => void;
};
