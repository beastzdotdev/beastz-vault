import { LoaderFunctionArgs, redirect } from 'react-router-dom';
import { ProfileController } from './profile/state/profile.controller';
import { constants, ioc, UserApiService } from '../shared';
import { ProfileStore } from './profile/state/profile.store';
import { runInAction } from 'mobx';
import { SharedStore } from './shared/state/shared.store';

export const appLoader = async (_args: LoaderFunctionArgs) => {
  const profileController = ioc.getContainer().get(ProfileController);
  const profileStore = ioc.getContainer().get(ProfileStore);
  const sharedStore = ioc.getContainer().get(SharedStore);
  const userApiService = ioc.getContainer().get(UserApiService);

  await runInAction(async () => {
    if (!profileStore.user) {
      //TODO get error and show appropriate messages, handle error
      const { data } = await userApiService.getCurrentUser();

      // Api call will make sure whether user is locked, blocked or not verified
      sharedStore.setShouldRender(data ? true : false);

      if (data) {
        profileController.setUser(data);
      }
    }
  });

  const url = new URL(_args.request.url);

  // if request url is root redirect to {constants.path.fileStructure} route
  if (url.pathname === '/') {
    url.pathname = constants.path.fileStructure;
    return redirect(url.toString());
  }

  return 'ok';
};
