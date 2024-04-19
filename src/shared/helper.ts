import queryString from 'query-string';

import { ZodError, z } from 'zod';
import { FormikValidationError } from './types';
import { constants } from './constants';

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
          console.warn('Custom: Firing zod formik errors', error.formErrors.fieldErrors);

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

export const formatSizeRaw = (sizeInBytes: number | null): number => {
  if (!sizeInBytes) {
    return 0;
  }

  if (sizeInBytes < constants.SIZE) {
    return sizeInBytes;
  } else if (sizeInBytes < constants.SIZE ** 2) {
    return parseFloat((sizeInBytes / constants.SIZE).toFixed(2));
  } else if (sizeInBytes < constants.SIZE ** 3) {
    return parseFloat((sizeInBytes / constants.SIZE ** 2).toFixed(2));
  } else {
    return parseFloat((sizeInBytes / constants.SIZE ** 3).toFixed(2));
  }
};

export const formatSize = (sizeInBytes: number | null): string => {
  if (!sizeInBytes) {
    return '';
  }

  if (sizeInBytes < constants.SIZE) {
    return sizeInBytes + ' bytes';
  } else if (sizeInBytes < constants.SIZE ** 2) {
    return (sizeInBytes / constants.SIZE).toFixed(2) + ' KB';
  } else if (sizeInBytes < constants.SIZE ** 3) {
    return (sizeInBytes / constants.SIZE ** 2).toFixed(2) + ' MB';
  } else {
    return (sizeInBytes / constants.SIZE ** 3).toFixed(2) + ' GB';
  }
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

export const cleanURL = (
  pathName: string,
  params?: Record<string, string | number | boolean>
): URL => {
  const url = new URL(window.location.href);
  url.pathname = pathName;

  const urlSearchParams = new URLSearchParams();

  for (const key in params) {
    urlSearchParams.set(key, params[key].toString());
  }

  url.search = urlSearchParams.toString();

  return url;
};
