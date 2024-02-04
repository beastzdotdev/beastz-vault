import queryString from 'query-string';

import { ZodError, z } from 'zod';
import { FormikValidationError } from '.';

export const stringEncode = (text: string): Uint8Array => new TextEncoder().encode(text);
export const stringDecode = (buffer: ArrayBuffer): string => new TextDecoder().decode(buffer);
export const base64Decode = (t: string) => {
  return new Uint8Array(
    atob(t)
      .split('')
      .map(c => c.charCodeAt(0))
  );
};

export const getQueryParams = <T extends object>(url: string): T => {
  const urlObj = new URL(url);

  return queryString.parse(urlObj.searchParams.toString(), {
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

export const isUUID = (value: string) => {
  if (typeof value !== 'string') {
    return false;
  }

  const uuidRegex = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );

  return uuidRegex.test(value);
};
