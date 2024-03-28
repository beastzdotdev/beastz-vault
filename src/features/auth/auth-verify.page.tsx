import {
  Button,
  Classes,
  ControlGroup,
  FormGroup,
  H2,
  InputGroup,
  Intent,
} from '@blueprintjs/core';
import { useState } from 'react';
import { useFormik } from 'formik';
import { FormErrorMessage } from '../../components/form-error-message';
import { useInjection } from 'inversify-react';
import { AuthController } from './state/auth.controller';
import { verifyFieldsSchema } from './validation/auth-verify-validation-schema';
import { Link } from 'react-router-dom';
import { fields, constants, zodFormikErrorAdapter } from '../../shared';

export const AuthVerifyPage = (): React.JSX.Element => {
  const authController = useInjection(AuthController);

  const userForm = useFormik({
    initialValues: {
      email: '',
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(verifyFieldsSchema),
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      authController.accountVerify({ email: values.email });
    },
  });

  const userFormFields = fields<(typeof userForm)['initialValues']>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  return (
    <div style={{ margin: '50px auto 100px auto', width: 'fit-content' }}>
      <H2>Account verify</H2>
      <br />

      <ControlGroup fill vertical style={{ width: '500px' }}>
        <FormGroup label="Email" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.email && showErrorMessage ? Intent.DANGER : Intent.NONE}
            placeholder="Enter email"
            name={userFormFields.email}
            value={userForm.values.email}
            onChange={userForm.handleChange}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.email} />}
        </FormGroup>

        <p className="mt-1 ml-auto bp5-text-muted">
          Go back to{' '}
          <Link to={constants.path.signIn} className="font-bold">
            sign in
          </Link>{' '}
          page
        </p>

        <br />
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            rightIcon="envelope"
            text="Verify"
            onClick={() => {
              setShowErrorMessage(true);
              userForm.submitForm();
            }}
          />
        </div>
      </ControlGroup>
    </div>
  );
};
