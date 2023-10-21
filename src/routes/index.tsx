import { Button } from '@blueprintjs/core';
import { api, apiWithoutAuth } from '../shared/api/api';
import { constants } from '../shared/constants';

class AuthenticationPayloadResponseDto {
  accessToken: string;
  refreshToken: string;
  hasEmailVerified?: boolean;
}

export default function Index() {
  const getUsers = async () => {
    const promises = [1, 2, 3].map(x =>
      api
        .get('user/current', { params: { x } })
        .then(e => {
          console.log('='.repeat(20) + 1);
          console.log(e);
        })
        .catch(e => {
          console.log('='.repeat(20) + 2);
          console.log(e);
        })
    );

    await Promise.all(promises);

    // try {
    //   const promises = [1, 2, 3].map(() => api.get('user/current'));
    //   await Promise.all(promises);

    //   const { data } = await api.get('user/current');
    //   console.log(123);
    //   console.log(data);
    // } catch (error) {
    //   console.log('='.repeat(20));
    //   console.log(error);
    // }
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

  const refresh = async () => {
    console.log('refresh');
  };

  const login = async () => {
    const { data } = await apiWithoutAuth.post<AuthenticationPayloadResponseDto>(
      'authentication/sign-in',
      {
        email: 'giorgi@gmail.com',
        password: 'password',
      }
    );

    localStorage.setItem(constants.names.localStorageAccessToken, data.accessToken);
    localStorage.setItem(constants.names.localStorageRefreshToken, data.refreshToken);

    console.log(data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>This is a demo for React Router.</div>
      <Button icon="log-out" intent="primary" text="get user" onClick={getUser} />
      <Button icon="log-out" intent="primary" text="get users" onClick={getUsers} />
      <Button icon="log-out" intent="warning" text="refresh" onClick={refresh} />
      <Button icon="log-out" intent="none" text="Login" onClick={login} />
    </div>
  );
}
