import { AxiosResponse } from 'axios';
import { Singleton } from '../../../app/ioc';
import { api } from '..';

@Singleton
export class AuthApiService {
  async signIn(params: { email: string; password: string }) {
    try {
      const result: AxiosResponse = await api.post('auth/sign-in', params);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
}
