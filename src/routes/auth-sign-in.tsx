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
import { fields } from '../helper';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { showErrorMessage } from '../helper/toast';
import { FormErrorMessage } from '../helper/components/error-message';

const userSchema = Yup.object().shape({
  email: Yup.string().required('Field required'),
  password: Yup.string().required('Field required'),
});

export const AuthSignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const UserSignIn = async (email: string, password: string, cb?: CallableFunction) => {
    try {
      // await signIn(email, password);
      navigate('/');
    } catch (e: unknown) {
      // showErrorMessage(handleFirebaseError(e));
    } finally {
      if (cb) cb();
    }
  };

  const DemoSignIn = async () => {
    try {
      await UserSignIn('demo@demo.com', 'password');
    } catch (error) {
      showErrorMessage('Demo user does not exist');
    }
  };

  const userForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    validationSchema: userSchema,
    onSubmit: async (values, clbck) => UserSignIn(values.email, values.password, clbck.resetForm),
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
      <H2>Sign in</H2>
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
          <Button rightIcon="log-in" text="Submit" onClick={userForm.submitForm} />
        </div>

        <hr className="!my-3 !border-slate-500" />

        <div>
          <Text className="bp5-text-muted mb-2">
            Don't have account, say no more use out demo account
          </Text>
          <Button rightIcon="user" intent="primary" text="Demo sign in" onClick={DemoSignIn} />
        </div>
      </ControlGroup>
    </div>
  );
};
