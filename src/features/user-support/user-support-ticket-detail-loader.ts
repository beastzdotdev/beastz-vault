import { LoaderFunctionArgs } from 'react-router-dom';
import { ioc } from '../../shared/ioc';
import { UserSupportApiService } from '../../shared/api';
import { UserSupportStore } from './state/user-support.store';

export const userSupportTicketDetailLoader = async (_args: LoaderFunctionArgs) => {
  const userSupportApiService = ioc.getContainer().get(UserSupportApiService);
  const userSupportStore = ioc.getContainer().get(UserSupportStore);

  const id = _args.params?.id ? parseInt(_args.params?.id) : undefined;

  if (!id) {
    throw new Error('Sorry, something went wrong');
  }

  const { data, error } = await userSupportApiService.getById(id);

  if (error || !data) {
    throw new Error('Sorry, something went wrong loading ticket data');
  }

  userSupportStore.setSingleData(data);

  return 'ok';
};
