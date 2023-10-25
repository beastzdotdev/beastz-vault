import { LoaderFunctionArgs } from 'react-router-dom';
import { UserController } from '../features/user/state/user.controller';
import { AppController } from '../features/app/state/app.controller';
import { UserApiService } from './api/user/user-api';
import { ioc } from './ioc';

export const rootLoader = async (_args: LoaderFunctionArgs) => {
  const userController = ioc.getContainer().get(UserController);
  const appController = ioc.getContainer().get(AppController);
  const userApiService = ioc.getContainer().get(UserApiService);

  const { data } = await userApiService.getCurrentUser();

  // Api call will make sure whether user is locked, blocked or not verified
  appController.setShouldRender(data ? true : false);

  if (data) {
    userController.setUser(data);
  }

  return 'ok';
};
