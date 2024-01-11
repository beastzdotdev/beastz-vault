import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { ProfileController } from './profile/state/profile.controller';
import { constants, ioc, UserApiService } from '../shared';
import { SharedController } from './shared/state/shared.controller';
import { ProfileStore } from './profile/state/profile.store';

export const appLoader = async (_args: LoaderFunctionArgs) => {
  const profileController = ioc.getContainer().get(ProfileController);
  const profileStore = ioc.getContainer().get(ProfileStore);
  const sharedController = ioc.getContainer().get(SharedController);
  const userApiService = ioc.getContainer().get(UserApiService);

  if (!profileStore.user) {
    //TODO get error and show appropriate messages, handle error
    const { data } = await userApiService.getCurrentUser();

    // Api call will make sure whether user is locked, blocked or not verified
    sharedController.setShouldRender(data ? true : false);

    if (data) {
      profileController.setUser(data);
    }
  }

  const url = new URL(_args.request.url);

  // if request url is root redirect to {constants.path.fileStructure} route
  if (url.pathname === '/') {
    url.pathname = constants.path.fileStructure;
    return redirect(url.toString());
  }

  return 'ok';
};
