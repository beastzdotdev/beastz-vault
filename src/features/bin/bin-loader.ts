import { LoaderFunctionArgs } from 'react-router-dom';
import { ioc } from '../../shared/ioc';
import { FileStructureApiService } from '../../shared/api';
import { BinStore } from './state/bin.store';

export const binLoader = async (_args: LoaderFunctionArgs) => {
  const fileStructureApiService = ioc.getContainer().get(FileStructureApiService);
  const binStore = ioc.getContainer().get(BinStore);

  const { data, error } = await fileStructureApiService.getFromBin({
    page: 1,
    pageSize: 10,
  });

  if (error || !data) {
    throw new Error('Sorry, something went wrong loading bin data');
  }

  binStore.setData(data.data);
  binStore.setTotal(data.total);

  return 'ok';
};
