import { AxiosResponse } from 'axios';
import { api } from '..';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { UpdateUserDetailsDto, UserResponseDto } from './user-api.schema';
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

  async update(props: UpdateUserDetailsDto): Promise<AxiosApiResponse<UserResponseDto>> {
    try {
      const result: AxiosResponse = await api.patch('user/current', props);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async updateProfileImage(file: File): Promise<AxiosApiResponse<UserResponseDto>> {
    try {
      const formData = new FormData();
      formData.append('profileImageFile', file);

      // profileImageFile
      const result: AxiosResponse = await api.patch('user/current/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
