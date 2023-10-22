import { AxiosResponse } from 'axios';
import { Singleton } from '../../ioc';
import { api } from '..';
import { AxiosApiResponse } from '../../../models/general';
import { SignInAndSignUpResponse } from './auth-api-schema';
import { ClientApiError } from '../../../models/client-error.schema';

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
}
