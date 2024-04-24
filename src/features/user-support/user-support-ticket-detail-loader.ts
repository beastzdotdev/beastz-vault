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

  const [supportResponse, messageResponse] = await Promise.all([
    userSupportApiService.getById(id),
    userSupportApiService.getAllMessage({ userSupportId: id, page: 1, pageSize: 100 }),
  ]);

  if (
    supportResponse.error ||
    !supportResponse.data ||
    messageResponse.error ||
    !messageResponse.data
  ) {
    throw new Error('Sorry, something went wrong loading ticket data');
  }

  userSupportStore.setSingleData(supportResponse.data);
  userSupportStore.setMessages(messageResponse.data.data);

  return 'ok';
};
