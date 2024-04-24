import { api } from '../api';
import { AxiosApiResponse, Pagination } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import {
  UserSupportCreateDto,
  UserSupportDto,
  UserSupportMessageCreateDto,
  UserSupportMessageDto,
  UserSupportUpdateDto,
} from './user-support.schema';
import { UserSupport } from '../../../features/user-support/model/user-support.model';
import { UserSupportMessage } from '../../../features/user-support/model/user-support-message.model';

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

  async getAllMessage(params: {
    userSupportId: number | string;
    page: number;
    pageSize: number;
  }): Promise<AxiosApiResponse<Pagination<UserSupportMessage>>> {
    try {
      const result = await api.get<Pagination<UserSupportMessageDto>>(`user-support-message`, {
        params,
      });

      return {
        data: {
          data: result.data.data.map(e => UserSupportMessage.customTransform(e)),
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

  async sendMessage(
    userSupportId: string | number,
    params: UserSupportMessageCreateDto
  ): Promise<AxiosApiResponse<void>> {
    const { text, file } = params;
    try {
      const formData = new FormData();

      formData.append('text', text);
      if (file) {
        formData.append('file', file);
      }

      const response = await api.post<void>(`user-support-message/${userSupportId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { data: response.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
