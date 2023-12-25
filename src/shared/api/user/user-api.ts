import { AxiosResponse } from 'axios';
import { api } from '..';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { UserResponseDto } from './user-api.schema';
import { Singleton } from '../../ioc';

@Singleton
export class UserApiService {
  async getCurrentUser(): Promise<AxiosApiResponse<UserResponseDto>> {
    try {
      const result: AxiosResponse = await api.get('user/current');
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
