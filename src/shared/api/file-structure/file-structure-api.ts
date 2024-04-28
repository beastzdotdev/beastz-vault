import { api } from '../api';
import { AxiosApiResponse } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import { RootFileStructure } from '../../model';
import {
  BasicFileStructureResponseDto,
  GetDuplicateStatusQueryDto,
  GetDuplicateStatusResponseDto,
  GetGeneralInfoResponseDto,
} from './file-structure-api.schema';
import { download } from '../../helper';

@Singleton
export class FileStructureApiService {
  async search(params?: { search: string }): Promise<AxiosApiResponse<RootFileStructure[]>> {
    try {
      const result = await api.get<BasicFileStructureResponseDto[]>(`file-structure/search`, {
        params,
      });

      return { data: result.data.map(e => RootFileStructure.customTransform(e)) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

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

  async getDuplicateStatus(
    params: GetDuplicateStatusQueryDto
  ): Promise<AxiosApiResponse<GetDuplicateStatusResponseDto[]>> {
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

  async getDetails(params: {
    ids: number[];
    isInBin?: boolean;
  }): Promise<AxiosApiResponse<RootFileStructure[]>> {
    try {
      const result = await api.get<BasicFileStructureResponseDto[]>(`file-structure/details`, {
        params,
      });

      return { data: result.data.map(e => RootFileStructure.customTransform(e)) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async downloadById(
    id: number,
    shouldSave: boolean = true,
    params?: {
      onProgress?: (params: { loaded: number; total: number; percentCompleted: number }) => void;
    }
  ): Promise<AxiosApiResponse<{ file: File; title: string }>> {
    try {
      const result = await api.get<Blob>(`file-structure/download/${id}`, {
        responseType: 'blob',
        ...(params?.onProgress && {
          onDownloadProgress: progressEvent => {
            const { loaded, total } = progressEvent;

            if (total) {
              const percentCompleted = Math.round((loaded * 100) / total);
              params?.onProgress?.({ loaded, total, percentCompleted });
            }
          },
        }),
      });

      const fileTitle = result.headers['content-title'] ?? 'example.txt';
      const fileType = result.headers['content-type'];

      //TODO: this should not be here
      if (shouldSave) {
        download(new Blob([result.data], { type: fileType }), fileTitle);
      }

      return {
        data: {
          file: new File([result.data], fileTitle, { type: fileType }),
          title: fileTitle,
        },
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async uploadEncryptedFile(params: {
    encryptedFile: File;
    fileStructureId: number;
  }): Promise<AxiosApiResponse<RootFileStructure>> {
    const { encryptedFile, fileStructureId } = params;

    const formData = new FormData();
    formData.append('encryptedFile', encryptedFile);

    if (fileStructureId) {
      formData.append('fileStructureId', fileStructureId.toString());
    }

    try {
      const result = await api.post<BasicFileStructureResponseDto>(
        'file-structure/upload-encrypted-file',
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

  async updateById(
    id: number,
    params: {
      color?: string;
    }
  ): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.patch<BasicFileStructureResponseDto>(`file-structure/${id}`, params);

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async replaceTextById(
    id: number,
    params: { text: string }
  ): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.patch<BasicFileStructureResponseDto>(
        `file-structure/replace-text/${id}`,
        params
      );

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async moveToBin(id: number): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.patch<BasicFileStructureResponseDto>(
        `file-structure/move-to-bin/${id}`
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
  ): Promise<AxiosApiResponse<RootFileStructure>> {
    try {
      const result = await api.patch<BasicFileStructureResponseDto>(
        `file-structure/restore-from-bin/${id}`,
        params
      );

      return { data: RootFileStructure.customTransform(result.data) };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }

  async deleteForeverFromBin(id: number): Promise<AxiosApiResponse<void>> {
    try {
      await api.patch<void>(`file-structure/delete-forever-from-bin/${id}`);

      return {};
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
