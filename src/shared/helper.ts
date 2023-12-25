import { ZodError, z } from 'zod';
import { FormikValidationError } from '.';

export function fields<T>(): { [P in keyof T]: P } {
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
}

export function zodFormikErrorAdapter<T>(schema: z.Schema<T>): {
  validate: (obj: T) => Promise<void>;
} {
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
}
