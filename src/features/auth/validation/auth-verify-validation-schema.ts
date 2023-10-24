import * as yup from 'yup';

export const verifyFieldsSchema = yup.object().shape({
  email: yup.string().required('Field required').max(255),
});
