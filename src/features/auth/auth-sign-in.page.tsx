import {
  Button,
  Classes,
  ControlGroup,
  FormGroup,
  H2,
  InputGroup,
  Intent,
  Text,
  Tooltip,
} from '@blueprintjs/core';
import { useState } from 'react';
import { useFormik } from 'formik';
import { FormErrorMessage } from '../../components/form-error-message';
import { useInjection } from 'inversify-react';
import { AuthController } from './state/auth.controller';
import { signInFieldsSchema } from './validation/auth-sign-in-validation-schema';
import { Link } from 'react-router-dom';
import { fields, constants, zodFormikErrorAdapter } from '../../shared';

export const AuthSignInPage = (): React.JSX.Element => {
  const authController = useInjection(AuthController);

  const userForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: zodFormikErrorAdapter(signInFieldsSchema),
    validateOnChange: true,
    onSubmit: (values, { resetForm }) => {
      resetForm();
      authController.signIn(values);
    },
  });

  const userFormFields = fields<(typeof userForm)['initialValues']>();
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const lockButton = (
    <Tooltip content={`${showPassword ? 'Hide' : 'Show'} Password`}>
      <Button
        icon={showPassword ? 'unlock' : 'lock'}
        intent={Intent.WARNING}
        minimal
        onClick={() => setShowPassword(e => !e)}
      />
    </Tooltip>
  );

  return (
    <div style={{ margin: '50px auto 100px auto', width: 'fit-content' }}>
      <H2>Sign in</H2>
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
        <br />
        <FormGroup label="Password" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.password && showErrorMessage ? Intent.DANGER : Intent.NONE}
            name={userFormFields.password}
            placeholder="Enter password"
            value={userForm.values.password}
            onChange={userForm.handleChange}
            type={showPassword ? 'text' : 'password'}
            rightElement={lockButton}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.password} />}
        </FormGroup>

        <p className="mt-2 ml-auto bp5-text-muted">
          Need an account ?{' '}
          <Link to={constants.path.signUp} className="font-bold">
            Sign up
          </Link>{' '}
          here
        </p>

        <p className="mt-2 ml-auto bp5-text-muted">
          Forgot your{' '}
          <Link to={constants.path.authRecoverPassword} className="font-bold">
            Password
          </Link>{' '}
          ?
        </p>

        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            rightIcon="log-in"
            text="Submit"
            onClick={() => {
              setShowErrorMessage(true);
              userForm.submitForm();
            }}
          />
        </div>
        <hr className="!my-3 !border-slate-500" />
        <div>
          <Text className="bp5-text-muted mb-2">
            Don't have account, say no more use our demo account
          </Text>

          <Button
            rightIcon="user"
            intent="primary"
            text="Demo sign in"
            onClick={() => authController.demoSignIn()}
          />
        </div>

        <p className="mt-2 ml-auto bp5-text-muted">
          Get verified{' '}
          <Link to={constants.path.authVerify} className="font-bold">
            Here
          </Link>
        </p>

        <p className="mt-2 ml-auto bp5-text-muted">
          Need help ? contact our{' '}
          <Link to={constants.path.support} className="font-bold">
            Support
          </Link>
        </p>
      </ControlGroup>
    </div>
  );
};
