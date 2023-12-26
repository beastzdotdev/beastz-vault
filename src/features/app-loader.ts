import { LoaderFunctionArgs } from 'react-router-dom';
import { ProfileController } from './profile/state/profile.controller';
import { ioc, UserApiService } from '../shared';
import { SharedController } from './shared/state/shared.controller';

export const appLoader = async (_args: LoaderFunctionArgs) => {
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
