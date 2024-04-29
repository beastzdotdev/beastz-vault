import { AxiosResponse } from 'axios';
import { api } from '..';
import { AxiosApiResponse } from '../../types';
import { RecoverPasswordSendDto, SignInAndSignUpResponse } from './auth-api-schema';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';

@Singleton
export class AuthApiService {
  async signIn(params: {
    email: string;
    password: string;
  }): Promise<AxiosApiResponse<SignInAndSignUpResponse>> {
    try {
      const result: AxiosResponse = await api.post('auth/sign-in', params);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async signUp(params: {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
    password: string;
  }): Promise<AxiosApiResponse<SignInAndSignUpResponse>> {
    try {
      const result: AxiosResponse = await api.post('auth/sign-up', params);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async verify(params: { email: string }): Promise<AxiosApiResponse<void>> {
    try {
      const result: AxiosResponse = await api.post('auth/account-verify/send', params);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
  async recoverPassword(params: RecoverPasswordSendDto): Promise<AxiosApiResponse<void>> {
    try {
      const result: AxiosResponse = await api.post('auth/recover-password/send', params);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
