import {
  Button,
  Classes,
  ControlGroup,
  FormGroup,
  H2,
  InputGroup,
  Intent,
  Tooltip,
} from '@blueprintjs/core';
import { useState } from 'react';
import { useFormik } from 'formik';
import { fields } from '../helper';
import * as Yup from 'yup';
import { FormErrorMessage } from '../helper/components/error-message';
import { useNavigate } from 'react-router-dom';

const userSchema = Yup.object().shape({
  email: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
});

export const AuthSignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const userForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    validationSchema: userSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // await signUp(values.email, values.password);
        navigate('/');
      } catch (e: unknown) {
        // showErrorMessage(handleFirebaseError(e));
      } finally {
        resetForm();
      }
    },
  });
  const userFormFields = fields<(typeof userForm)['initialValues']>();

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
    <div style={{ margin: '100px auto', width: 'fit-content' }}>
      <H2>Sign up</H2>
      <br />

      <ControlGroup fill={true} vertical={true} style={{ width: '500px' }}>
        <FormGroup label="Email" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.email ? Intent.DANGER : Intent.NONE}
            placeholder="Enter email"
            name={userFormFields.email}
            value={userForm.values.email}
            onChange={userForm.handleChange}
          />
          <FormErrorMessage message={userForm.errors.email} />
        </FormGroup>

        <br />
        <FormGroup label="Password" labelInfo="(required)">
          <InputGroup
            intent={userForm.errors.password ? Intent.DANGER : Intent.NONE}
            name={userFormFields.password}
            placeholder="Enter password"
            value={userForm.values.password}
            onChange={userForm.handleChange}
            type={showPassword ? 'text' : 'password'}
            rightElement={lockButton}
          />
          <FormErrorMessage message={userForm.errors.password} />
        </FormGroup>

        <br />
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button rightIcon="log-in" text="Sign up" onClick={userForm.submitForm} />
        </div>
      </ControlGroup>
    </div>
  );
};
