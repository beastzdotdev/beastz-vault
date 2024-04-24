import { LoaderFunctionArgs } from 'react-router-dom';
import { ioc } from '../../shared/ioc';
import { UserSupportApiService } from '../../shared/api';
import { UserSupportStore } from './state/user-support.store';

export const userSupportTicketLoader = async (_args: LoaderFunctionArgs) => {
  const userSupportApiService = ioc.getContainer().get(UserSupportApiService);
  const userSupportStore = ioc.getContainer().get(UserSupportStore);

  const { data, error } = await userSupportApiService.getAll({ page: 1, pageSize: 100 });

  if (error || !data) {
    throw new Error('Sorry, something went wrong loading data');
  }

  userSupportStore.setData(data.data);
  userSupportStore.setTotal(data.total);

  return 'ok';
};
