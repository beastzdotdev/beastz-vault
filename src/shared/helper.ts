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

export const formatFileSize = (size: number): string => {
  const units: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const threshold = 1024;
  let i = 0; // Start from 0 for correct unit selection

  while (size >= threshold && i < units.length - 1) {
    size /= threshold;
    ++i;
  }

  const formattedSize = Math.max(size, 0.1).toFixed(1);

  return `${formattedSize} ${units[i]}`;
};

/**
 *
 * @example
 * classNames('foo', 'bar') // => 'foo bar'
 * classNames('foo', { bar: true }) // => 'foo bar'
 * classNames({ 'foo-bar': true }) // => 'foo-bar'
 * classNames({ 'foo-bar': false }) // => ''
 * classNames({ foo: true }, { bar: true }) // => 'foo bar'
 * classNames({ foo: true, bar: true }) // => 'foo bar'
 * classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }) // => 'foo bar baz quux'
 * classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, '') // => 'bar 1'
 */
export const classNames = (
  ...args: (string | { [className: string]: boolean } | boolean | undefined | null)[]
): string => {
  const classes: string[] = [];

  args.forEach(arg => {
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object' && arg !== null) {
      Object.keys(arg).forEach(key => {
        if (arg[key]) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
};

export const sleep = (ms: number = 1000) => new Promise(f => setTimeout(f, ms));
