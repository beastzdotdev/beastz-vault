import { LoaderFunctionArgs } from 'react-router-dom';
import { ProfileController } from '../features/profile/state/profile.controller';
import { SharedController } from '../features/shared/state/shared.controller';
import { UserApiService } from './api/user/user-api';
import { ioc } from './ioc';

export const rootLoader = async (_args: LoaderFunctionArgs) => {
  const profile = ioc.getContainer().get(ProfileController);
  const sharedController = ioc.getContainer().get(SharedController);
  const userApiService = ioc.getContainer().get(UserApiService);

  //TODO get error and show appropriate messages
  const { data } = await userApiService.getCurrentUser();

  // Api call will make sure whether user is locked, blocked or not verified
  sharedController.setShouldRender(data ? true : false);

  if (data) {
    profile.setUser(data);
  }

  return 'ok';
};
