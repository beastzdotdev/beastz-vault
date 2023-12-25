import { Button } from '@blueprintjs/core';
import { api, apiPure } from '../../../shared';

class AuthenticationPayloadResponseDto {
  accessToken: string;
  refreshToken: string;
  hasEmailVerified?: boolean;
}

export const Root = () => {
  const getUsers = async () => {
    const promises = [1, 2, 3].map(x =>
      api
        .get('user/current', { params: { x } })
        .then(e => {
          console.log('='.repeat(20) + 1);
          console.log(e);
          console.log(e.data.id);
        })
        .catch(e => {
          console.log('='.repeat(20) + 2);
          console.log(e);
        })
    );

    await Promise.all(promises);
  };

  const getUser = async () => {
    try {
      const { data } = await api.get('user/current');
      console.log('='.repeat(20));
      console.log(data);
    } catch (error) {
      console.log('='.repeat(20));
      console.log(error);
    }
  };

  const test = async () => {
    console.log(123);
  };

  const login = async () => {
    const { data } = await apiPure.post<AuthenticationPayloadResponseDto>('auth/sign-in', {
      email: 'demo@gmail.com',
      password: 'jsbyangtjt37*',
    });

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>This is a demo for React Router.</div>
      <Button icon="log-out" intent="primary" text="get user" onClick={getUser} />
      <Button icon="log-out" intent="primary" text="get users" onClick={getUsers} />
      <Button icon="log-out" intent="warning" text="test" onClick={test} />
      <Button icon="log-out" intent="none" text="Login" onClick={login} />
    </div>
  );
};
