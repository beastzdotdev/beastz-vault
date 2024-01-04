import {
  Button,
  Classes,
  ControlGroup,
  FormGroup,
  H2,
  HTMLSelect,
  Icon,
  InputGroup,
  Intent,
  Tooltip,
} from '@blueprintjs/core';
import moment from 'moment';
import { useState } from 'react';
import { useFormik } from 'formik';
import { FormErrorMessage } from '../../components/form-error-message';
import { signUpFieldsSchema } from './validation/auth-sign-up-validation-schema';
import { useInjection } from 'inversify-react';
import { AuthController } from './state/auth.controller';
import { DateInput3 } from '@blueprintjs/datetime2';
import { Link } from 'react-router-dom';
import { fields, Gender, constants, zodFormikErrorAdapter } from '../../shared';

export const AuthSignUpPage = (): React.JSX.Element => {
  const authController = useInjection(AuthController);

  const userForm = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
      userName: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      gender: '',
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(signUpFieldsSchema),
    onSubmit: async (values, { resetForm }) => {
      const { repeatPassword: _, ...data } = values;
      resetForm();

      authController.signUp(data);
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
        minimal={true}
        onClick={() => setShowPassword(e => !e)}
      />
    </Tooltip>
  );

  return (
    <div style={{ margin: '50px auto 100px auto', width: 'fit-content' }}>
      <H2>Sign up</H2>
      <br />

      <ControlGroup fill={true} vertical={true} style={{ width: '500px' }}>
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

        <br />
        <FormGroup label="Repeat password" labelInfo="(required)">
          <InputGroup
            intent={
              userForm.errors.repeatPassword && showErrorMessage ? Intent.DANGER : Intent.NONE
            }
            name={userFormFields.repeatPassword}
            placeholder="Enter repeated password"
            value={userForm.values.repeatPassword}
            onChange={userForm.handleChange}
            type={showPassword ? 'text' : 'password'}
            rightElement={lockButton}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.repeatPassword} />}
        </FormGroup>

        <br />
        <FormGroup label="First name" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.firstName && showErrorMessage ? Intent.DANGER : Intent.NONE}
            placeholder="Enter first name"
            name={userFormFields.firstName}
            value={userForm.values.firstName}
            onChange={userForm.handleChange}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.firstName} />}
        </FormGroup>

        <br />
        <FormGroup label="Last name" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.lastName && showErrorMessage ? Intent.DANGER : Intent.NONE}
            placeholder="Enter last name"
            name={userFormFields.lastName}
            value={userForm.values.lastName}
            onChange={userForm.handleChange}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.lastName} />}
        </FormGroup>

        <br />
        <FormGroup label="Username" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.userName && showErrorMessage ? Intent.DANGER : Intent.NONE}
            placeholder="Enter username"
            name={userFormFields.userName}
            value={userForm.values.userName}
            onChange={userForm.handleChange}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.userName} />}
        </FormGroup>

        <br />
        <FormGroup label="Gender" labelInfo="(required)">
          <HTMLSelect
            options={['Enter gender please', ...Object.values(Gender)]}
            className={userForm.errors.gender && showErrorMessage ? 'danger-select' : ''}
            fill={true}
            name={userFormFields.gender}
            value={userForm.values.gender}
            onChange={userForm.handleChange}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.gender} />}
        </FormGroup>

        <br />
        <FormGroup label="Birthdate" labelInfo="(required)">
          <DateInput3
            className={userForm.errors.birthDate && showErrorMessage ? 'bp5-intent-danger' : ''}
            placeholder="Enter birthdate"
            value={userForm.values.birthDate}
            onChange={value => userForm.setFieldValue(userFormFields.birthDate, value)}
            dateFnsFormat="dd/MM/yyyy"
            showActionsBar={true}
            minDate={moment().subtract(100, 'year').toDate()}
            maxDate={moment().toDate()}
            highlightCurrentDay={true}
            closeOnSelection={false}
            popoverProps={{ placement: 'bottom' }}
            rightElement={<Icon icon="globe" intent="primary" style={{ padding: '7px 5px' }} />}
          />
          {showErrorMessage && <FormErrorMessage message={userForm.errors.birthDate} />}
        </FormGroup>

        <p className="mt-4 ml-auto bp5-text-muted">
          Already have an account ?{' '}
          <Link to={constants.path.signIn} className="font-bold">
            Sign in
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

        <hr className="!my-3 !border-slate-500" />

        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button
            className="min-w-20"
            rightIcon="log-in"
            text="Sign up"
            onClick={() => {
              setShowErrorMessage(true);
              userForm.submitForm();
            }}
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
