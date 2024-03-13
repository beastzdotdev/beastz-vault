import { ClientApiError } from './errors/client-error.schema';
import { ExceptionMessageCode } from './enum/exception-message-code.enum';
import { FileMimeType } from './enum/file-mimte-type.enum';

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

export type BasicFileStructure = {
  id: number;
  path: string;
  title: string;
  depth: number;
  color: string | null;
  sizeInBytes: number | null;
  fileExstensionRaw: string | null;
  mimeTypeRaw: string | null;
  mimeType: FileMimeType | null;
  isEditable: boolean | null;
  isFile: boolean;
  rootParentId: number | null;
  parentId: number | null;
  lastModifiedAt: Date | null;
  createdAt: Date;
  children: BasicFileStructure[];
};
