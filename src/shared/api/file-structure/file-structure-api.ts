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
}
