import { AxiosResponse } from 'axios';
import { api } from '..';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import { FileStructure } from './file-structure-api.schema';

@Singleton
export class FileStructureApiService {
  async getRoot(): Promise<AxiosApiResponse<unknown>> {
    try {
      const result: AxiosResponse<FileStructure> = await api.get(`file-structure/root`);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getById(id: string): Promise<AxiosApiResponse<FileStructure>> {
    try {
      const result: AxiosResponse<FileStructure> = await api.get(`file-structure/${id}`);
      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async uploadFile(params: {
    file: File;
    parentId?: number;
    rootParentId?: number;
  }): Promise<AxiosApiResponse<FileStructure>> {
    const { file, parentId, rootParentId } = params;

    const formData = new FormData();
    formData.append('file', file);
    if (parentId) formData.append('parentId', parentId.toString());
    if (rootParentId) formData.append('rootParentId', rootParentId.toString());

    try {
      const result: AxiosResponse<FileStructure> = await api.post(
        'file-structure/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
