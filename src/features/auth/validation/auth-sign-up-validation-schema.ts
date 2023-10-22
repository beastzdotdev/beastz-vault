import * as yup from 'yup';
import { Gender } from '../../../models/enum/gender.enum';
import { passwordSchema } from './password-validation-schema';

export const signUpFieldsSchema = yup.object().shape({
  userName: yup.string().required('Field required').max(255),
  firstName: yup.string().required('Field required').max(255),
  lastName: yup.string().required('Field required').max(255),
  email: yup.string().required('Field required').max(255),
  birthDate: yup.string().required('Field required').max(255),
  password: passwordSchema,

  repeatPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),

  gender: yup
    .mixed<Gender>()
    .oneOf(Object.values(Gender), 'Field gender is required')
    .required('Field required'),
});
