import { api } from '../api';
import { AxiosApiResponse, Pagination } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import { UserSupportCreateDto, UserSupportDto, UserSupportUpdateDto } from './user-support.schema';
import { UserSupport } from '../../../features/user-support/model/user-support.model';

@Singleton
export class UserSupportApiService {
  async getAll(params: {
    page: number;
    pageSize: number;
  }): Promise<AxiosApiResponse<Pagination<UserSupport>>> {
    try {
      const result = await api.get<Pagination<UserSupportDto>>(`user-support`, { params });

      return {
        data: {
          data: result.data.data.map(e => UserSupport.customTransform(e)),
          total: result.data.total,
        },
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getById(id: number): Promise<AxiosApiResponse<UserSupport>> {
    try {
      const result = await api.get<UserSupportDto>(`user-support/${id}`);

      return { data: UserSupport.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async create(params: UserSupportCreateDto): Promise<AxiosApiResponse<UserSupport>> {
    try {
      const result = await api.post<UserSupportDto>('user-support', params);

      return { data: UserSupport.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async updateById(
    id: string | number,
    params: UserSupportUpdateDto
  ): Promise<AxiosApiResponse<UserSupport>> {
    try {
      const result = await api.patch<UserSupportDto>(`user-support/${id}`, params);

      return { data: UserSupport.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async deleteById(id: string | number): Promise<AxiosApiResponse<void>> {
    try {
      await api.delete<void>(`user-support/${id}`);

      return {};
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async deleteAll(): Promise<AxiosApiResponse<void>> {
    try {
      await api.delete<void>(`user-support`);

      return {};
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
