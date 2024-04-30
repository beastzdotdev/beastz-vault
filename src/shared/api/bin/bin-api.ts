import { api } from '../api';
import { AxiosApiResponse, Pagination } from '../../types';
import { ClientApiError } from '../../errors/client-error.schema';
import { Singleton } from '../../ioc';
import { BinDto } from './bin-api.schema';
import { Bin } from '../../../features/bin/model/bin.model';

@Singleton
export class BinApiService {
  async getFromBin(params: {
    page: number;
    pageSize: number;
    parentId?: number;
  }): Promise<AxiosApiResponse<Pagination<Bin>>> {
    try {
      const result = await api.get<Pagination<BinDto>>(`file-structure-bin`, {
        params,
      });

      return {
        data: {
          data: result.data.data.map(e => Bin.customTransform(e)),
          total: result.data.total,
        },
      };
    } catch (e: unknown) {
      return { error: e as ClientApiError };
    }
  }
}
