import * as yup from 'yup';
import { passwordSchema } from './password-validation-schema';

export const signInFieldsSchema = yup.object().shape({
  email: yup.string().required('Field required'),
  password: passwordSchema,
});
