import { api } from '..';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import { BasicFileStructureResponseDto } from './file-structure-api.schema';
import { plainToInstance } from 'class-transformer';

@Singleton
export class FileStructureApiService {
  async getOnlyRoot(): Promise<AxiosApiResponse<BasicFileStructureResponseDto[]>> {
    try {
      const result = await api.get(`file-structure/only-root`);

      return {
        data: plainToInstance<BasicFileStructureResponseDto, BasicFileStructureResponseDto>(
          BasicFileStructureResponseDto,
          result.data,
          { enableImplicitConversion: true }
        ),
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getById(id: string): Promise<AxiosApiResponse<BasicFileStructureResponseDto>> {
    try {
      const result = await api.get(`file-structure/${id}`);

      return {
        data: plainToInstance(BasicFileStructureResponseDto, result.data, {
          enableImplicitConversion: true,
        }),
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async uploadFile(params: {
    file: File;
    parentId?: number;
    rootParentId?: number;
  }): Promise<AxiosApiResponse<BasicFileStructureResponseDto>> {
    const { file, parentId, rootParentId } = params;

    const formData = new FormData();
    formData.append('file', file);
    if (parentId) formData.append('parentId', parentId.toString());
    if (rootParentId) formData.append('rootParentId', rootParentId.toString());
    if (file.lastModified)
      formData.append('lastModifiedAt', new Date(file.lastModified).toISOString());

    try {
      const result = await api.post('file-structure/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        data: plainToInstance(BasicFileStructureResponseDto, result.data, {
          enableImplicitConversion: true,
        }),
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async createFolder(params: {
    name: string;
    parentId?: number;
    rootParentId?: number;
  }): Promise<AxiosApiResponse<BasicFileStructureResponseDto>> {
    try {
      const result = await api.post('file-structure/create-folder', params);

      return {
        data: plainToInstance(BasicFileStructureResponseDto, result.data, {
          enableImplicitConversion: true,
        }),
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
