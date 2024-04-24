import { LoaderFunctionArgs } from 'react-router-dom';
import { ioc } from '../../shared/ioc';
import { BinApiService } from '../../shared/api';
import { BinStore } from './state/bin.store';
import { getQueryParams } from '../../shared/helper';

export const binLoader = async (_args: LoaderFunctionArgs) => {
  const fileStructureApiService = ioc.getContainer().get(BinApiService);
  const binStore = ioc.getContainer().get(BinStore);

  const queryParams = getQueryParams<{ id?: string }>(_args.request.url);
  const parentId = queryParams.id ? parseInt(queryParams.id) : undefined;

  const { data, error } = await fileStructureApiService.getFromBin({
    page: 1,
    pageSize: 10,
    parentId,
  });

  if (error || !data) {
    throw new Error('Sorry, something went wrong loading bin data');
  }

  binStore.setData(data.data);
  binStore.setTotal(data.total);

  return 'ok';
};
