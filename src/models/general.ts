import { ExceptionResponse } from './exception.schema';

export type AxiosApiResponse<T> = {
  success?: {
    data: T;
  };
  error?: ExceptionResponse;
};
