import { LoaderFunctionArgs } from 'react-router-dom';
import { IocContainer } from './shared/ioc';
import { UserController } from './features/user/state/user.controller';

export const rootLoader = async (_args: LoaderFunctionArgs) => {
  const userController = IocContainer.getContainer().get(UserController);

  // api will automatically redirect if refresh token expires
  userController.setCurrentUser();

  // if () {

  // }

  //TODO check for user lock, user block, user not verified

  return 'ok';
};
