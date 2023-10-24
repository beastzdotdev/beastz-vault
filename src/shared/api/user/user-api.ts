import { AxiosResponse } from 'axios';
import { api } from '..';
import { AxiosApiResponse } from '../../../models/general';
import { ClientApiError } from '../../../models/client-error.schema';
import { UserResponseDto } from './user-api.schema';
import { Singleton } from '../../decorators';

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
