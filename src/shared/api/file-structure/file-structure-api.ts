import { api } from '..';
import { AxiosApiResponse, Pagination } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import {
  BasicFileStructureResponseDto,
  GetDuplicateStatusResponseDto,
  GetGeneralInfoResponseDto,
  FileStructureBinDto,
} from './file-structure-api.schema';
import { RootFileStructure } from '../../model';
import { FileStructureBin } from '../../model/file-structure-bin.model';

@Singleton
export class FileStructureApiService {
  async getContent(params?: {
    parentId?: number;
    focusRootParentId?: number;
    focusId?: number;
    isFile?: boolean;
  }): Promise<AxiosApiResponse<RootFileStructure[]>> {
    try {
      const result = await api.get<BasicFileStructureResponseDto[]>(`file-structure/content`, {
        params,
      });

      return { data: result.data.map(e => RootFileStructure.customTransform(e)) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getDuplicateStatus(params: {
    titles: string[];
    parentId?: number;
    isFile: boolean;
  }): Promise<AxiosApiResponse<GetDuplicateStatusResponseDto[]>> {
    try {
      const result = await api.get<GetDuplicateStatusResponseDto[]>(
        `file-structure/duplicate-status`,
        { params }
      );

      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getGeneralInfo(): Promise<AxiosApiResponse<GetGeneralInfoResponseDto>> {
    try {
      const result = await api.get<GetGeneralInfoResponseDto>(`file-structure/general-info`);

      return { data: result.data };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getById(id: string): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.get<BasicFileStructureResponseDto>(`file-structure/${id}`);

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async uploadFile(params: {
    file: File;
    keepBoth: boolean;
    parentId?: number;
    rootParentId?: number;
  }): Promise<AxiosApiResponse<RootFileStructure>> {
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
      const result = await api.post<BasicFileStructureResponseDto>(
        'file-structure/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async createFolder(params: {
    name: string;
    keepBoth: boolean;
    parentId?: number;
    rootParentId?: number;
  }): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.post<BasicFileStructureResponseDto>(
        'file-structure/create-folder',
        params
      );

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async getFromBin(params: {
    page: number;
    pageSize: number;
    parentId?: number;
  }): Promise<AxiosApiResponse<Pagination<FileStructureBin>>> {
    try {
      const result = await api.get<Pagination<FileStructureBinDto>>(`file-structure-bin`, {
        params,
      });

      return {
        data: {
          data: result.data.data.map(e => FileStructureBin.customTransform(e)),
          total: result.data.total,
        },
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async moveToBin(
    id: number,
    params?: {
      isInBin?: boolean;
    }
  ): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.patch<BasicFileStructureResponseDto>(
        `file-structure/move-to-bin/${id}`,
        params
      );

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
  async restoreFromBin(
    id: number,
    params?: {
      newParentId: number | null;
    }
  ): Promise<AxiosApiResponse<void>> {
    try {
      await api.patch<void>(`file-structure/restore-from-bin/${id}`, params);
      return {};
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
