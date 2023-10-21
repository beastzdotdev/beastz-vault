import * as Yup from 'yup';
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
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { fields } from '../../../helper';
import { FormErrorMessage } from '../../../helper/components/error-message';
import { useInjection } from 'inversify-react';
import { AuthController } from '../state/auth.controller';
import axios from 'axios';
import { api } from '../../../shared/api';

const userSchema = Yup.object().shape({
  email: Yup.string().required('Field required'),
  password: Yup.string()
    .required('Field required')
    .min(6, 'Password must be at least 6 characters long')
    .test(
      'has-uppercase',
      'Password must contain at least 4 lowercase characters',
      function (value) {
        const lowercaseCount = (value.match(/[a-z]/g) || []).length;
        return lowercaseCount >= 4;
      }
    )
    .test('has-number', 'Password must contain at least 1 number', function (value) {
      return /\d/.test(value);
    })
    .test('has-symbol', 'Password must contain at least 1 symbol', function (value) {
      const symbolCount = (value.match(/[!@#$%^&*]/g) || []).length;
      return symbolCount >= 1;
    }),
});

export const AuthSignIn = (): React.JSX.Element => {
  const authController = useInjection(AuthController);

  const userForm = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validateOnChange: true,
    validationSchema: userSchema,
    onSubmit: values => {
      const { email, password } = values;
      userForm.resetForm();
      authController.signIn({ email, password });
    },
  });

  const userFormFields = fields<(typeof userForm)['initialValues']>();
  const [showPassword, setShowPassword] = useState(false);

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
      <Button
        rightIcon="log-in"
        text="Submit"
        onClick={() => {
          api.get('user/current').then(e => {
            console.log(e.data);
          });
        }}
      />

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
          <Button
            rightIcon="user"
            intent="primary"
            text="Demo sign in"
            onClick={() => authController.demoSignIn()}
          />
        </div>
      </ControlGroup>
    </div>
  );
};
