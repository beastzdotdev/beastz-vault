import { ClientApiError } from './client-error.schema';

export type AxiosApiResponse<T> = {
  data?: T;
  error?: ClientApiError;
};

export type GeneralClass<T> = {
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
