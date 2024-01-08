import { ZodError, z } from 'zod';
import { FormikValidationError } from '.';
import queryString from 'query-string';

export const stringEncode = (text: string): Uint8Array => new TextEncoder().encode(text);
export const stringDecode = (buffer: ArrayBuffer): string => new TextDecoder().decode(buffer);
export const base64Decode = (t: string) => {
  return new Uint8Array(
    atob(t)
      .split('')
      .map(c => c.charCodeAt(0))
  );
};

export const getQueryParams = <T extends object>(params: string): T => {
  return queryString.parse(params, {
    parseBooleans: true,
    parseNumbers: true,
  }) as T;
};

export const fields = <T>(): { [P in keyof T]: P } => {
  return new Proxy(
    {},
    {
      get: function (_: object, prop: string | symbol): string | symbol {
        return prop;
      },
    }
  ) as {
    [P in keyof T]: P;
  };
};

export const zodFormikErrorAdapter = <T>(
  schema: z.Schema<T>
): { validate: (obj: T) => Promise<void> } => {
  return {
    async validate(obj: T) {
      try {
        schema.parse(obj);
      } catch (error: unknown) {
        const errInstance: FormikValidationError = {
          inner: [],
          name: 'ValidationError',
        };

        if (error instanceof ZodError) {
          console.log('='.repeat(20));
          console.log(error.formErrors.fieldErrors);

          errInstance.inner = error.errors.map(e => ({
            message: e.message,
            path: e.path.join('.'),
          }));
        }

        throw errInstance;
      }
    },
  };
};
