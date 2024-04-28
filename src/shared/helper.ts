import queryString from 'query-string';

import { ZodError, z } from 'zod';
import { FormikValidationError, GeneralFileType } from './types';
import { constants } from './constants';
import { FileMimeType } from './enum/file-mimte-type.enum';

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
          // console.warn('Custom: Firing zod formik errors', error.formErrors.fieldErrors);

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

export const getColorByBgColor = (bgColor: string | null) => {
  if (!bgColor) {
    return null;
  }

  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff';
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

//TODO: not supported yet
/**
 * FileMimeType.TEXT_MARKDOWN
 * FileMimeType.APPLICATION_JSON
 * FileMimeType.APPLICATION_XML
 * FileMimeType.APPLICATION_PDF
 * FileMimeType.APPLICATION_OCTET_STREAM
 * @param value
 * @returns
 */
export const differentiate = (value: FileMimeType | null): GeneralFileType => {
  if (!value) {
    return 'other';
  }

  switch (value) {
    case FileMimeType.TEXT_PLAIN:
      return 'text';
    case FileMimeType.APPLICATION_OCTET_STREAM:
      return 'byte';
    case FileMimeType.IMAGE_JPG:
    case FileMimeType.IMAGE_PNG:
    case FileMimeType.IMAGE_GIF:
    case FileMimeType.IMAGE_WEBP:
    case FileMimeType.IMAGE_BMP:
    case FileMimeType.IMAGE_SVG:
      return 'image';
    case FileMimeType.AUDIO_MPEG:
    case FileMimeType.AUDIO_WAV:
      return 'audio';
    case FileMimeType.VIDEO_MP4:
    case FileMimeType.VIDEO_MPEG:
    case FileMimeType.VIDEO_WEBM:
    case FileMimeType.VIDEO_QUICKTIME:
      return 'video';
    default:
      return 'other';
  }
};

export const download = (obj: Blob | MediaSource, title: string) => {
  const url = window.URL.createObjectURL(obj);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', title);
  document.body.appendChild(link);
  link.click();
};

export const openLink = (path?: string | null) => {
  path ? window.open(path, '_blank') : null;
};

export const readTextFromFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      resolve(e.target?.result as string);
    };

    reader.onerror = () => {
      reject(null);
    };

    reader.readAsText(file);
  });
};

// function readFileAsBytes(file: File): Promise<Uint8Array | null> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = function (event) {
//       resolve(new Uint8Array(event.target?.result as ArrayBuffer));
//     };

//     reader.onerror = function (event) {
//       console.log('='.repeat(20));
//       console.log(event.target?.error);

//       reject(null);
//     };

//     reader.readAsArrayBuffer(file);
//   });
// }
