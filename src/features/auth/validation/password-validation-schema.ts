import * as yup from 'yup';

export const passwordSchema = yup
  .string()
  .required('Field required')
  .min(6, 'Password must be at least 6 characters long')
  .test(
    'has-uppercase',
    'Password must contain at least 4 lowercase characters',
    value => (value.match(/[a-z]/g) || []).length >= 4
  )
  .test('has-number', 'Password must contain at least 1 number', value => /\d/.test(value))
  .test(
    'has-symbol',
    'Password must contain at least 1 symbol',
    value => (value.match(/[!@#$%^&*]/g) || []).length >= 1
  );
