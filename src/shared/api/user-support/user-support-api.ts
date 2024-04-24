import { api } from '../api';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import { UserSupportCreateDto, UserSupportDto } from './user-support.schema';
import { UserSupport } from '../../../features/user-support/model/user-support.model';

@Singleton
export class UserSupportApiService {
  async create(params: UserSupportCreateDto): Promise<AxiosApiResponse<UserSupport>> {
    try {
      const result = await api.post<UserSupportDto>('user-support', params);

      return { data: UserSupport.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
