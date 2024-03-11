import { plainToInstance } from 'class-transformer';
import { api } from '..';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import {
  BasicFileStructureResponseDto,
  DetectDuplicateResponseDto,
} from './file-structure-api.schema';

@Singleton
export class FileStructureApiService {
  async getContent(parentId?: number): Promise<AxiosApiResponse<BasicFileStructureResponseDto[]>> {
    try {
      const result = await api.get(`file-structure/content`, { params: { parentId } });

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

  async detectDuplicate(params: {
    titles: string[];
    parentId?: number;
    isFile: boolean;
  }): Promise<AxiosApiResponse<DetectDuplicateResponseDto[]>> {
    try {
      const result = await api.get(`file-structure/detect-duplicate`, { params });

      return {
        data: result.data,
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async uploadFile(params: {
    file: File;
    keepBoth: boolean;
    parentId?: number;
    rootParentId?: number;
  }): Promise<AxiosApiResponse<BasicFileStructureResponseDto>> {
    const { file, parentId, rootParentId } = params;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('keepBoth', params.keepBoth.toString());

    if (parentId) {
      formData.append('parentId', parentId.toString());
    }
    if (rootParentId) {
      formData.append('rootParentId', rootParentId.toString());
    }
    if (file.lastModified) {
      formData.append('lastModifiedAt', new Date(file.lastModified).toISOString());
    }

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
    keepBoth: boolean;
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
